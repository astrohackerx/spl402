import { describe, it, expect, beforeAll } from '@jest/globals';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { createClient, createServer } from '../../src';
import { WalletAdapter } from '../../src/client';

describe('Integration - Solana Devnet', () => {
  let connection: Connection;
  let serverWallet: Keypair;
  let clientWallet: Keypair;

  beforeAll(() => {
    connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    serverWallet = Keypair.generate();
    clientWallet = Keypair.generate();
  });

  it('should connect to Solana devnet', async () => {
    const version = await connection.getVersion();
    expect(version).toBeDefined();
    expect(version['solana-core']).toBeDefined();
  });

  it('should create valid keypairs', () => {
    expect(serverWallet.publicKey).toBeInstanceOf(PublicKey);
    expect(clientWallet.publicKey).toBeInstanceOf(PublicKey);
    expect(serverWallet.publicKey.toBase58()).toHaveLength(44);
  });

  it('should get account info from devnet', async () => {
    const accountInfo = await connection.getAccountInfo(serverWallet.publicKey);
    expect(accountInfo).toBeNull();
  });

  it('should get latest blockhash', async () => {
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    expect(blockhash).toBeDefined();
    expect(typeof blockhash).toBe('string');
    expect(lastValidBlockHeight).toBeGreaterThan(0);
  });

  it('should validate devnet RPC endpoint', async () => {
    const slot = await connection.getSlot();
    expect(slot).toBeGreaterThan(0);
  });
});

describe('Integration - Server Configuration', () => {
  it('should create server with devnet config', () => {
    const serverWallet = Keypair.generate();
    const server = createServer({
      network: 'devnet',
      recipientAddress: serverWallet.publicKey.toBase58(),
      routes: [
        { path: '/api/test', price: 0.001 },
      ],
    });

    expect(server).toBeDefined();
    const config = server.getConfig();
    expect(config.network).toBe('devnet');
  });

  it('should create client with devnet config', () => {
    const client = createClient({
      network: 'devnet',
      rpcUrl: 'https://api.devnet.solana.com',
    });

    expect(client).toBeDefined();
    expect(client.getNetwork()).toBe('devnet');
  });
});

describe('Integration - Payment Flow Simulation', () => {
  it('should simulate payment requirement', () => {
    const serverWallet = Keypair.generate();
    const server = createServer({
      network: 'devnet',
      recipientAddress: serverWallet.publicKey.toBase58(),
      routes: [
        { path: '/api/data', price: 0.001 },
      ],
    });

    const requirement = server.getPaymentRequirement('/api/data', 'GET');

    expect(requirement).not.toBeNull();
    expect(requirement?.amount).toBe(0.001);
    expect(requirement?.recipient).toBe(serverWallet.publicKey.toBase58());
    expect(requirement?.network).toBe('devnet');
    expect(requirement?.scheme).toBe('transfer');
  });

  it('should create mock wallet adapter', () => {
    const keypair = Keypair.generate();

    const mockWallet: WalletAdapter = {
      publicKey: keypair.publicKey,
      signAndSendTransaction: async (tx) => {
        return { signature: '5'.repeat(88) };
      },
    };

    expect(mockWallet.publicKey).toBeInstanceOf(PublicKey);
    expect(mockWallet.signAndSendTransaction).toBeDefined();
  });
});

