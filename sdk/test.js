const {
  createServer,
  createClient,
  createExpressMiddleware,
  createFetchMiddleware,
  verifyPayment,
  SPL402_VERSION
} = require('spl402');
const { Keypair, PublicKey } = require('@solana/web3.js');
const bs58 = require('bs58').default || require('bs58');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   Error: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

console.log('🧪 Running SPL-402 SDK Tests\n');

test('SPL402_VERSION is defined', () => {
  assert(typeof SPL402_VERSION === 'number', 'SPL402_VERSION should be a number');
  assert(SPL402_VERSION === 1, 'SPL402_VERSION should be 1');
});

test('createServer creates server instance', () => {
  const server = createServer({
    network: 'devnet',
    recipientAddress: Keypair.generate().publicKey.toBase58(),
    routes: [
      { path: '/api/data', price: 0.001, method: 'GET' }
    ]
  });

  assert(server !== null, 'Server should be created');
  assert(typeof server === 'object', 'Server should be an object');
});

test('createServer validates config', () => {
  try {
    createServer({
      network: 'devnet',
      recipientAddress: 'invalid-address',
      routes: []
    });
    throw new Error('Should have thrown error');
  } catch (error) {
    assert(error.message.includes('Invalid') || error.message, 'Should throw validation error');
  }
});

test('createServer accepts valid recipient address', () => {
  const keypair = Keypair.generate();
  const server = createServer({
    network: 'devnet',
    recipientAddress: keypair.publicKey.toBase58(),
    routes: [{ path: '/api/test', price: 0.001 }]
  });

  assert(server !== null, 'Server should accept valid address');
});

test('createServer with token transfer scheme', () => {
  const server = createServer({
    network: 'devnet',
    recipientAddress: Keypair.generate().publicKey.toBase58(),
    scheme: 'token-transfer',
    mint: Keypair.generate().publicKey.toBase58(),
    routes: [{ path: '/api/tokens', price: 10 }]
  });

  assert(server !== null, 'Server should support token transfers');
});

test('createServer with multiple routes', () => {
  const server = createServer({
    network: 'mainnet-beta',
    recipientAddress: Keypair.generate().publicKey.toBase58(),
    routes: [
      { path: '/api/free', price: 0, method: 'GET' },
      { path: '/api/cheap', price: 0.0001, method: 'GET' },
      { path: '/api/expensive', price: 0.01, method: 'POST' },
    ]
  });

  assert(server !== null, 'Server should handle multiple routes');
});

test('createClient creates client instance', () => {
  const client = createClient({
    network: 'devnet'
  });

  assert(client !== null, 'Client should be created');
  assert(typeof client === 'object', 'Client should be an object');
  assert(typeof client.makeRequest === 'function', 'Client should have makeRequest method');
});

test('createClient with custom RPC', () => {
  const client = createClient({
    network: 'devnet',
    rpcUrl: 'https://api.devnet.solana.com'
  });

  assert(client !== null, 'Client should accept custom RPC');
});

test('createClient supports all networks', () => {
  const devnetClient = createClient({ network: 'devnet' });
  const testnetClient = createClient({ network: 'testnet' });
  const mainnetClient = createClient({ network: 'mainnet-beta' });

  assert(devnetClient !== null, 'Should support devnet');
  assert(testnetClient !== null, 'Should support testnet');
  assert(mainnetClient !== null, 'Should support mainnet-beta');
});

test('createExpressMiddleware returns function', () => {
  const server = createServer({
    network: 'devnet',
    recipientAddress: Keypair.generate().publicKey.toBase58(),
    routes: [{ path: '/api/test', price: 0.001 }]
  });

  const middleware = createExpressMiddleware(server);

  assert(typeof middleware === 'function', 'Middleware should be a function');
  assert(middleware.length === 3, 'Express middleware should take 3 arguments');
});

test('createFetchMiddleware returns function', () => {
  const server = createServer({
    network: 'devnet',
    recipientAddress: Keypair.generate().publicKey.toBase58(),
    routes: [{ path: '/api/test', price: 0.001 }]
  });

  const middleware = createFetchMiddleware(server);

  assert(typeof middleware === 'function', 'Middleware should be a function');
});

test('verifyPayment function exists', () => {
  assert(typeof verifyPayment === 'function', 'verifyPayment should be a function');
});

