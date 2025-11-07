# spl402

**SPL-402: Solana Payment Layer 402** - HTTP-native payments for Solana blockchain

A lightweight, zero-dependency implementation of HTTP 402 Payment Required for Solana. Accept payments directly on your API endpoints without middlemen, platforms, or facilitators.

## Table of Contents

- [What is SPL-402?](#what-is-spl-402)
- [Why SPL-402 vs x402?](#why-spl-402-vs-x402)
- [How It Works](#how-it-works)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Important: RPC Configuration](#important-rpc-configuration)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Features](#features)
- [License](#license)

## What is SPL-402?

SPL-402 is a protocol that brings the HTTP 402 Payment Required status code to life on Solana. It enables:

- **Direct payments**: Wallet-to-wallet transfers with no intermediaries
- **Zero platform fees**: Only pay Solana network transaction fees (~$0.00001)
- **HTTP-native**: Works with standard HTTP/fetch APIs
- **Simple integration**: One middleware, one client call

Think of it as "pay-per-request" for your APIs, but without the overhead of traditional payment processors.

## Why SPL-402 vs x402?

| Feature | SPL-402 | x402 |
|---------|---------|------|
| **Latency** | ~500ms | ~2000ms |
| **Platform Fees** | 0% | Variable |
| **Dependencies** | 0 (peer deps only) | Multiple |
| **Transaction Cost** | ~$0.00001 | Higher |
| **Speed** | 3-4x faster | Baseline |
| **Middleman** | None | Yes |
| **API Keys** | Not required | Required |
| **Setup Time** | < 5 minutes | Longer |

**Why is SPL-402 faster?**

1. **No facilitator**: Payments go directly from payer to recipient
2. **Minimal verification**: Only checks on-chain signature, no third-party APIs
3. **Optimized code**: Zero external dependencies, pure Solana primitives
4. **Local-first**: Can verify payments without external RPC calls in many cases

## How It Works

```
┌─────────┐                ┌─────────┐                ┌─────────┐
│ Client  │                │  Your   │                │ Solana  │
│         │                │  API    │                │ Network │
└────┬────┘                └────┬────┘                └────┬────┘
     │                          │                          │
     │  1. GET /api/data        │                          │
     ├─────────────────────────>│                          │
     │                          │                          │
     │  2. 402 Payment Required │                          │
     │     + Payment details    │                          │
     │<─────────────────────────┤                          │
     │                          │                          │
     │  3. Create & sign tx     │                          │
     │──────────────────────────┼─────────────────────────>│
     │                          │                          │
     │  4. GET /api/data        │                          │
     │     + Payment proof      │                          │
     ├─────────────────────────>│                          │
     │                          │                          │
     │                          │  5. Verify signature     │
     │                          │─────────────────────────>│
     │                          │<─────────────────────────┤
     │                          │                          │
     │  6. 200 OK + Data        │                          │
     │<─────────────────────────┤                          │
     │                          │                          │
```

### Payment Flow

1. **Client requests protected resource** → Server responds with `402 Payment Required`
2. **Server includes payment details** → Amount, recipient address, network
3. **Client creates Solana transaction** → Signs and submits to network
4. **Client retries request with proof** → Includes transaction signature
5. **Server verifies payment** → Checks signature on-chain
6. **Server returns content** → Client receives requested data

## Installation

```bash
npm install spl402 @solana/web3.js
```

**For React/Next.js apps:**
```bash
npm install spl402 @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-react-ui
```

**Peer dependencies:**
- `@solana/web3.js` - Solana blockchain interaction
- `bs58` - Base58 encoding (usually included)
- `react` - Optional, only for React hooks

## Quick Start

### Server Setup (Express)

```typescript
import { createServer, createExpressMiddleware } from 'spl402';
import express from 'express';

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_WALLET_ADDRESS',
  rpcUrl: process.env.SOLANA_RPC_URL, // IMPORTANT: Use custom RPC!
  routes: [
    { path: '/api/premium', price: 0.001, method: 'GET' },
    { path: '/api/data', price: 0.0005, method: 'GET' },
  ],
});

const app = express();
app.use(createExpressMiddleware(spl402));

app.get('/api/premium', (req, res) => {
  res.json({ message: 'Protected content!' });
});

app.listen(3000);
```

### Client Setup (React)

**Recommended for production apps:**

```tsx
import { useWallet } from '@solana/wallet-adapter-react';
import { useSPL402 } from 'spl402';

function PremiumContent() {
  const { publicKey, signAndSendTransaction } = useWallet();

  const { makeRequest, loading, error } = useSPL402({
    network: 'mainnet-beta',
    rpcUrl: process.env.REACT_APP_SOLANA_RPC_URL,
  });

  const fetchPremiumData = async () => {
    const response = await makeRequest('/api/premium', {
      publicKey,
      signAndSendTransaction,
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <button onClick={fetchPremiumData} disabled={loading}>
      {loading ? 'Processing...' : 'Get Premium Data (0.001 SOL)'}
    </button>
  );
}
```

### Client Setup (Vanilla TypeScript)

**For non-React projects:**

```typescript
import { createClient } from 'spl402';

const client = createClient({
  network: 'mainnet-beta',
  rpcUrl: process.env.SOLANA_RPC_URL,
});

// Get wallet (Phantom, Solflare, etc.)
const wallet = window.phantom?.solana;
await wallet.connect();

// Make paid request
const response = await client.makeRequest('/api/premium', wallet);
const data = await response.json();
```

**Supported Wallets:**
- ✅ Phantom
- ✅ Solflare
- ✅ Backpack
- ✅ Glow
- ✅ Any Solana Wallet Adapter compatible wallet

### Server Setup (Fetch-based runtimes)

For Cloudflare Workers, Deno Deploy, Vercel Edge:

```typescript
import { createServer, createFetchMiddleware } from 'spl402';

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_WALLET_ADDRESS',
  rpcUrl: process.env.SOLANA_RPC_URL, // IMPORTANT: Use custom RPC!
  routes: [{ path: '/api/data', price: 0.001 }],
});

const middleware = createFetchMiddleware(spl402);

export default {
  async fetch(request: Request) {
    const middlewareResponse = await middleware(request);
    if (middlewareResponse) return middlewareResponse;

    return new Response(JSON.stringify({ data: 'Protected!' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

## Important: RPC Configuration

⚠️ **The default Solana public RPC endpoint has rate limits and may not work properly in production.**

### Get a Custom RPC Endpoint

Choose one of these providers (all have free tiers):

1. **Helius** (recommended): https://www.helius.dev
   - Free tier: 100 requests/second
   - Best for production

2. **QuickNode**: https://www.quicknode.com
   - Free tier: 30M credits/month
   - Good reliability

3. **Alchemy**: https://www.alchemy.com
   - Free tier available
   - Multi-chain support

### Configure Your RPC

```typescript
// Server
const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_WALLET',
  rpcUrl: 'https://your-rpc-endpoint.com', // Set your custom RPC here
  routes: [{ path: '/api/data', price: 0.001 }],
});

// Client
const client = createClient({
  network: 'mainnet-beta',
  rpcUrl: 'https://your-rpc-endpoint.com' // Set your custom RPC here
});
```

Or use environment variables:

```bash
export SOLANA_RPC_URL="https://your-rpc-endpoint.com"
```

## API Reference

### Server API

#### `createServer(config: ServerConfig)`

Creates an SPL-402 server instance.

**Config:**
```typescript
{
  network: 'mainnet-beta' | 'devnet' | 'testnet',
  recipientAddress: string,        // Your Solana wallet address
  routes: RoutePrice[],            // Protected endpoints
  scheme?: 'transfer' | 'token-transfer',  // Default: 'transfer'
  mint?: string,                   // Required if scheme is 'token-transfer'
  rpcUrl?: string                  // Custom RPC endpoint (HIGHLY RECOMMENDED)
}
```

**RoutePrice:**
```typescript
{
  path: string,      // '/api/data'
  price: number,     // 0.001 (in SOL or tokens)
  method?: string    // 'GET' | 'POST' | etc.
}
```

#### `createExpressMiddleware(server: SPL402Server)`

Returns Express middleware for payment verification.

#### `createFetchMiddleware(server: SPL402Server)`

Returns fetch-compatible middleware for edge runtimes.

### Client API

#### `createClient(config: SPL402Config)`

Creates an SPL-402 client instance.

**Config:**
```typescript
{
  network: 'mainnet-beta' | 'devnet' | 'testnet',
  rpcUrl?: string  // Custom RPC endpoint (HIGHLY RECOMMENDED)
}
```

#### `client.makeRequest(url: string, wallet: WalletAdapter, options?: RequestInit)`

Makes a payment-protected HTTP request using your connected wallet.

**Parameters:**
- `url`: The API endpoint to request
- `wallet`: Your connected Solana wallet (Phantom, Solflare, etc.)
- `options`: Optional fetch options

**Returns:** Fetch Response object

**Throws:** Error if payment fails, wallet not connected, or payment rejected

**Example:**
```typescript
// Connect wallet
const wallet = window.phantom?.solana;
await wallet.connect();

// Make paid request
const response = await client.makeRequest(
  'https://api.example.com/premium',
  wallet
);

const data = await response.json();
```

### Verification API

#### `verifyPayment(request: VerifyPaymentRequest)`

Verifies payment against Solana blockchain (uses RPC).

#### `verifyPaymentLocal(payment: SPL402PaymentPayload, signature: string)`

Verifies payment signature locally (no RPC call).

## Examples

Check the [`examples/`](./examples) directory for production-ready TypeScript/React code:

- **[react-example.tsx](./sdk/examples/react-example.tsx)** - React component with useSPL402 hook
- **[nextjs-app.tsx](./sdk/examples/nextjs-app.tsx)** - Next.js App Router implementation
- **[vanilla-ts.ts](./sdk/examples/vanilla-ts.ts)** - Vanilla TypeScript with Phantom
- **[basic-server.js](./sdk/examples/basic-server.js)** - Express server backend
- **[token-server.js](./sdk/examples/token-server.js)** - Accept SPL tokens (USDC)
- **[fetch-handler.js](./sdk/examples/fetch-handler.js)** - Edge runtime compatible

See [examples/README.md](./sdk/examples/README.md) for detailed setup and implementation guides.

## Features

### ✅ Implemented

- ✅ Direct SOL transfers
- ✅ SPL token transfers
- ✅ React hooks (`useSPL402`)
- ✅ Express middleware
- ✅ Fetch-compatible middleware (Edge runtime)
- ✅ Payment verification
- ✅ Signature validation
- ✅ Multiple route pricing
- ✅ Custom RPC endpoints
- ✅ Full TypeScript support
- ✅ Wallet adapter integration
- ✅ Zero dependencies (only peer deps)

### 🔄 Roadmap

- [ ] Payment caching/session management
- [ ] Webhook notifications
- [ ] Rate limiting integration
- [ ] Analytics/metrics helpers
- [ ] Payment receipts/invoicing

## Configuration Examples

### Multiple Routes with Different Prices

```typescript
const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_WALLET',
  rpcUrl: process.env.SOLANA_RPC_URL,
  routes: [
    { path: '/api/basic', price: 0.0001, method: 'GET' },
    { path: '/api/premium', price: 0.001, method: 'GET' },
    { path: '/api/create', price: 0.005, method: 'POST' },
  ],
});
```

### SPL Token Payments

```typescript
const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_WALLET',
  rpcUrl: process.env.SOLANA_RPC_URL,
  scheme: 'token-transfer',
  mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  routes: [
    { path: '/api/data', price: 1, method: 'GET' }, // 1 USDC
  ],
});
```

### Using Devnet for Testing

```typescript
const spl402 = createServer({
  network: 'devnet',
  recipientAddress: 'YOUR_WALLET',
  rpcUrl: 'https://api.devnet.solana.com', // or custom devnet RPC
  routes: [{ path: '/api/test', price: 0.001 }],
});

