import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  VersionedTransaction,
} from '@solana/web3.js';
import {
  SPL402PaymentPayload,
  SPL402PaymentRequirement,
  SPL402Config,
  SolanaNetwork,
  SPL402_VERSION,
} from './types';
import { createConnection, solToLamports } from './utils';

// Wallet adapter interface for browser wallets (Phantom, Solflare, etc.)
export interface WalletAdapter {
  publicKey: PublicKey | null;
  signTransaction?<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>;
  signAndSendTransaction(transaction: Transaction): Promise<{ signature: string }>;
}

export class SPL402Client {
  private connection: Connection;
  private network: SolanaNetwork;

  constructor(config: SPL402Config) {
    this.network = config.network;
    this.connection = createConnection(config.network, config.rpcUrl);
  }

  async createPayment(
    requirement: SPL402PaymentRequirement,
    wallet: WalletAdapter
  ): Promise<SPL402PaymentPayload> {
    if (requirement.scheme === 'transfer') {
      return this.createTransferPayment(requirement, wallet);
    } else if (requirement.scheme === 'token-transfer') {
      throw new Error('Token transfers not yet implemented');
    } else {
      throw new Error(`Unsupported payment scheme: ${requirement.scheme}`);
    }
  }

  private async createTransferPayment(
    requirement: SPL402PaymentRequirement,
    wallet: WalletAdapter
  ): Promise<SPL402PaymentPayload> {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    const recipientPubkey = new PublicKey(requirement.recipient);
    const lamports = solToLamports(requirement.amount);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: recipientPubkey,
        lamports,
      })
    );

    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    const result = await wallet.signAndSendTransaction(transaction);
    const signature = result.signature;

    // Wait for confirmation
    await this.connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    }, 'confirmed');

    return {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: requirement.network,
      payload: {
        from: wallet.publicKey.toBase58(),
        to: requirement.recipient,
        amount: requirement.amount,
        signature,
        timestamp: Date.now(),
      },
    };
  }

  async makeRequest(
    url: string,
    wallet: WalletAdapter,
    options: RequestInit = {}
  ): Promise<Response> {
    const initialResponse = await fetch(url, options);

    if (initialResponse.status !== 402) {
      return initialResponse;
    }

    const paymentHeader = initialResponse.headers.get('X-Payment-Required');
    if (!paymentHeader) {
      throw new Error('Payment required but no payment details provided');
    }

    const requirement: SPL402PaymentRequirement = JSON.parse(paymentHeader);

    const payment = await this.createPayment(requirement, wallet);

    const paymentResponse = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'X-Payment': JSON.stringify(payment),
      },
    });

    return paymentResponse;
  }

  getNetwork(): SolanaNetwork {
    return this.network;
  }

  getConnection(): Connection {
    return this.connection;
  }
}

export function createClient(config: SPL402Config): SPL402Client {
  return new SPL402Client(config);
}
