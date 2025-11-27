import { describe, it, expect, beforeEach } from '@jest/globals';
import { Keypair } from '@solana/web3.js';
import { createServer, SPL402Server } from '../../src/server';
import { SPL402_VERSION } from '../../src/types';

describe('Server - Initialization', () => {
  let recipientAddress: string;

  beforeEach(() => {
    recipientAddress = Keypair.generate().publicKey.toBase58();
  });

  it('should create server with minimal config', () => {
    const server = createServer({
      network: 'devnet',
      recipientAddress,
      routes: [{ path: '/api/test', price: 0.001 }],
    });

    expect(server).toBeInstanceOf(SPL402Server);
  });

  it('should create server with token transfer config', () => {
    const mintAddress = Keypair.generate().publicKey.toBase58();
    const server = createServer({
      network: 'mainnet-beta',
      recipientAddress,
      scheme: 'token-transfer',
      mint: mintAddress,
      decimals: 6,
      routes: [{ path: '/api/tokens', price: 10 }],
    });

    expect(server).toBeInstanceOf(SPL402Server);
  });

  it('should create server with server info', () => {
    const server = createServer({
      network: 'devnet',
      recipientAddress,
      routes: [{ path: '/api/test', price: 0.001 }],
      serverInfo: {
        name: 'Test Server',
        description: 'Test API',
        contact: 'https://test.com',
        capabilities: ['data-api'],
      },
    });

    expect(server).toBeInstanceOf(SPL402Server);
    const metadata = server.getServerMetadata();
    expect(metadata.server?.name).toBe('Test Server');
    expect(metadata.server?.description).toBe('Test API');
  });

  it('should include standard routes automatically', () => {
    const server = createServer({
      network: 'devnet',
      recipientAddress,
      routes: [{ path: '/api/test', price: 0.001 }],
    });

    const healthReq = server.getPaymentRequirement('/health', 'GET');
    const statusReq = server.getPaymentRequirement('/status', 'GET');
    const metadataReq = server.getPaymentRequirement('/.well-known/spl402.json', 'GET');

    expect(healthReq).not.toBeNull();
    expect(healthReq?.amount).toBe(0);
    expect(statusReq).not.toBeNull();
    expect(statusReq?.amount).toBe(0);
    expect(metadataReq).not.toBeNull();
    expect(metadataReq?.amount).toBe(0);
  });
});

describe('Server - Route Matching', () => {
  let server: SPL402Server;
  let recipientAddress: string;

  beforeEach(() => {
    recipientAddress = Keypair.generate().publicKey.toBase58();
    server = createServer({
      network: 'devnet',
      recipientAddress,
      routes: [
        { path: '/api/free', price: 0, method: 'GET' },
        { path: '/api/paid', price: 0.001, method: 'GET' },
        { path: '/api/expensive', price: 0.01, method: 'POST' },
        { path: '/api/users/:id', price: 0.002, method: 'GET' },
        { path: '/api/games/:code/stats', price: 0.005, method: 'GET' },
      ],
    });
  });

  it('should match exact routes', () => {
    const req = server.getPaymentRequirement('/api/paid', 'GET');
    expect(req).not.toBeNull();
    expect(req?.amount).toBe(0.001);
  });

  it('should match routes by method', () => {
    const getReq = server.getPaymentRequirement('/api/expensive', 'GET');
    const postReq = server.getPaymentRequirement('/api/expensive', 'POST');

    expect(getReq).toBeNull();
    expect(postReq).not.toBeNull();
    expect(postReq?.amount).toBe(0.01);
  });

  it('should match dynamic routes with single parameter', () => {
    const req1 = server.getPaymentRequirement('/api/users/123', 'GET');
    const req2 = server.getPaymentRequirement('/api/users/abc', 'GET');

    expect(req1).not.toBeNull();
    expect(req1?.amount).toBe(0.002);
    expect(req2).not.toBeNull();
    expect(req2?.amount).toBe(0.002);
  });

  it('should match dynamic routes with nested parameters', () => {
    const req = server.getPaymentRequirement('/api/games/xyz789/stats', 'GET');
    expect(req).not.toBeNull();
    expect(req?.amount).toBe(0.005);
  });

  it('should not match invalid routes', () => {
    const req = server.getPaymentRequirement('/api/nonexistent', 'GET');
    expect(req).toBeNull();
  });

  it('should handle trailing slashes', () => {
    const req1 = server.getPaymentRequirement('/api/paid', 'GET');
    const req2 = server.getPaymentRequirement('/api/paid/', 'GET');

    expect(req1).not.toBeNull();
  });

  it('should identify free routes', () => {
    const req = server.getPaymentRequirement('/api/free', 'GET');
    expect(req).not.toBeNull();
    expect(req?.amount).toBe(0);
  });
});