describe('Integration - Standard Routes', () => {
  it('should respond to health check', () => {
    const serverWallet = Keypair.generate();
    const server = createServer({
      network: 'devnet',
      recipientAddress: serverWallet.publicKey.toBase58(),
      routes: [{ path: '/api/test', price: 0.001 }],
    });

    const healthResponse = server.createHealthResponse();

    expect(healthResponse.status).toBe(200);
    expect(healthResponse.body.status).toBe('ok');
    expect(healthResponse.body.timestamp).toBeGreaterThan(0);
  });

  it('should respond with server metadata', () => {
    const serverWallet = Keypair.generate();
    const server = createServer({
      network: 'devnet',
      recipientAddress: serverWallet.publicKey.toBase58(),
      routes: [
        { path: '/api/data', price: 0.001 },
        { path: '/api/premium', price: 0.005 },
      ],
      serverInfo: {
        name: 'Test API',
        description: 'Integration test server',
        contact: 'https://test.com',
      },
    });

    const metadataResponse = server.createMetadataResponse();

    expect(metadataResponse.status).toBe(200);
    expect(metadataResponse.body.version).toBe('1.0');
    expect(metadataResponse.body.server?.name).toBe('Test API');
    expect(metadataResponse.body.routes).toHaveLength(2);
  });

  it('should handle free routes without payment', async () => {
    const serverWallet = Keypair.generate();
    const server = createServer({
      network: 'devnet',
      recipientAddress: serverWallet.publicKey.toBase58(),
      routes: [
        { path: '/api/free', price: 0 },
        { path: '/api/paid', price: 0.001 },
      ],
    });

    const freeRouteResult = await server.handleRequest('/api/free', 'GET', {});
    const paidRouteResult = await server.handleRequest('/api/paid', 'GET', {});

    expect(freeRouteResult.authorized).toBe(true);
    expect(paidRouteResult.authorized).toBe(false);
    expect(paidRouteResult.reason).toBe('Payment required');
  });
});

describe('Integration - Error Handling', () => {
  it('should handle non-existent routes', async () => {
    const serverWallet = Keypair.generate();
    const server = createServer({
      network: 'devnet',
      recipientAddress: serverWallet.publicKey.toBase58(),
      routes: [{ path: '/api/test', price: 0.001 }],
    });

    const result = await server.handleRequest('/api/nonexistent', 'GET', {});

    expect(result.authorized).toBe(false);
    expect(result.reason).toBe('Route not found');
  });

  it('should handle invalid payment format', async () => {
    const serverWallet = Keypair.generate();
    const server = createServer({
      network: 'devnet',
      recipientAddress: serverWallet.publicKey.toBase58(),
      routes: [{ path: '/api/test', price: 0.001 }],
    });

    const result = await server.handleRequest('/api/test', 'GET', {
      'x-payment': 'invalid-json',
    });

    expect(result.authorized).toBe(false);
    expect(result.reason).toBe('Invalid payment format');
  });
});

describe('Integration - Multi-route Configuration', () => {
  it('should handle multiple routes with different prices', () => {
    const serverWallet = Keypair.generate();
    const server = createServer({
      network: 'devnet',
      recipientAddress: serverWallet.publicKey.toBase58(),
      routes: [
        { path: '/api/free', price: 0 },
        { path: '/api/cheap', price: 0.0001 },
        { path: '/api/standard', price: 0.001 },
        { path: '/api/premium', price: 0.01 },
      ],
    });

    const freeReq = server.getPaymentRequirement('/api/free', 'GET');
    const cheapReq = server.getPaymentRequirement('/api/cheap', 'GET');
    const standardReq = server.getPaymentRequirement('/api/standard', 'GET');
    const premiumReq = server.getPaymentRequirement('/api/premium', 'GET');

    expect(freeReq?.amount).toBe(0);
    expect(cheapReq?.amount).toBe(0.0001);
    expect(standardReq?.amount).toBe(0.001);
    expect(premiumReq?.amount).toBe(0.01);
  });

  it('should handle routes with different HTTP methods', () => {
    const serverWallet = Keypair.generate();
    const server = createServer({
      network: 'devnet',
      recipientAddress: serverWallet.publicKey.toBase58(),
      routes: [
        { path: '/api/data', price: 0.001, method: 'GET' },
        { path: '/api/data', price: 0.005, method: 'POST' },
        { path: '/api/data', price: 0.003, method: 'PUT' },
      ],
    });

    const getReq = server.getPaymentRequirement('/api/data', 'GET');
    const postReq = server.getPaymentRequirement('/api/data', 'POST');
    const putReq = server.getPaymentRequirement('/api/data', 'PUT');

    expect(getReq?.amount).toBe(0.001);
    expect(postReq?.amount).toBe(0.005);
    expect(putReq?.amount).toBe(0.003);
  });
});
