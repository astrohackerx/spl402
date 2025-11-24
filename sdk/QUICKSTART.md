# SPL-402 Quick Start Guide

The simplest way to add Solana payments to your API.

## Install

### For Server (Node.js/Express)

```bash
npm install spl402
```

### For Client

```bash
npm install spl402 @solana/web3.js @solana/spl-token bs58
```

For React apps, you'll also need the Solana wallet adapter:

```bash
npm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets
```

## Server Setup (Express)

```javascript
const express = require('express');
const { createServer, createExpressMiddleware } = require('spl402');

const app = express();

// Create SPL-402 server
const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_SOLANA_WALLET_ADDRESS',
  rpcUrl: process.env.SOLANA_RPC_URL, // Get free RPC from https://www.helius.dev
  routes: [
    { path: '/api/premium', price: 0.001 },     // 0.001 SOL - requires payment
    { path: '/api/data', price: 0.005 },        // 0.005 SOL - requires payment
    { path: '/api/public', price: 0 }           // FREE - no payment needed
  ]
});

// Add payment middleware ONCE for all routes
// Free routes (price: 0) automatically pass through - no payment needed
app.use(createExpressMiddleware(spl402));

// Your endpoints (both paid and free)
app.get('/api/premium', (req, res) => {
  res.json({ message: 'Premium content!' });
});

app.get('/api/data', (req, res) => {
  res.json({ data: 'Important data!' });
});

app.get('/api/public', (req, res) => {
  res.json({ message: 'Free public data - no payment required!' });
});

app.listen(3000);
```

## Client Setup (React)

```tsx
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useSPL402 } from 'spl402';
import { Transaction } from '@solana/web3.js';

function MyComponent() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const { makeRequest, loading, error } = useSPL402({
    network: 'mainnet-beta',
    rpcUrl: process.env.REACT_APP_SOLANA_RPC_URL
  });

  const handleClick = async () => {
    if (!publicKey || !sendTransaction) return;

    // Create wallet adapter for SPL-402
    // sendTransaction handles signing AND sending with ONE user approval
    const walletAdapter = {
      publicKey,
      signAndSendTransaction: async (transaction: Transaction) => {
        const signature = await sendTransaction(transaction, connection);
        return { signature };
      }
    };

    // GET request
    const response = await makeRequest(
      'https://api.example.com/premium',
      walletAdapter
    );

    const data = await response.json();
    console.log(data);
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Processing...' : 'Get Premium Content'}
    </button>
  );
}
```

## How It Works

1. Client makes request → Server responds with `402 Payment Required`
2. Client creates payment transaction → User approves in wallet
3. Client retries with payment proof → Server validates and responds with content

## Free Routes (No Payment)

You can mix free and paid routes! Just set `price: 0` for free routes:

```javascript
routes: [
  { path: '/api/premium', price: 0.001 },  // Paid
  { path: '/api/public', price: 0 },       // FREE - no payment needed
  { path: '/api/free-data', price: 0 }     // FREE - no payment needed
]
```

**Important:** You still need to add the route to the `routes` array, even if it's free. The middleware automatically allows `price: 0` routes to pass through without requiring payment.

Routes NOT listed in the `routes` array will return 404.

## Using with Express Routers

The middleware works with Express routers! Just use full paths in your route config:

```javascript
const express = require('express');
const { createServer, createExpressMiddleware } = require('spl402');

const app = express();
const apiRouter = express.Router();

// Configure with FULL paths (including router mount point)
const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_WALLET',
  rpcUrl: process.env.SOLANA_RPC_URL,
  routes: [
    { path: '/api/premium', price: 0.001 },  // Full path: /api/premium
    { path: '/api/public', price: 0 }        // Full path: /api/public
  ]
});

// Apply middleware to the router OR to app - both work!
apiRouter.use(createExpressMiddleware(spl402));

// Define routes in router (relative paths)
apiRouter.get('/premium', (req, res) => {
  res.json({ message: 'Premium!' });
});

apiRouter.get('/public', (req, res) => {
  res.json({ message: 'Free!' });
});

// Mount router at /api
app.use('/api', apiRouter);

app.listen(3000);
```

**Key Point:** Always use the **full URL path** in your routes config, including any router mount points.

## Dynamic Route Parameters

SPL-402 supports Express-style dynamic parameters:

```javascript
const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_WALLET',
  rpcUrl: process.env.SOLANA_RPC_URL,
  routes: [
    { path: '/api/games/:code', price: 0.001 },        // Matches /api/games/abc123
    { path: '/api/users/:id/profile', price: 0.002 },  // Matches /api/users/42/profile
    { path: '/api/files/:filename', price: 0.005 }     // Matches /api/files/document.pdf
  ]
});

app.get('/api/games/:code', (req, res) => {
  const { code } = req.params;
  res.json({ game: code });
});
```

**How it works:**
- `:code`, `:id`, `:filename` are dynamic parameters
- Routes match any value in those positions
- All matching requests require the same payment

## Important Notes

### RPC URL Required
You MUST provide your own RPC URL. Get a free one from:
- [Helius](https://www.helius.dev) (recommended)
- [QuickNode](https://www.quicknode.com)
- [Alchemy](https://www.alchemy.com)

### makeRequest Signature

```typescript
makeRequest(url: string, wallet: WalletAdapter, options?: RequestInit)
```

**Examples:**

```typescript
// GET request
await makeRequest('/api/data', wallet);

// POST request
await makeRequest('/api/data', wallet, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Test' })
});
```

### Token Payments (Optional)

To accept SPL tokens instead of SOL:

```javascript
// Server
const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_WALLET',
  rpcUrl: process.env.SOLANA_RPC_URL,
  scheme: 'token-transfer',
  mint: 'TOKEN_MINT_ADDRESS',
  decimals: 6,
  routes: [
    { path: '/api/data', price: 10 }  // 10 tokens
  ]
});

// Client - no changes needed! Automatically uses token payments
```

## Common Issues

**"Payment validation failed"**
- Make sure RPC URL is set on both server and client
- Ensure wallet has enough SOL for payment + fees

**"Wallet not connected"**
- Check that wallet is connected before calling makeRequest
- Verify wallet adapter is properly initialized

**POST requests not working**
- Make sure to pass options as the THIRD parameter
- Example: `makeRequest(url, wallet, { method: 'POST', body: '...' })`

## What's Next?

- Check [examples/](examples/) folder for complete working examples
- Read [README.md](README.md) for full API documentation
- See [package.json](package.json) for peer dependencies

## Support

- GitHub: [github.com/astrohackerx/spl402](https://github.com/astrohackerx/spl402)
- Website: [spl402.org](https://spl402.org)

---

That's it! You now have payment-protected APIs on Solana. 🚀