describe('Server - Payment Requirements', () => {
  let server: SPL402Server;
  let recipientAddress: string;

  beforeEach(() => {
    recipientAddress = Keypair.generate().publicKey.toBase58();
  });

  it('should return correct SOL payment requirement', () => {
    server = createServer({
      network: 'devnet',
      recipientAddress,
      routes: [{ path: '/api/test', price: 0.001 }],
    });

    const req = server.getPaymentRequirement('/api/test', 'GET');

    expect(req).not.toBeNull();
    expect(req?.amount).toBe(0.001);
    expect(req?.recipient).toBe(recipientAddress);
    expect(req?.network).toBe('devnet');
    expect(req?.scheme).toBe('transfer');
    expect(req?.mint).toBeUndefined();
    expect(req?.decimals).toBeUndefined();
  });

  it('should return correct token payment requirement', () => {
    const mintAddress = Keypair.generate().publicKey.toBase58();
    server = createServer({
      network: 'mainnet-beta',
      recipientAddress,
      scheme: 'token-transfer',
      mint: mintAddress,
      decimals: 6,
      routes: [{ path: '/api/tokens', price: 100 }],
    });

    const req = server.getPaymentRequirement('/api/tokens', 'GET');

    expect(req).not.toBeNull();
    expect(req?.amount).toBe(100);
    expect(req?.scheme).toBe('token-transfer');
    expect(req?.mint).toBe(mintAddress);
    expect(req?.decimals).toBe(6);
  });

  it('should return null for non-existent routes', () => {
    server = createServer({
      network: 'devnet',
      recipientAddress,
      routes: [{ path: '/api/test', price: 0.001 }],
    });

    const req = server.getPaymentRequirement('/api/invalid', 'GET');
    expect(req).toBeNull();
  });
});

describe('Server - Standard Responses', () => {
  let server: SPL402Server;

  beforeEach(() => {
    const recipientAddress = Keypair.generate().publicKey.toBase58();
    server = createServer({
      network: 'devnet',
      recipientAddress,
      routes: [{ path: '/api/test', price: 0.001 }],
      serverInfo: {
        name: 'Test API',
        description: 'Test Description',
      },
    });
  });

  it('should create health check response', () => {
    const response = server.createHealthResponse();

    expect(response.status).toBe(200);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(response.body.status).toBe('ok');
    expect(response.body.timestamp).toBeGreaterThan(0);
  });

  it('should create metadata response', () => {
    const response = server.createMetadataResponse();

    expect(response.status).toBe(200);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(response.body.version).toBe('1.0');
    expect(response.body.server?.name).toBe('Test API');
    expect(response.body.network).toBe('devnet');
  });

  it('should create payment required response', () => {
    const response = server.createPaymentRequiredResponse('/api/test', 'GET');

    expect(response.status).toBe(402);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(response.headers['X-Payment-Required']).toBeDefined();
    expect(response.body.message).toBe('Payment required');
    expect(response.body.payment).toBeDefined();
  });

  it('should return 404 for invalid route in payment required response', () => {
    const response = server.createPaymentRequiredResponse('/api/invalid', 'GET');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Route not found');
  });
});

describe('Server - Request Handling', () => {
  let server: SPL402Server;
  let recipientAddress: string;

  beforeEach(() => {
    recipientAddress = Keypair.generate().publicKey.toBase58();
    server = createServer({
      network: 'devnet',
      recipientAddress,
      routes: [
        { path: '/api/free', price: 0 },
        { path: '/api/paid', price: 0.001 },
      ],
    });
  });

  it('should authorize free routes without payment', async () => {
    const result = await server.handleRequest('/api/free', 'GET', {});

    expect(result.authorized).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it('should reject paid routes without payment header', async () => {
    const result = await server.handleRequest('/api/paid', 'GET', {});

    expect(result.authorized).toBe(false);
    expect(result.reason).toBe('Payment required');
  });

  it('should reject invalid payment format', async () => {
    const result = await server.handleRequest('/api/paid', 'GET', {
      'x-payment': 'invalid-json',
    });

    expect(result.authorized).toBe(false);
    expect(result.reason).toBe('Invalid payment format');
  });

  it('should reject non-existent routes', async () => {
    const result = await server.handleRequest('/api/invalid', 'GET', {});

    expect(result.authorized).toBe(false);
    expect(result.reason).toBe('Route not found');
  });
});

describe('Server - Metadata', () => {
  it('should return complete metadata with all fields', () => {
    const recipientAddress = Keypair.generate().publicKey.toBase58();
    const mintAddress = Keypair.generate().publicKey.toBase58();

    const server = createServer({
      network: 'mainnet-beta',
      recipientAddress,
      scheme: 'token-transfer',
      mint: mintAddress,
      decimals: 6,
      routes: [
        { path: '/api/data', price: 10 },
        { path: '/api/premium', price: 50 },
      ],
      serverInfo: {
        name: 'Premium API',
        description: 'High-quality data API',
        contact: 'https://example.com',
        capabilities: ['data-api', 'real-time', 'webhooks'],
      },
    });

    const metadata = server.getServerMetadata();

    expect(metadata.version).toBe('1.0');
    expect(metadata.wallet).toBe(recipientAddress);
    expect(metadata.network).toBe('mainnet-beta');
    expect(metadata.scheme).toBe('token-transfer');
    expect(metadata.mint).toBe(mintAddress);
    expect(metadata.decimals).toBe(6);
    expect(metadata.server?.name).toBe('Premium API');
    expect(metadata.server?.description).toBe('High-quality data API');
    expect(metadata.capabilities).toContain('data-api');
    expect(metadata.routes).toHaveLength(2);
  });

  it('should return metadata without server info', () => {
    const recipientAddress = Keypair.generate().publicKey.toBase58();

    const server = createServer({
      network: 'devnet',
      recipientAddress,
      routes: [{ path: '/api/test', price: 0.001 }],
    });

    const metadata = server.getServerMetadata();

    expect(metadata.server).toBeUndefined();
    expect(metadata.capabilities).toBeUndefined();
  });
});
