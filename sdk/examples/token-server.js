const { createServer, createExpressMiddleware } = require('../dist/index.js');
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
  mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // Example: USDC mint
  routes: [
    { path: '/api/token-data', price: 10, method: 'GET' }, // 10 USDC
  ],
});

const app = express();
app.use(express.json());
app.use(createExpressMiddleware(spl402));

app.get('/api/token-data', (req, res) => {
  res.json({
    message: 'Premium token-gated content',
    data: 'This costs 10 tokens'
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Token server running on http://localhost:${PORT}`);
  console.log('\n⚠️  IMPORTANT: Using mainnet-beta network');
  console.log('   Set SOLANA_RPC_URL environment variable for best performance');
  console.log('   Example: export SOLANA_RPC_URL="https://your-rpc-url.com"');
  console.log('\nThis server accepts SPL token payments instead of SOL');
  console.log('Protected endpoints:');
  console.log('  GET /api/token-data - 10 tokens');
});