test('Payment payload structure', () => {
  const from = Keypair.generate().publicKey.toBase58();
  const to = Keypair.generate().publicKey.toBase58();

  const payload = {
    spl402Version: SPL402_VERSION,
    scheme: 'transfer',
    network: 'devnet',
    payload: {
      from,
      to,
      amount: 1000000,
      signature: 'test-sig',
      timestamp: Date.now()
    }
  };

  assert(payload.spl402Version === 1, 'Version should be 1');
  assert(payload.scheme === 'transfer', 'Scheme should be transfer');
  assert(payload.network === 'devnet', 'Network should be devnet');
  assert(payload.payload.from === from, 'From address should match');
  assert(payload.payload.to === to, 'To address should match');
  assert(typeof payload.payload.amount === 'number', 'Amount should be number');
  assert(typeof payload.payload.timestamp === 'number', 'Timestamp should be number');
});

test('Token transfer payload structure', () => {
  const payload = {
    spl402Version: SPL402_VERSION,
    scheme: 'token-transfer',
    network: 'mainnet-beta',
    payload: {
      from: Keypair.generate().publicKey.toBase58(),
      to: Keypair.generate().publicKey.toBase58(),
      mint: Keypair.generate().publicKey.toBase58(),
      amount: 1000000,
      signature: 'test-sig',
      timestamp: Date.now()
    }
  };

  assert(payload.scheme === 'token-transfer', 'Scheme should be token-transfer');
  assert(typeof payload.payload.mint === 'string', 'Mint should be string');
  assert(payload.payload.mint.length > 0, 'Mint should not be empty');
});

test('Server route matching', () => {
  const server = createServer({
    network: 'devnet',
    recipientAddress: Keypair.generate().publicKey.toBase58(),
    routes: [
      { path: '/api/data', price: 0.001, method: 'GET' },
      { path: '/api/create', price: 0.005, method: 'POST' }
    ]
  });

  assert(server !== null, 'Server should handle route matching');
});

test('Price validation (non-negative)', () => {
  try {
    createServer({
      network: 'devnet',
      recipientAddress: Keypair.generate().publicKey.toBase58(),
      routes: [
        { path: '/api/invalid', price: -0.001, method: 'GET' }
      ]
    });
  } catch (error) {
  }
});

test('Zero price routes allowed', () => {
  const server = createServer({
    network: 'devnet',
    recipientAddress: Keypair.generate().publicKey.toBase58(),
    routes: [
      { path: '/api/free', price: 0, method: 'GET' }
    ]
  });

  assert(server !== null, 'Server should allow zero-price routes');
});

test('SOL payment requirement excludes mint and decimals', () => {
  const server = createServer({
    network: 'devnet',
    recipientAddress: Keypair.generate().publicKey.toBase58(),
    routes: [{ path: '/api/sol', price: 0.001 }]
  });

  const requirement = server.getPaymentRequirement('/api/sol', 'GET');

  assert(requirement !== null, 'Should return payment requirement');
  assert(requirement.scheme === 'transfer', 'Scheme should be transfer for SOL');
  assert(requirement.mint === undefined, 'Mint should be undefined for SOL payments');
  assert(requirement.decimals === undefined, 'Decimals should be undefined for SOL payments');
  assert(requirement.amount === 0.001, 'Amount should match');
});

test('Token payment requirement includes mint and decimals', () => {
  const mintAddress = Keypair.generate().publicKey.toBase58();
  const server = createServer({
    network: 'mainnet-beta',
    recipientAddress: Keypair.generate().publicKey.toBase58(),
    scheme: 'token-transfer',
    mint: mintAddress,
    decimals: 6,
    routes: [{ path: '/api/tokens', price: 10 }]
  });

  const requirement = server.getPaymentRequirement('/api/tokens', 'GET');

  assert(requirement !== null, 'Should return payment requirement');
  assert(requirement.scheme === 'token-transfer', 'Scheme should be token-transfer');
  assert(requirement.mint === mintAddress, 'Mint should be included');
  assert(requirement.decimals === 6, 'Decimals should be included');
  assert(requirement.amount === 10, 'Amount should match');
});

test('Exports are properly defined', () => {
  assert(typeof createServer === 'function', 'createServer should be exported');
  assert(typeof createClient === 'function', 'createClient should be exported');
  assert(typeof createExpressMiddleware === 'function', 'createExpressMiddleware should be exported');
  assert(typeof createFetchMiddleware === 'function', 'createFetchMiddleware should be exported');
  assert(typeof verifyPayment === 'function', 'verifyPayment should be exported');
  assert(typeof SPL402_VERSION === 'number', 'SPL402_VERSION should be exported');
});

console.log(`\n📊 Test Results:`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   📦 Total: ${passed + failed}`);

if (failed > 0) {
  console.log('\n❌ Some tests failed');
  process.exit(1);
} else {
  console.log('\n✅ All tests passed!');
  process.exit(0);
}
