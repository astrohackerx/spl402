const { createServer, createExpressMiddleware } = require('spl402');
const express = require('express');

// IMPORTANT: Use a reliable RPC endpoint for mainnet
// Default Solana public RPC has rate limits and may not work properly
// Recommended RPC providers:
// - Helius: https://www.helius.dev (free tier available)
// - QuickNode: https://www.quicknode.com
// - Alchemy: https://www.alchemy.com
// - Get your RPC URL and set it here

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YourSolanaWalletAddress', // Replace with your wallet address
  rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com', // Use custom RPC!
  routes: [
    { path: '/api/premium', price: 0.001, method: 'GET' },
    { path: '/api/data', price: 0.0005, method: 'GET' },
    { path: '/api/content', price: 0.002, method: 'POST' },
  ],
});

const app = express();
app.use(express.json());
app.use(createExpressMiddleware(spl402));

app.get('/api/free', (req, res) => {
  res.json({ message: 'This endpoint is free!' });
});

app.get('/api/premium', (req, res) => {
  res.json({
    message: 'Premium content',
    data: 'This costs 0.001 SOL'
  });
});

app.get('/api/data', (req, res) => {
  res.json({
    users: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]
  });
});

app.post('/api/content', (req, res) => {
  res.json({
    success: true,
    message: 'Content created',
    data: req.body
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('\n⚠️  IMPORTANT: Using mainnet-beta network');
  console.log('   Set SOLANA_RPC_URL environment variable for best performance');
  console.log('   Example: export SOLANA_RPC_URL="https://your-rpc-url.com"');
  console.log('\nProtected endpoints:');
  console.log('  GET  /api/premium - 0.001 SOL');
  console.log('  GET  /api/data    - 0.0005 SOL');
  console.log('  POST /api/content - 0.002 SOL');
  console.log('\nFree endpoints:');
  console.log('  GET  /api/free');
});
