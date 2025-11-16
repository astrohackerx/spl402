import {
  createSolanaRpc,
  address,
  type Address,
  type Account,
} from '@solana/kit';
import {
  deriveAttestationPda,
  fetchAttestation,
  fetchSchema,
  deserializeAttestationData,
  type Attestation,
  SOLANA_ATTESTATION_SERVICE_PROGRAM_ADDRESS,
} from 'sas-lib';
import { Connection, PublicKey } from '@solana/web3.js';
import { SolanaNetwork } from './types';
import { getRpcUrl } from './utils';

export const SPL402_CREDENTIAL_PDA = '9GdE9guo1HnMfiFPFPwEbirW4TU3JD1ynRQ7mxvr71yc';
export const SPL402_SCHEMA_PDA = '9KvM6vBmzLTiJ5ZFq4sva9pfEkgBp2PJ7cpzZxQCUxeD';

export interface VerifiedServer {
  wallet: string;
  endpoint: string;
  description: string;
  contact: string;
  attestationPda: string;
}

export interface AttestationCheckResult {
  isVerified: boolean;
  attestationPda?: string;
  data?: VerifiedServer;
  error?: string;
}

async function parseAttestationData(
  attestationAccount: Account<Attestation, string>,
  rpc: ReturnType<typeof createSolanaRpc>
): Promise<VerifiedServer | null> {
  try {
    const schema = await fetchSchema(rpc, attestationAccount.data.schema);

    if (!schema) {
      console.error('Schema not found');
      return null;
    }

    const deserializedData = deserializeAttestationData(
      schema.data,
      new Uint8Array(attestationAccount.data.data)
    );

    return {
      wallet: (deserializedData as any).wallet || '',
      endpoint: (deserializedData as any).endpoint || '',
      description: (deserializedData as any).description || '',
      contact: (deserializedData as any).contact || '',
      attestationPda: attestationAccount.address,
    };
  } catch (error) {
    console.error('Failed to parse attestation data:', error);
    return null;
  }
}

export async function queryVerifiedServers(
  network: SolanaNetwork = 'mainnet-beta',
  rpcUrl?: string
): Promise<VerifiedServer[]> {
  try {
    const rpc = createSolanaRpc(getRpcUrl(network, rpcUrl));
    const connection = new Connection(getRpcUrl(network, rpcUrl), 'confirmed');

    const programId = new PublicKey(SOLANA_ATTESTATION_SERVICE_PROGRAM_ADDRESS);

    const credentialPubkey = new PublicKey(SPL402_CREDENTIAL_PDA);
    const schemaPubkey = new PublicKey(SPL402_SCHEMA_PDA);

    const accounts = await connection.getProgramAccounts(programId, {
      filters: [
        {
          memcmp: {
            offset: 33,
            bytes: credentialPubkey.toBase58(),
          },
        },
        {
          memcmp: {
            offset: 65,
            bytes: schemaPubkey.toBase58(),
          },
        },
      ],
    });

    const verifiedServers: VerifiedServer[] = [];

    for (const account of accounts) {
      try {
        const attestationAccount = await fetchAttestation(
          rpc,
          address(account.pubkey.toBase58())
        );

        if (attestationAccount) {
          const serverData = await parseAttestationData(attestationAccount, rpc);
          if (serverData) {
            verifiedServers.push(serverData);
          }
        }
      } catch (error) {
        console.error('Failed to parse attestation:', error);
      }
    }

    return verifiedServers;
  } catch (error) {
    console.error('Failed to query verified servers:', error);
    throw new Error(
      `Failed to query verified servers: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function checkAttestationByWallet(
  walletAddress: string,
  network: SolanaNetwork = 'mainnet-beta',
  rpcUrl?: string
): Promise<AttestationCheckResult> {
  try {
    const servers = await queryVerifiedServers(network, rpcUrl);

    const server = servers.find(
      s => s.wallet.toLowerCase() === walletAddress.toLowerCase()
    );

    if (server) {
      return {
        isVerified: true,
        attestationPda: server.attestationPda,
        data: server,
      };
    }

    return {
      isVerified: false,
      error: 'No attestation found for this wallet address',
    };
  } catch (error) {
    return {
      isVerified: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function checkAttestationByEndpoint(
  apiEndpoint: string,
  network: SolanaNetwork = 'mainnet-beta',
  rpcUrl?: string
): Promise<AttestationCheckResult> {
  try {
    const servers = await queryVerifiedServers(network, rpcUrl);

    const normalizedEndpoint = apiEndpoint.toLowerCase().replace(/\/$/, '');

    const server = servers.find(
      s => s.endpoint.toLowerCase().replace(/\/$/, '') === normalizedEndpoint
    );

    if (server) {
      return {
        isVerified: true,
        attestationPda: server.attestationPda,
        data: server,
      };
    }

    return {
      isVerified: false,
      error: 'No attestation found for this API endpoint',
    };
  } catch (error) {
    return {
      isVerified: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getAttestationByPda(
  attestationPda: string,
  network: SolanaNetwork = 'mainnet-beta',
  rpcUrl?: string
): Promise<AttestationCheckResult> {
  try {
    const rpc = createSolanaRpc(getRpcUrl(network, rpcUrl));

    const attestation = await fetchAttestation(rpc, address(attestationPda));

    if (!attestation) {
      return {
        isVerified: false,
        error: 'Attestation not found',
      };
    }

    const serverData = await parseAttestationData(attestation, rpc);

    if (!serverData) {
      return {
        isVerified: false,
        error: 'Failed to parse attestation data',
      };
    }

    return {
      isVerified: true,
      attestationPda,
      data: serverData,
    };
  } catch (error) {
    return {
      isVerified: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