// Get devnet SOL from: https://faucet.solana.com
```

## Testing

Run the test suite:

```bash
npm test
```

Tests verify:
- Server creation and configuration
- Client creation
- Payment payload generation
- Signature verification
- Middleware functionality

## Security Considerations

1. **Always verify payments server-side** - Never trust client payment claims
2. **Use HTTPS in production** - Prevent payment data interception
3. **Secure your keypair** - Never expose private keys in client code
4. **Rate limiting** - Implement rate limiting to prevent abuse
5. **Monitor transactions** - Watch for unusual payment patterns
6. **Validate amounts** - Always check payment amounts match expected prices
7. **Use custom RPC** - Avoid rate limits and ensure reliability

## Network Support

- ✅ **Mainnet-beta** (production) - **Recommended**
- ✅ **Devnet** (development/testing)
- ✅ **Testnet** (staging)

## Browser Support

Client works in:
- ✅ Node.js 16+
- ✅ Modern browsers (with bundler)
- ✅ Cloudflare Workers
- ✅ Deno
- ✅ Vercel Edge Functions

## Troubleshooting

### "429 Too Many Requests"
**Problem**: Hitting rate limits on public RPC
**Solution**: Use a custom RPC endpoint (see [RPC Configuration](#important-rpc-configuration))

### "Transaction simulation failed"
**Problem**: Wallet might not have enough SOL, or network congestion
**Solution**: Ensure wallet has sufficient balance, try again, or use a better RPC endpoint

### "Payment verification failed"
**Problem**: Transaction might not be confirmed yet, or RPC is slow
**Solution**: Wait a moment and retry, or use a faster RPC endpoint

## Contributing

Contributions welcome! Please check the issues or submit PRs.

## License

MIT

## Links

- [Website](https://spl402.org)
- [GitHub Repository](https://github.com/astrohackerx/spl402)
- [NPM Package](https://www.npmjs.com/package/spl402)

- [Solana Docs](https://docs.solana.com)
- [HTTP 402 Status Code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402)

---

Built with ❤️ for the Solana ecosystem
