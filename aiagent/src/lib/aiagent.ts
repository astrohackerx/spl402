import { Connection, Keypair, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { getAccount } from '@solana/spl-token';
import bs58 from 'bs58';

const SPL402_MINT = 'DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump';
const SPL402_DECIMALS = 6;

export interface AgentBalance {
  sol: number;
  spl402: number;
  walletAddress: string;
}

export interface ServerOption {
  id: string;
  name: string;
  endpoint: string;
  price: number;
  attestation_address: string;
}

export interface AgentStep {
  type: 'info' | 'action' | 'success' | 'error' | 'proof';
  message: string;
  data?: unknown;
  link?: string;
  timestamp: number;
}

export async function getAgentKeypair(): Promise<Keypair | null> {
  const privateKey = import.meta.env.VITE_AGENT_PRIVATE_KEY;
  if (!privateKey) return null;

  try {
    const decoded = bs58.decode(privateKey);
    return Keypair.fromSecretKey(decoded);
  } catch (error) {
    console.error('Failed to decode agent private key:', error);
    return null;
  }
}

export async function checkAgentBalance(connection: Connection, keypair: Keypair): Promise<AgentBalance> {
  const publicKey = keypair.publicKey;

  const solBalance = await connection.getBalance(publicKey);
  const solAmount = solBalance / 1e9;

  let spl402Amount = 0;
  try {
    const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
      mint: new PublicKey(SPL402_MINT),
    });

    if (tokenAccounts.value.length > 0) {
      const accountInfo = await getAccount(connection, tokenAccounts.value[0].pubkey);
      spl402Amount = Number(accountInfo.amount) / Math.pow(10, SPL402_DECIMALS);
    }
  } catch (error) {
    console.error('Error fetching SPL402 balance:', error);
  }

  return {
    sol: solAmount,
    spl402: spl402Amount,
    walletAddress: publicKey.toBase58(),
  };
}

export async function scanForServers(): Promise<ServerOption[]> {
  const { queryVerifiedServers } = await import('spl402');

  const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
  const nodes = await queryVerifiedServers('mainnet-beta', rpcUrl);

  console.log('Found verified servers:', nodes.length);

  const serverOptions: ServerOption[] = [];

  for (const node of nodes) {
    if (!node.endpoint) {
      console.log('Node has no endpoint, skipping');
      continue;
    }

    console.log('Checking node:', node.endpoint);

    try {
      let metadataResponse = await fetch(`${node.endpoint}/.well-known/spl402.json`, {
        signal: AbortSignal.timeout(5000),
      });

      if (!metadataResponse.ok) {
        console.log('Trying /metadata endpoint instead...');
        metadataResponse = await fetch(`${node.endpoint}/metadata`, {
          signal: AbortSignal.timeout(5000),
        });
      }

      if (!metadataResponse.ok) {
        console.log('Metadata fetch failed for', node.endpoint, metadataResponse.status);
        continue;
      }

      const metadata = await metadataResponse.json();
      console.log('Metadata for', node.endpoint, ':', metadata);

      if (metadata.mint && metadata.mint !== SPL402_MINT) {
        console.log('Wrong mint:', metadata.mint);
        continue;
      }

      const chatRoute = metadata.routes?.find(
        (r: { path: string; method: string }) =>
          r.path === '/api/chat' && r.method === 'POST'
      );

      if (chatRoute) {
        console.log('Found chat route!', chatRoute);
        console.log('RAW PRICE FROM METADATA:', chatRoute.price);
        console.log('PRICE TYPE:', typeof chatRoute.price);
        serverOptions.push({
          id: node.wallet,
          name: metadata.server?.name || node.description || node.endpoint,
          endpoint: node.endpoint,
          price: chatRoute.price,
          attestation_address: node.wallet,
        });
      } else {
        console.log('No /api/chat route found in routes:', metadata.routes);
      }
    } catch (error) {
      console.log('Error checking node', node.endpoint, ':', error);
      continue;
    }
  }

  console.log('Final server options:', serverOptions);
  return serverOptions.sort((a, b) => a.price - b.price);
}

export async function makePaymentAndRequest(
  endpoint: string,
  message: string,
  keypair: Keypair,
  connection: Connection,
  price: number,
  attestationAddress: string
): Promise<{ response: string; signature: string }> {
  const { createClient } = await import('spl402');

  console.log('Creating SPL402 client...');

  const client = createClient({
    network: 'mainnet-beta',
    rpcUrl: connection.rpcEndpoint,
  });

  let capturedSignature = 'unknown';

  const walletAdapter = {
    publicKey: keypair.publicKey,
    signTransaction: async (tx: Transaction) => {
      tx.sign(keypair);
      return tx;
    },
    signAndSendTransaction: async (tx: Transaction) => {
      tx.sign(keypair);
      const signature = await connection.sendRawTransaction(tx.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      });
      await connection.confirmTransaction(signature, 'confirmed');
      capturedSignature = signature;
      console.log('Transaction signature captured:', signature);
      return { signature };
    },
  };

  console.log('Making paid request to:', `${endpoint}/api/chat`);
  console.log('Payment details - Price:', price, 'tokens, Attestation:', attestationAddress);

  const response = await client.makeRequest(
    `${endpoint}/api/chat`,
    walletAdapter,
    {
      method: 'POST',
      body: JSON.stringify({ message }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  console.log('Response received:', response);

  const data = await response.json();
  console.log('Response data:', data);

  return {
    response: data.response || data.message || JSON.stringify(data),
    signature: capturedSignature,
  };
}
