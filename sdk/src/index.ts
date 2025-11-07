export * from './types';
export * from './utils';
export * from './client';
export * from './server';
export * from './verify';

export { SPL402Client, createClient, WalletAdapter } from './client';
export { SPL402Server, createServer, createExpressMiddleware, createFetchMiddleware } from './server';
export { verifyPayment, verifyPaymentLocal } from './verify';

// React hooks (optional - only import if using React)
export { useSPL402 } from './react';
export type { UseSPL402Options, UseSPL402Return } from './react';
