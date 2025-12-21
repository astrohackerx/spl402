import { describe, it, expect, beforeEach } from '@jest/globals';
import { Keypair } from '@solana/web3.js';
import { createServer } from '../../src/server';
import { TokenGate, ServerConfig } from '../../src/types';

describe('Token Gate - Server Configuration', () => {
  const SPL402_MINT = 'DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump';

  it('should accept token gate configuration in routes', () => {
    const config: ServerConfig = {
      network: 'devnet',
      recipientAddress: Keypair.generate().publicKey.toBase58(),
      routes: [
        {
          path: '/api/holders-only',
          price: 0,
          tokenGate: {
            mint: SPL402_MINT,
            minimumBalance: 1000,
          },
        },
      ],
    };

    const server = createServer(config);
    const tokenGate = server.getRouteTokenGate('/api/holders-only');

    expect(tokenGate).not.toBeNull();
    expect(tokenGate?.mint).toBe(SPL402_MINT);
    expect(tokenGate?.minimumBalance).toBe(1000);
  });

  it('should return null for routes without token gate', () => {
    const config: ServerConfig = {
      network: 'devnet',
      recipientAddress: Keypair.generate().publicKey.toBase58(),
      routes: [
        { path: '/api/paid', price: 0.001 },
      ],
    };

    const server = createServer(config);
    const tokenGate = server.getRouteTokenGate('/api/paid');

    expect(tokenGate).toBeNull();
  });

  it('should include token gate in server metadata', () => {
    const config: ServerConfig = {
      network: 'devnet',
      recipientAddress: Keypair.generate().publicKey.toBase58(),
      routes: [
        {
          path: '/api/holders-only',
          price: 0,
          tokenGate: {
            mint: SPL402_MINT,
            minimumBalance: 500,
          },
        },
      ],
    };

    const server = createServer(config);
    const metadata = server.getServerMetadata();

    expect(metadata.routes[0].tokenGate).toBeDefined();
    expect(metadata.routes[0].tokenGate?.mint).toBe(SPL402_MINT);
    expect(metadata.routes[0].tokenGate?.minimumBalance).toBe(500);
  });

  it('should support token-2022 program in token gate', () => {
    const config: ServerConfig = {
      network: 'devnet',
      recipientAddress: Keypair.generate().publicKey.toBase58(),
      routes: [
        {
          path: '/api/premium',
          price: 0,
          tokenGate: {
            mint: SPL402_MINT,
            minimumBalance: 100,
            tokenProgram: 'token-2022',
          },
        },
      ],
    };

    const server = createServer(config);
    const tokenGate = server.getRouteTokenGate('/api/premium');

    expect(tokenGate?.tokenProgram).toBe('token-2022');
  });
});

describe('Token Gate - Route Handling', () => {
  const SPL402_MINT = 'DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump';
  let server: ReturnType<typeof createServer>;

  beforeEach(() => {
    const config: ServerConfig = {
      network: 'devnet',
      recipientAddress: Keypair.generate().publicKey.toBase58(),
      routes: [
        {
          path: '/api/holders-only',
          price: 0,
          tokenGate: {
            mint: SPL402_MINT,
            minimumBalance: 1000,
          },
        },
        {
          path: '/api/hybrid',
          price: 0.001,
          tokenGate: {
            mint: SPL402_MINT,
            minimumBalance: 500,
          },
        },
        { path: '/api/paid', price: 0.001 },
        { path: '/api/free', price: 0 },
      ],
    };

    server = createServer(config);
  });

  it('should require token gate for token-gated free routes', async () => {
    const result = await server.handleRequest('/api/holders-only', 'GET', {});

    expect(result.authorized).toBe(false);
    expect(result.reason).toBe('Token gate verification failed');
  });

  it('should allow payment fallback for hybrid routes (token gate + price)', async () => {
    const result = await server.handleRequest('/api/hybrid', 'GET', {});

    expect(result.authorized).toBe(false);
    expect(result.reason).toBe('Payment required');
  });

  it('should authorize free routes without token gate', async () => {
    const result = await server.handleRequest('/api/free', 'GET', {});

    expect(result.authorized).toBe(true);
  });

  it('should check token gate when wallet header provided', async () => {
    const wallet = Keypair.generate().publicKey.toBase58();
    const result = await server.handleRequest('/api/holders-only', 'GET', {
      'x-wallet': wallet,
    });

    expect(result.authorized).toBe(false);
  });
});

describe('Token Gate - Input Validation', () => {
  const SPL402_MINT = 'DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump';

  it('should validate wallet address format', async () => {
    const config: ServerConfig = {
      network: 'devnet',
      recipientAddress: Keypair.generate().publicKey.toBase58(),
      routes: [
        {
          path: '/api/gated',
          price: 0,
          tokenGate: {
            mint: SPL402_MINT,
            minimumBalance: 100,
          },
        },
      ],
    };

    const server = createServer(config);
    const result = await server.verifyTokenGateAccess('invalid-wallet', '/api/gated');

    expect(result.authorized).toBe(false);
    expect(result.reason).toContain('Invalid wallet address');
  });

  it('should return error for non-existent token gate route', async () => {
    const config: ServerConfig = {
      network: 'devnet',
      recipientAddress: Keypair.generate().publicKey.toBase58(),
      routes: [
        { path: '/api/paid', price: 0.001 },
      ],
    };

    const server = createServer(config);
    const wallet = Keypair.generate().publicKey.toBase58();
    const result = await server.verifyTokenGateAccess(wallet, '/api/paid');

    expect(result.authorized).toBe(false);
    expect(result.reason).toBe('No token gate configured');
  });
});

describe('Token Gate - Dynamic Routes', () => {
  const SPL402_MINT = 'DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump';

  it('should support token gate on dynamic routes', () => {
    const config: ServerConfig = {
      network: 'devnet',
      recipientAddress: Keypair.generate().publicKey.toBase58(),
      routes: [
        {
          path: '/api/users/:id/premium',
          price: 0,
          tokenGate: {
            mint: SPL402_MINT,
            minimumBalance: 1000,
          },
        },
      ],
    };

    const server = createServer(config);
    const tokenGate = server.getRouteTokenGate('/api/users/123/premium');

    expect(tokenGate).not.toBeNull();
    expect(tokenGate?.mint).toBe(SPL402_MINT);
  });
});
