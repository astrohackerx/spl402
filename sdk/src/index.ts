export * from './types';
export * from './utils';
export * from './client';
export * from './server';
export * from './verify';
export * from './attestation';

export { SPL402Client, createClient, WalletAdapter } from './client';
export { SPL402Server, createServer, createExpressMiddleware, createFetchMiddleware } from './server';
export { verifyPayment } from './verify';
export type { TokenProgram } from './types';

export {
  queryVerifiedServers,
  checkAttestationByWallet,
  checkAttestationByEndpoint,
  getAttestationByPda,
  SPL402_CREDENTIAL_PDA,
  SPL402_SCHEMA_PDA,
} from './attestation';

export type {
  VerifiedServer,
  AttestationCheckResult,
} from './attestation';

// React hooks (optional - only import if using React)
export { useSPL402 } from './react';
export type { UseSPL402Options, UseSPL402Return } from './react';
