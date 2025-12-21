import { PublicKey } from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import { TokenGate, TokenGateVerifyResult, SolanaNetwork, TokenProgram } from './types';
import { createConnection, validatePublicKey } from './utils';

function getTokenProgramId(tokenProgram?: TokenProgram): PublicKey {
  return tokenProgram === 'token-2022' ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;
}

export async function verifyTokenGate(
  walletAddress: string,
  tokenGate: TokenGate,
  network: SolanaNetwork,
  rpcUrl?: string
): Promise<TokenGateVerifyResult> {
  if (!validatePublicKey(walletAddress)) {
    return {
      authorized: false,
      reason: 'Invalid wallet address',
    };
  }

  if (!validatePublicKey(tokenGate.mint)) {
    return {
      authorized: false,
      reason: 'Invalid token mint address',
    };
  }

  try {
    const connection = createConnection(network, rpcUrl);
    const walletPubkey = new PublicKey(walletAddress);
    const mintPubkey = new PublicKey(tokenGate.mint);
    const programId = getTokenProgramId(tokenGate.tokenProgram);

    const ata = await getAssociatedTokenAddress(
      mintPubkey,
      walletPubkey,
      false,
      programId
    );

    const accountInfo = await connection.getAccountInfo(ata);

    if (!accountInfo) {
      return {
        authorized: false,
        reason: 'No token account found',
        wallet: walletAddress,
        balance: 0,
        requiredBalance: tokenGate.minimumBalance,
      };
    }

    const amountOffset = 64;
    const balance = Number(accountInfo.data.readBigUInt64LE(amountOffset));

    if (balance < tokenGate.minimumBalance) {
      return {
        authorized: false,
        reason: `Insufficient token balance: ${balance} < ${tokenGate.minimumBalance}`,
        wallet: walletAddress,
        balance,
        requiredBalance: tokenGate.minimumBalance,
      };
    }

    return {
      authorized: true,
      wallet: walletAddress,
      balance,
      requiredBalance: tokenGate.minimumBalance,
    };
  } catch (error) {
    return {
      authorized: false,
      reason: `Token gate verification error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export async function getTokenBalance(
  walletAddress: string,
  mint: string,
  network: SolanaNetwork,
  rpcUrl?: string,
  tokenProgram?: TokenProgram
): Promise<number> {
  if (!validatePublicKey(walletAddress) || !validatePublicKey(mint)) {
    return 0;
  }

  try {
    const connection = createConnection(network, rpcUrl);
    const walletPubkey = new PublicKey(walletAddress);
    const mintPubkey = new PublicKey(mint);
    const programId = getTokenProgramId(tokenProgram);

    const ata = await getAssociatedTokenAddress(
      mintPubkey,
      walletPubkey,
      false,
      programId
    );

    const accountInfo = await connection.getAccountInfo(ata);

    if (!accountInfo) {
      return 0;
    }

    const amountOffset = 64;
    return Number(accountInfo.data.readBigUInt64LE(amountOffset));
  } catch {
    return 0;
  }
}
