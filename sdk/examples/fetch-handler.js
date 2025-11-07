const { createServer, createFetchMiddleware } = require('../dist/index.js');

// IMPORTANT: Use a reliable RPC endpoint for mainnet
// Default Solana public RPC has rate limits and may not work properly
// Set your custom RPC URL via environment variable or directly in config
// Recommended: Helius, QuickNode, Alchemy

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YourSolanaWalletAddress', // Replace with your wallet address
  rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com', // Use custom RPC!
  routes: [
    { path: '/api/data', price: 0.001, method: 'GET' },
  ],
});

const middleware = createFetchMiddleware(spl402);

async function handleRequest(request) {
  const url = new URL(request.url);

  const middlewareResponse = await middleware(request);
  if (middlewareResponse) {
    return middlewareResponse;
  }

  if (url.pathname === '/api/data') {
    return new Response(JSON.stringify({
      data: 'Protected content',
      timestamp: Date.now()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response('Not Found', { status: 404 });
}

console.log('Fetch-based handler example');
console.log('\n⚠️  IMPORTANT: Using mainnet-beta network');
console.log('   Set SOLANA_RPC_URL environment variable for best performance');
console.log('\nUse this pattern for:');
console.log('  - Cloudflare Workers');
console.log('  - Deno Deploy');
console.log('  - Vercel Edge Functions');
console.log('  - Any fetch-based runtime');
console.log('\nRecommended RPC providers:');
console.log('  - Helius: https://www.helius.dev');
console.log('  - QuickNode: https://www.quicknode.com');
console.log('  - Alchemy: https://www.alchemy.com');

module.exports = { handleRequest };
