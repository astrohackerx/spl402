const { createServer, createExpressMiddleware } = require('spl402');
const express = require('express');

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YourSolanaWalletAddress',
  rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  serverInfo: {
    name: 'Token-Gated API Server',
    description: 'API with token-gated access for SPL402 holders',
    contact: 'https://myapi.com',
    capabilities: ['token-gated', 'premium-content'],
  },
  routes: [
    {
      path: '/api/holders-only',
      price: 0,
      tokenGate: {
        mint: 'DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump',
        minimumBalance: 1000,
      }
    },
    {
      path: '/api/vip',
      price: 0,
      tokenGate: {
        mint: 'DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump',
        minimumBalance: 10000,
      }
    },
    {
      path: '/api/hybrid',
      price: 0.01,
      tokenGate: {
        mint: 'DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump',
        minimumBalance: 500,
      }
    },
    {
      path: '/api/token2022-gate',
      price: 0,
      tokenGate: {
        mint: 'YourToken2022MintAddress',
        minimumBalance: 100,
        tokenProgram: 'token-2022',
      }
    },
    { path: '/api/public', price: 0 },
  ],
});

const app = express();
app.use(express.json());
app.use(createExpressMiddleware(spl402));

app.get('/api/holders-only', (req, res) => {
  res.json({
    message: 'Welcome, SPL402 holder!',
    content: 'Exclusive content for 1000+ token holders',
    tier: 'holder'
  });
});

app.get('/api/vip', (req, res) => {
  res.json({
    message: 'Welcome to the VIP area!',
    content: 'Ultra-exclusive content for 10000+ token holders',
    tier: 'vip',
    perks: ['early-access', 'priority-support', 'exclusive-data']
  });
});

app.get('/api/hybrid', (req, res) => {
  res.json({
    message: 'Premium content',
    content: 'Free for 500+ holders, or pay 0.01 SOL',
    accessMethod: req.headers['x-wallet-address'] ? 'token-gate' : 'payment'
  });
});

app.get('/api/token2022-gate', (req, res) => {
  res.json({
    message: 'Token2022 gated content',
    content: 'This route uses Token2022 program for verification'
  });
});

app.get('/api/public', (req, res) => {
  res.json({
    message: 'Public content',
    content: 'This is free for everyone!'
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Token-Gated Server running on http://localhost:${PORT}`);
  console.log('\nToken-Gated endpoints:');
  console.log('  GET /api/holders-only   - Free for 1000+ SPL402 holders');
  console.log('  GET /api/vip            - Free for 10000+ SPL402 holders');
  console.log('  GET /api/hybrid         - Free for 500+ holders OR 0.01 SOL');
  console.log('  GET /api/token2022-gate - Token2022 gated (100+ tokens)');
  console.log('\nFree endpoints:');
  console.log('  GET /api/public');
  console.log('\nClient usage:');
  console.log('  Include X-Wallet-Address header with your wallet public key');
  console.log('  Example: curl -H "X-Wallet-Address: YourWalletAddress" http://localhost:3000/api/holders-only');
});
