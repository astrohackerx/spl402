import { PublicKey, Transaction } from '@solana/web3.js';

export const SPL402_VERSION = 1;

export type SolanaNetwork = 'mainnet-beta' | 'devnet' | 'testnet';

export interface SPL402PaymentPayload {
  spl402Version: number;
  scheme: 'transfer' | 'token-transfer';
  network: SolanaNetwork;
  payload: SolanaTransferPayload | SolanaTokenTransferPayload;
}

export interface SolanaTransferPayload {
  from: string;
  to: string;
  amount: number;
  signature: string;
  timestamp: number;
}

export interface SolanaTokenTransferPayload {
  from: string;
  to: string;
  mint: string;
  amount: number;
  signature: string;
  timestamp: number;
}

export interface SPL402PaymentRequirement {
  amount: number;
  recipient: string;
  network: SolanaNetwork;
  scheme: 'transfer' | 'token-transfer';
  mint?: string;
  decimals?: number;
}

export interface SPL402Response {
  statusCode: number;
  headers: Record<string, string>;
  body?: unknown;
}

export interface VerifyPaymentResponse {
  valid: boolean;
  reason?: string;
  txHash?: string;
}

export interface SettlePaymentRequest {
  payment: SPL402PaymentPayload;
}

export interface SettlePaymentResponse {
  success: boolean;
  txHash?: string;
  error?: string;
}

export interface SPL402Config {
  network: SolanaNetwork;
  rpcUrl?: string;
}

export interface RoutePrice {
  path: string;
  price: number;
  method?: string;
}

export interface ServerConfig extends SPL402Config {
  recipientAddress: string;
  routes: RoutePrice[];
  scheme?: 'transfer' | 'token-transfer';
  mint?: string;
  decimals?: number;
  serverInfo?: {
    name?: string;
    description?: string;
    contact?: string;
    capabilities?: string[];
  };
}

export interface ServerMetadata {
  version: string;
  server?: {
    name?: string;
    description?: string;
    contact?: string;
  };
  wallet: string;
  network: SolanaNetwork;
  scheme: 'transfer' | 'token-transfer';
  mint?: string;
  decimals?: number;
  routes: Array<{
    path: string;
    method: string;
    price: number;
    description?: string;
  }>;
  capabilities?: string[];
}
