const { createServer, createExpressMiddleware } = require('spl402');
const express = require('express');

// IMPORTANT: Use a reliable RPC endpoint for mainnet
// Default Solana public RPC has rate limits and may not work properly
// Recommended RPC providers:
// - Helius: https://www.helius.dev (free tier available)
// - QuickNode: https://www.quicknode.com
// - Alchemy: https://www.alchemy.com

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YourSolanaWalletAddress', // Replace with your wallet address
  rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com', // Use custom RPC!
  scheme: 'token-transfer',
  mint: 'DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump', // SPL402 token mint
  decimals: 6, // SPL402 has 6 decimals
  routes: [
    { path: '/api/token-data', price: 10, method: 'GET' },  // 10 SPL402
    { path: '/api/token-submit', price: 20, method: 'POST' }, // 20 SPL402
  ],
});

const app = express();
app.use(express.json());
app.use(createExpressMiddleware(spl402));

app.get('/api/token-data', (req, res) => {
  res.json({
    message: 'Premium token-gated content',
    data: 'This costs 10 SPL402 tokens'
  });
});

app.post('/api/token-submit', (req, res) => {
  res.json({
    success: true,
    message: 'Data submitted successfully',
    data: req.body,
    cost: '20 SPL402 tokens'
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Token server running on http://localhost:${PORT}`);
  console.log('\n⚠️  IMPORTANT: Using mainnet-beta network');
  console.log('   Set SOLANA_RPC_URL environment variable for best performance');
  console.log('   Example: export SOLANA_RPC_URL="https://your-rpc-url.com"');
  console.log('\nThis server accepts SPL token payments (SPL402)');
  console.log('Token: SPL402 (6 decimals)');
  console.log('Mint: DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump');
  console.log('Protected endpoints:');
  console.log('  GET  /api/token-data   - 10 SPL402');
  console.log('  POST /api/token-submit - 20 SPL402');
  console.log('\nCommon token decimals:');
  console.log('  SPL402: 6, USDC: 6, USDT: 6, SOL: 9 (use "transfer" scheme for native SOL)');
});
