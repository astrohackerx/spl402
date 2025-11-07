import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';
import { SolanaNetwork } from './types';

export function getRpcUrl(network: SolanaNetwork, customRpcUrl?: string): string {
  if (customRpcUrl) return customRpcUrl;

  switch (network) {
    case 'mainnet-beta':
      return 'https://api.mainnet-beta.solana.com';
    case 'devnet':
      return 'https://api.devnet.solana.com';
    case 'testnet':
      return 'https://api.testnet.solana.com';
    default:
      throw new Error(`Unknown network: ${network}`);
  }
}

export function createConnection(network: SolanaNetwork, customRpcUrl?: string): Connection {
  const rpcUrl = getRpcUrl(network, customRpcUrl);
  return new Connection(rpcUrl, 'confirmed');
}

export function validatePublicKey(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export function validateSignature(signature: string): boolean {
  try {
    const decoded = bs58.decode(signature);
    return decoded.length === 64;
  } catch {
    return false;
  }
}

export function lamportsToSol(lamports: number): number {
  return lamports / 1_000_000_000;
}

export function solToLamports(sol: number): number {
  return Math.floor(sol * 1_000_000_000);
}

export function formatAmount(amount: number, decimals: number = 9): string {
  return (amount / Math.pow(10, decimals)).toFixed(decimals);
}
