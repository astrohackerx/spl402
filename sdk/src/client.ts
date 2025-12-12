import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  VersionedTransaction,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import {
  SPL402PaymentPayload,
  SPL402PaymentRequirement,
  SPL402Config,
  SolanaNetwork,
  SPL402_VERSION,
  TokenProgram,
} from './types';
import { createConnection, solToLamports, toTokenAmount } from './utils';

function getTokenProgramId(tokenProgram?: TokenProgram): PublicKey {
  return tokenProgram === 'token-2022' ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;
}

// Wallet adapter interface for browser wallets (Phantom, Solflare, etc.)
export interface WalletAdapter {
  publicKey: PublicKey | null;
  signTransaction?<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>;
  signAndSendTransaction(transaction: Transaction): Promise<{ signature: string }>;
}

export class SPL402Client {
  private connection: Connection;
  private network: SolanaNetwork;
  private config: SPL402Config;

  constructor(config: SPL402Config) {
    this.network = config.network;
    this.config = config;
    this.connection = createConnection(config.network, config.rpcUrl);
  }

  async createPayment(
    requirement: SPL402PaymentRequirement,
    wallet: WalletAdapter
  ): Promise<SPL402PaymentPayload> {
    if (requirement.scheme === 'transfer') {
      return this.createTransferPayment(requirement, wallet);
    } else if (requirement.scheme === 'token-transfer') {
      return this.createTokenTransferPayment(requirement, wallet);
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

  private async createTokenTransferPayment(
    requirement: SPL402PaymentRequirement,
    wallet: WalletAdapter
  ): Promise<SPL402PaymentPayload> {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    if (!requirement.mint) {
      throw new Error('Mint address required for token transfers');
    }

    if (requirement.decimals === undefined) {
      throw new Error('Token decimals required for token transfers');
    }

    const mintPubkey = new PublicKey(requirement.mint);
    const recipientPubkey = new PublicKey(requirement.recipient);
    const tokenAmount = toTokenAmount(requirement.amount, requirement.decimals);
    const programId = getTokenProgramId(requirement.tokenProgram);

    const senderAta = await getAssociatedTokenAddress(mintPubkey, wallet.publicKey, false, programId);
    const recipientAta = await getAssociatedTokenAddress(mintPubkey, recipientPubkey, false, programId);

    const transaction = new Transaction();

    const recipientAccount = await this.connection.getAccountInfo(recipientAta);
    if (!recipientAccount) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          recipientAta,
          recipientPubkey,
          mintPubkey,
          programId
        )
      );
    }

    transaction.add(
      createTransferInstruction(
        senderAta,
        recipientAta,
        wallet.publicKey,
        tokenAmount,
        [],
        programId
      )
    );

    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    const result = await wallet.signAndSendTransaction(transaction);
    const signature = result.signature;

    await this.connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    }, 'confirmed');

    return {
      spl402Version: SPL402_VERSION,
      scheme: 'token-transfer',
      network: requirement.network,
      payload: {
        from: wallet.publicKey.toBase58(),
        to: requirement.recipient,
        mint: requirement.mint,
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

    let requirement: SPL402PaymentRequirement = JSON.parse(paymentHeader);

    if (this.config.scheme) {
      requirement = {
        ...requirement,
        scheme: this.config.scheme,
        mint: this.config.mint || requirement.mint,
        decimals: this.config.decimals !== undefined ? this.config.decimals : requirement.decimals,
        tokenProgram: this.config.tokenProgram || requirement.tokenProgram,
      };
    }

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
