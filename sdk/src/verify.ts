import { PublicKey } from '@solana/web3.js';
import {
  SPL402PaymentPayload,
  SolanaTransferPayload,
  SolanaTokenTransferPayload,
  VerifyPaymentResponse,
  SolanaNetwork,
} from './types';
import { createConnection, validatePublicKey, validateSignature, solToLamports, toTokenAmount } from './utils';

const PAYMENT_TIMEOUT_MS = 5 * 60 * 1000;
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

class SignatureCache {
  private cache: Map<string, { timestamp: number; verified: boolean }> = new Map();
  private readonly maxAge = 5 * 60 * 1000;
  private readonly maxSize = 10000;

  has(signature: string): boolean {
    const entry = this.cache.get(signature);
    if (!entry) return false;

    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(signature);
      return false;
    }

    return true;
  }

  add(signature: string, verified: boolean = true): void {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(signature, {
      timestamp: Date.now(),
      verified
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

const signatureCache = new SignatureCache();

export async function verifyPayment(
  payment: SPL402PaymentPayload,
  expectedAmount: number,
  expectedRecipient: string,
  network: SolanaNetwork,
  decimals?: number
): Promise<VerifyPaymentResponse> {
  if (payment.spl402Version !== 1) {
    return { valid: false, reason: 'Unsupported SPL-402 version' };
  }

  if (payment.network !== network) {
    return { valid: false, reason: 'Network mismatch' };
  }

  if (!validatePublicKey(expectedRecipient)) {
    return { valid: false, reason: 'Invalid recipient address' };
  }

  if (payment.scheme === 'transfer') {
    return verifyTransfer(payment.payload as SolanaTransferPayload, expectedAmount, expectedRecipient, network);
  } else if (payment.scheme === 'token-transfer') {
    return verifyTokenTransfer(payment.payload as SolanaTokenTransferPayload, expectedAmount, expectedRecipient, network, decimals);
  }

  return { valid: false, reason: 'Unsupported payment scheme' };
}

async function verifyTransfer(
  payload: SolanaTransferPayload,
  expectedAmount: number,
  expectedRecipient: string,
  network: SolanaNetwork
): Promise<VerifyPaymentResponse> {
  if (!validateSignature(payload.signature)) {
    return { valid: false, reason: 'Invalid transaction signature' };
  }

  if (signatureCache.has(payload.signature)) {
    return { valid: false, reason: 'Signature already used (replay attack blocked)' };
  }

  const now = Date.now();
  if (Math.abs(now - payload.timestamp) > PAYMENT_TIMEOUT_MS) {
    return { valid: false, reason: 'Payment timestamp expired' };
  }

  try {
    const connection = createConnection(network);
    const tx = await connection.getTransaction(payload.signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!tx) {
      return { valid: false, reason: 'Transaction not found on chain' };
    }

    if (tx.meta?.err) {
      return { valid: false, reason: 'Transaction failed on chain' };
    }

    const expectedRecipientPubkey = new PublicKey(expectedRecipient);
    const preBalances = tx.meta?.preBalances || [];
    const postBalances = tx.meta?.postBalances || [];
    const accountKeys = tx.transaction.message.getAccountKeys().staticAccountKeys;

    let recipientIndex = -1;

    accountKeys.forEach((key, index) => {
      if (key.equals(expectedRecipientPubkey)) recipientIndex = index;
    });

    if (recipientIndex === -1) {
      return { valid: false, reason: 'Expected recipient not found in transaction' };
    }

    const amountTransferred = preBalances[recipientIndex] !== undefined && postBalances[recipientIndex] !== undefined
      ? postBalances[recipientIndex] - preBalances[recipientIndex]
      : 0;

    const expectedLamports = solToLamports(expectedAmount);

    if (amountTransferred < expectedLamports) {
      return {
        valid: false,
        reason: `Insufficient payment amount. Expected ${expectedAmount} SOL, received ${amountTransferred / 1e9} SOL`,
      };
    }

    signatureCache.add(payload.signature, true);

    return {
      valid: true,
      txHash: payload.signature,
    };
  } catch (error) {
    return {
      valid: false,
      reason: `Verification error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

async function verifyTokenTransfer(
  payload: SolanaTokenTransferPayload,
  expectedAmount: number,
  expectedRecipient: string,
  network: SolanaNetwork,
  decimals?: number
): Promise<VerifyPaymentResponse> {
  if (!validateSignature(payload.signature)) {
    return { valid: false, reason: 'Invalid transaction signature' };
  }

  if (!validatePublicKey(payload.mint)) {
    return { valid: false, reason: 'Invalid token mint address in payload' };
  }

  if (signatureCache.has(payload.signature)) {
    return { valid: false, reason: 'Signature already used (replay attack blocked)' };
  }

  const now = Date.now();
  if (Math.abs(now - payload.timestamp) > PAYMENT_TIMEOUT_MS) {
    return { valid: false, reason: 'Payment timestamp expired' };
  }

  try {
    const connection = createConnection(network);
    const tx = await connection.getTransaction(payload.signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!tx) {
      return { valid: false, reason: 'Transaction not found on chain' };
    }

    if (tx.meta?.err) {
      return { valid: false, reason: 'Transaction failed on chain' };
    }

    const accountKeys = tx.transaction.message.getAccountKeys().staticAccountKeys;
    const instructions = tx.transaction.message.compiledInstructions;
    const expectedRecipientPubkey = new PublicKey(expectedRecipient);
    const expectedMintPubkey = new PublicKey(payload.mint);

    let tokenTransferFound = false;
    let transferAmount = 0;
    let destinationAccountIndex = -1;

    for (const ix of instructions) {
      const programIdIndex = ix.programIdIndex;
      const programId = accountKeys[programIdIndex];

      if (!programId.equals(TOKEN_PROGRAM_ID)) continue;

      const data = Buffer.from(ix.data);

      if (data.length >= 9 && (data[0] === 3 || data[0] === 12)) {
        transferAmount = Number(data.readBigUInt64LE(1));
        destinationAccountIndex = ix.accountKeyIndexes[1];
        tokenTransferFound = true;
        break;
      }
    }

    if (!tokenTransferFound || destinationAccountIndex === -1) {
      return { valid: false, reason: 'Token transfer instruction not found' };
    }

    const destinationAccount = accountKeys[destinationAccountIndex];
    const destinationAccountInfo = await connection.getAccountInfo(destinationAccount);

    if (!destinationAccountInfo) {
      return { valid: false, reason: 'Destination token account not found' };
    }

    const destinationOwnerOffset = 32;
    const destinationOwner = new PublicKey(destinationAccountInfo.data.slice(destinationOwnerOffset, destinationOwnerOffset + 32));

    if (!destinationOwner.equals(expectedRecipientPubkey)) {
      return {
        valid: false,
        reason: `Token transfer recipient mismatch. Expected ${expectedRecipient}, got ${destinationOwner.toString()}`,
      };
    }

    const mintOffset = 0;
    const actualMint = new PublicKey(destinationAccountInfo.data.slice(mintOffset, mintOffset + 32));

    if (!actualMint.equals(expectedMintPubkey)) {
      return {
        valid: false,
        reason: `Token mint mismatch. Expected ${payload.mint}, got ${actualMint.toString()}`,
      };
    }

    const expectedRawAmount = decimals !== undefined
      ? toTokenAmount(expectedAmount, decimals)
      : expectedAmount;

    if (transferAmount < expectedRawAmount) {
      return {
        valid: false,
        reason: `Insufficient payment amount. Expected ${expectedAmount} tokens (${expectedRawAmount} raw), received ${transferAmount} raw`,
      };
    }

    signatureCache.add(payload.signature, true);

    return {
      valid: true,
      txHash: payload.signature,
    };
  } catch (error) {
    return {
      valid: false,
      reason: `Verification error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
