import { PublicKey } from '@solana/web3.js';
import {
  SPL402PaymentPayload,
  SolanaTransferPayload,
  SolanaTokenTransferPayload,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  SolanaNetwork,
} from './types';
import { createConnection, validatePublicKey, validateSignature, solToLamports, toTokenAmount } from './utils';

const PAYMENT_TIMEOUT_MS = 5 * 60 * 1000;

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

interface BackgroundVerification {
  payment: SPL402PaymentPayload;
  expectedAmount: number;
  expectedRecipient: string;
  network: SolanaNetwork;
  decimals?: number;
}

class BackgroundVerificationQueue {
  private queue: BackgroundVerification[] = [];
  private processing = false;

  add(verification: BackgroundVerification): void {
    this.queue.push(verification);
    this.process();
  }

  private async process(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) break;

      try {
        await verifyPayment({
          payment: item.payment,
          expectedAmount: item.expectedAmount,
          expectedRecipient: item.expectedRecipient,
          network: item.network,
          decimals: item.decimals
        });
      } catch (error) {
        console.error('Background verification failed:', error);
      }
    }

    this.processing = false;
  }
}

const backgroundQueue = new BackgroundVerificationQueue();

export async function verifyPaymentBalanced(
  payment: SPL402PaymentPayload,
  expectedAmount: number,
  expectedRecipient: string,
  network: SolanaNetwork
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

  const payload = payment.payload as any;

  if (!validateSignature(payload.signature)) {
    return { valid: false, reason: 'Invalid transaction signature' };
  }

  if (signatureCache.has(payload.signature)) {
    return { valid: false, reason: 'Signature already used (replay attack blocked)' };
  }

  if (payload.to !== expectedRecipient) {
    return { valid: false, reason: 'Recipient address mismatch' };
  }

  const now = Date.now();
  if (Math.abs(now - payload.timestamp) > PAYMENT_TIMEOUT_MS) {
    return { valid: false, reason: 'Payment timestamp expired' };
  }

  try {
    const connection = createConnection(network);
    const statuses = await connection.getSignatureStatuses([payload.signature]);

    if (!statuses || !statuses.value || !statuses.value[0]) {
      return { valid: false, reason: 'Transaction not found' };
    }

    const status = statuses.value[0];

    if (status.err) {
      return { valid: false, reason: 'Transaction failed on chain' };
    }

    if (!status.confirmationStatus) {
      return { valid: false, reason: 'Transaction not confirmed' };
    }

    const tx = await connection.getTransaction(payload.signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!tx || !tx.meta) {
      return { valid: false, reason: 'Transaction details not available' };
    }

    if (payment.scheme === 'transfer') {
      const expectedLamports = solToLamports(expectedAmount);
      const preBalance = tx.meta.preBalances[0];
      const postBalance = tx.meta.postBalances[0];
      const actualAmount = preBalance - postBalance - tx.meta.fee;

      if (actualAmount < expectedLamports) {
        return {
          valid: false,
          reason: `Insufficient payment: expected ${expectedAmount} SOL, got ${actualAmount / 1e9} SOL`,
        };
      }

      const accountKeys = tx.transaction.message.getAccountKeys();
      const recipientIndex = accountKeys.staticAccountKeys.findIndex(
        (key: PublicKey) => key.toBase58() === expectedRecipient
      );
      if (recipientIndex === -1) {
        return { valid: false, reason: 'Recipient not found in transaction' };
      }

      const recipientPreBalance = tx.meta.preBalances[recipientIndex];
      const recipientPostBalance = tx.meta.postBalances[recipientIndex];
      const recipientReceived = recipientPostBalance - recipientPreBalance;

      if (recipientReceived < expectedLamports) {
        return { valid: false, reason: 'Recipient did not receive expected amount' };
      }
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

export async function verifyPayment(request: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
  const { payment, expectedAmount, expectedRecipient, network, decimals } = request;

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
  if (!validatePublicKey(payload.from)) {
    return { valid: false, reason: 'Invalid sender address' };
  }

  if (!validatePublicKey(payload.to)) {
    return { valid: false, reason: 'Invalid recipient address' };
  }

  if (!validateSignature(payload.signature)) {
    return { valid: false, reason: 'Invalid transaction signature' };
  }

  if (payload.to !== expectedRecipient) {
    return { valid: false, reason: 'Recipient address mismatch' };
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

    const fromPubkey = new PublicKey(payload.from);
    const toPubkey = new PublicKey(payload.to);

    const preBalances = tx.meta?.preBalances || [];
    const postBalances = tx.meta?.postBalances || [];
    const accountKeys = tx.transaction.message.getAccountKeys().staticAccountKeys;

    let fromIndex = -1;
    let toIndex = -1;

    accountKeys.forEach((key, index) => {
      if (key.equals(fromPubkey)) fromIndex = index;
      if (key.equals(toPubkey)) toIndex = index;
    });

    if (fromIndex === -1 || toIndex === -1) {
      return { valid: false, reason: 'Payment addresses not found in transaction' };
    }

    const amountTransferred = preBalances[toIndex] !== undefined && postBalances[toIndex] !== undefined
      ? postBalances[toIndex] - preBalances[toIndex]
      : 0;

    const expectedLamports = solToLamports(expectedAmount);

    if (amountTransferred < expectedLamports) {
      return {
        valid: false,
        reason: `Insufficient payment amount. Expected ${expectedAmount} SOL, received ${amountTransferred / 1e9} SOL`,
      };
    }

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
  if (!validatePublicKey(payload.from)) {
    return { valid: false, reason: 'Invalid sender address' };
  }

  if (!validatePublicKey(payload.to)) {
    return { valid: false, reason: 'Invalid recipient address' };
  }

  if (!validatePublicKey(payload.mint)) {
    return { valid: false, reason: 'Invalid token mint address' };
  }

  if (!validateSignature(payload.signature)) {
    return { valid: false, reason: 'Invalid transaction signature' };
  }

  if (payload.to !== expectedRecipient) {
    return { valid: false, reason: 'Recipient address mismatch' };
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

    const instructions = tx.transaction.message.compiledInstructions;
    let tokenTransferFound = false;
    let transferAmount = 0;

    for (const ix of instructions) {
      const data = Buffer.from(ix.data);
      if (data.length >= 9 && (data[0] === 3 || data[0] === 12)) {
        transferAmount = Number(data.readBigUInt64LE(1));
        tokenTransferFound = true;
        break;
      }
    }

    if (!tokenTransferFound) {
      return { valid: false, reason: 'Token transfer instruction not found' };
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

export async function verifyPaymentLocal(
  payment: SPL402PaymentPayload,
  expectedAmount: number,
  expectedRecipient: string,
  decimals?: number
): Promise<VerifyPaymentResponse> {
  return verifyPayment({
    payment,
    expectedAmount,
    expectedRecipient,
    network: payment.network,
    decimals,
  });
}
