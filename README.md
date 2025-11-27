# spl402

**SPL-402: Solana Payment Layer 402** - HTTP-native payments for Solana blockchain

A lightweight implementation of HTTP 402 Payment Required for Solana. Accept direct wallet-to-wallet payments on your API endpoints with no middlemen, platforms, or facilitators.

Includes **Solana Attestation Service (SAS)** integration for on-chain server identity verification and decentralized API discovery.

## Installation

```bash
npm install spl402
```

**Peer dependencies:**
```bash
npm install @solana/web3.js @solana/spl-token bs58
```

**For React/Next.js:**
```bash
npm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets
```

## Quick Start

**New to SPL-402?** Start here: [QUICKSTART.md](QUICKSTART.md) for the simplest setup guide.

## Table of Contents

- [What is SPL-402?](#what-is-spl-402)
- [Why SPL-402?](#why-spl-402)
- [How It Works](#how-it-works)
- [Server Setup](#server-setup)
- [Client Setup](#client-setup)
- [Standard Routes](#standard-routes)
- [RPC Configuration](#rpc-configuration)
- [Solana Attestation Service (SAS)](#solana-attestation-service-sas)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Features](#features)
- [Security](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## What is SPL-402?

SPL-402 is a protocol that brings the HTTP 402 Payment Required status code to life on Solana. It enables:

- **Direct payments**: True peer-to-peer wallet-to-wallet transfers with zero intermediaries
- **Zero platform fees**: Only pay Solana network fees (~$0.00001 per transaction)
- **HTTP-native**: Works seamlessly with standard HTTP/fetch APIs
- **Simple integration**: Add one middleware to your server, one function call on client
- **Token flexibility**: Accept native SOL or any SPL token (SPL402, USDC, USDT, etc.)
- **On-chain verification**: SAS attestations prove server identity and ownership
- **Decentralized registry**: Join the growing network of verified API servers

Think of it as "pay-per-request" for your APIs, without payment processors, subscriptions, or API key management.

> **SPL402 Token**: Use the native SPL402 token for payments!
>
> Mint Address: `DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump`
>
> [View on Solana Explorer](https://solscan.io/token/DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump)

## Why SPL-402?

**Pure P2P Architecture**
- No facilitators, intermediaries, or third parties
- Direct wallet-to-wallet transfers only
- Zero platform fees (only Solana network fees: ~$0.00001)
- No API keys or registration required

**Performance**
- Fast verification (~500ms)
- Optimized on-chain transaction checking
- In-memory replay attack prevention
- Pure Solana RPC implementation

**Developer Experience**
- Zero dependencies (only peer deps)
- Full TypeScript support
- Works with all major Solana wallets
- Express and Fetch middleware included
- React hooks available
- Comprehensive tests

**Security**
- Cryptographic signature verification
- Exact amount validation on-chain
- Built-in replay attack protection
- Transaction confirmation checking
- Recipient wallet verification

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

## Server Setup

### Express.js

```javascript
const express = require('express');
const { createServer, createExpressMiddleware } = require('spl402');

const app = express();

// Create SPL-402 server
const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_WALLET_ADDRESS',  // Your Solana wallet
  rpcUrl: process.env.SOLANA_RPC_URL,       // Custom RPC endpoint
  serverInfo: {                              // Optional metadata
    name: 'My API Server',
    description: 'Premium data API',
    contact: 'https://myapi.com',
    capabilities: ['data-api']
  },
  routes: [
    { path: '/api/premium', price: 0.001 },     // 0.001 SOL
    { path: '/api/data', price: 0.005 },        // 0.005 SOL
    { path: '/api/public', price: 0 }           // FREE
  ]
});

// Add payment middleware
app.use(createExpressMiddleware(spl402));

// Standard routes are auto-registered (free):
// GET /health          → 200 OK
// GET /status          → 200 OK
// GET /.well-known/spl402.json → metadata

// Your endpoints
app.get('/api/premium', (req, res) => {
  res.json({ message: 'Premium content!' });
});

app.get('/api/public', (req, res) => {
  res.json({ message: 'Free public data!' });
});

app.listen(3000);
```

**TypeScript:**
```typescript
import { createServer, createExpressMiddleware } from 'spl402';
import express from 'express';
// Same as above
```

### Edge Runtimes (Cloudflare Workers, Deno, Vercel)

```typescript
import { createServer, createFetchMiddleware } from 'spl402';

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_WALLET_ADDRESS',
  rpcUrl: process.env.SOLANA_RPC_URL,
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

### Route Features

**Free Routes**

Mix free and paid routes by setting `price: 0`:

```javascript
routes: [
  { path: '/api/premium', price: 0.001 },  // Paid
  { path: '/api/public', price: 0 },       // FREE
]
```

**Dynamic Parameters**

Use Express-style dynamic parameters:

```javascript
routes: [
  { path: '/api/games/:code', price: 0.001 },        // Matches /api/games/abc123
  { path: '/api/users/:id/profile', price: 0.002 },  // Matches /api/users/42/profile
]
```

**Express Router Support**

Works with Express routers - use full paths in route config:

```javascript
const apiRouter = express.Router();

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_WALLET',
  routes: [
    { path: '/api/premium', price: 0.001 },  // Full path
  ]
});

apiRouter.use(createExpressMiddleware(spl402));
app.use('/api', apiRouter);
```

## Client Setup

### React

```tsx
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useSPL402 } from 'spl402';
import { Transaction } from '@solana/web3.js';

function PremiumContent() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const { makeRequest, loading, error } = useSPL402({
    network: 'mainnet-beta',
    rpcUrl: process.env.REACT_APP_SOLANA_RPC_URL
  });

  const handleClick = async () => {
    if (!publicKey || !sendTransaction) return;

    const walletAdapter = {
      publicKey,
      signAndSendTransaction: async (transaction: Transaction) => {
        const signature = await sendTransaction(transaction, connection);
        return { signature };
      }
    };

    const response = await makeRequest(
      'https://api.example.com/premium',
      walletAdapter
    );

    const data = await response.json();
    console.log(data);
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Processing...' : 'Get Premium Content (0.001 SOL)'}
    </button>
  );
}
```

### Vanilla JavaScript/TypeScript

```typescript
import { createClient } from 'spl402';

const client = createClient({
  network: 'mainnet-beta',
  rpcUrl: process.env.SOLANA_RPC_URL,
});

// Connect wallet (Phantom, Solflare, etc.)
const wallet = window.phantom?.solana;
await wallet.connect();

// Make paid request
const response = await client.makeRequest('/api/premium', wallet);
const data = await response.json();
```

**Supported Wallets:**
- Phantom
- Solflare
- Backpack
- Glow
- Any Solana Wallet Adapter compatible wallet

## Standard Routes

Every SPL-402 server automatically exposes these free endpoints:

### `GET /health`

Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "ok",
  "timestamp": 1763322021055
}
```

### `GET /status`

Alias for `/health` endpoint.

### `GET /.well-known/spl402.json`

Server metadata endpoint following RFC 8615.

**Response:**
```json
{
  "version": "1.0",
  "server": {
    "name": "My API Server",
    "description": "Premium data API with SPL-402 payments",
    "contact": "https://myapi.com"
  },
  "wallet": "YourSolanaWalletAddress",
  "network": "mainnet-beta",
  "scheme": "transfer",
  "routes": [
    {
      "path": "/api/premium",
      "method": "GET",
      "price": 0.001
    }
  ],
  "capabilities": ["data-api"]
}
```

## RPC Configuration

⚠️ **The default Solana public RPC endpoint has rate limits and may not work in production.**

### Recommended RPC Providers

All offer free tiers:

1. **Helius** (recommended): https://www.helius.dev
   - Free tier: 100 requests/second
   - Best for production

2. **QuickNode**: https://www.quicknode.com
   - Free tier: 30M credits/month

3. **Alchemy**: https://www.alchemy.com
   - Free tier: 300M compute units/month

4. **Triton (RPC Pool)**: https://rpcpool.com
   - Solana-native provider

### Configure Your RPC

```typescript
// Server
const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_WALLET',
  rpcUrl: 'https://your-rpc-endpoint.com',
  routes: [{ path: '/api/data', price: 0.001 }],
});

// Client
const client = createClient({
  network: 'mainnet-beta',
  rpcUrl: 'https://your-rpc-endpoint.com'
});
```

## Solana Attestation Service (SAS)

SPL402 supports on-chain server attestations that prove server ownership.

### What is SAS?

Solana Attestation Service provides cryptographic proof of server identity stored on-chain:

- **Server wallet address** - Proves operator controls the payment recipient
- **API endpoint URL** - Links on-chain identity to API server
- **Immutable timestamp** - Permanent record on Solana blockchain
- **Public verification** - Anyone can verify attestations on-chain

### Client-Side Verification

**Query All Verified Servers**

```typescript
import { queryVerifiedServers } from 'spl402';

const servers = await queryVerifiedServers('mainnet-beta');

servers.forEach(server => {
  console.log('Wallet:', server.wallet);
  console.log('Endpoint:', server.endpoint);
  console.log('Description:', server.description);
});
```

**Check Server by Wallet Address**

```typescript
import { checkAttestationByWallet } from 'spl402';

const result = await checkAttestationByWallet(
  'SERVER_WALLET_ADDRESS',
  'mainnet-beta'
);

if (result.isVerified) {
  console.log('✅ Server verified!');
  console.log('API Endpoint:', result.data?.endpoint);
}
```

**Check Server by API Endpoint**

```typescript
import { checkAttestationByEndpoint } from 'spl402';

const result = await checkAttestationByEndpoint(
  'https://api.example.com',
  'mainnet-beta'
);

if (result.isVerified) {
  console.log('✅ API server verified!');
  console.log('Wallet:', result.data?.wallet);
}
```

### Server Registration

For information about registering your API server, visit [spl402.org](https://spl402.org)

## API Reference

### Server API

#### `createServer(config: ServerConfig)`

Creates an SPL-402 server instance.

**Config:**
```typescript
{
  network: 'mainnet-beta' | 'devnet' | 'testnet',
  recipientAddress: string,        // Your Solana wallet
  routes: RoutePrice[],            // Protected endpoints
  scheme?: 'transfer' | 'token-transfer',
  mint?: string,                   // Required for token-transfer
  decimals?: number,               // Required for token-transfer
  rpcUrl?: string,                 // Custom RPC endpoint
  serverInfo?: {
    name?: string,
    description?: string,
    contact?: string,
    capabilities?: string[]
  }
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
  rpcUrl?: string
}
```

#### `client.makeRequest(url: string, wallet: WalletAdapter, options?: RequestInit)`

Makes a payment-protected HTTP request.

**Parameters:**
- `url`: API endpoint
- `wallet`: Connected Solana wallet
- `options`: Optional fetch options

**Returns:** Fetch Response object

### Payment Verification

SPL-402 automatically handles:
- Signature existence verification
- Transaction confirmation checking
- Exact amount validation on-chain
- Recipient wallet verification
- Replay attack prevention (built-in signature caching)

## Examples

Check the [`examples/`](./sdk/examples/) directory for production-ready code:

**Client Examples:**
- **[react-example.tsx](./sdk/examples/react-example.tsx)** - React with `useSPL402` hook
- **[nextjs-app.tsx](./sdk/examples/nextjs-app.tsx)** - Next.js App Router
- **[vanilla-ts.ts](./sdk/examples/vanilla-ts.ts)** - Vanilla TypeScript

**Server Examples:**
- **[basic-server.js](./sdk/examples/basic-server.js)** - Express with SOL payments
- **[token-server.js](./sdk/examples/token-server.js)** - Accept SPL tokens
- **[fetch-handler.js](./sdk/examples/fetch-handler.js)** - Edge runtime compatible

See [examples/README.md](./sdk/examples/README.md) for setup instructions.

## Features

### Core Functionality
- Direct SOL transfers (native Solana payments)
- SPL token transfers (SPL402, USDC, USDT, custom tokens)
- Payment verification with replay attack prevention
- Cryptographic signature validation
- Multiple routes with individual pricing
- On-chain attestation verification support
- Client-side server identity verification

### Standard Routes
- Automatic `/health` endpoint
- Automatic `/status` endpoint
- Automatic `/.well-known/spl402.json` metadata endpoint
- Server metadata configuration
- RFC 8615 compliance

### Integration
- React hooks (`useSPL402`)
- Express.js middleware
- Fetch-compatible middleware (Cloudflare Workers, Deno, Vercel Edge)
- Solana Wallet Adapter integration
- Custom RPC endpoint support

### Developer Experience
- Full TypeScript support
- Zero dependencies (only peer dependencies)
- Comprehensive examples and documentation
- Works with all major Solana wallets
- 245+ comprehensive tests

## SPL Token Payments

Accept SPL tokens (SPL402, USDC, USDT, etc.):

```javascript
// Server
const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_WALLET',
  rpcUrl: process.env.SOLANA_RPC_URL,
  scheme: 'token-transfer',
  mint: 'DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump', // SPL402
  decimals: 6,
  routes: [
    { path: '/api/data', price: 10 }, // 10 SPL402 tokens
  ],
});

// Client - no changes needed!
```

**Common Tokens:**

| Token | Decimals | Mint Address |
|-------|----------|-------------|
| SPL402 | 6 | `DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump` |
| USDC | 6 | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |
| USDT | 6 | `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB` |

## Testing

For devnet testing:

```javascript
const spl402 = createServer({
  network: 'devnet',
  recipientAddress: 'YOUR_WALLET',
  rpcUrl: 'https://api.devnet.solana.com',
  routes: [{ path: '/api/test', price: 0.001 }],
});

// Get devnet SOL from: https://faucet.solana.com
```

**Run Tests:**

```bash
npm test
npm run test:unit
npm run test:integration
npm run test:security
```

## Security Considerations

**Critical Security Rules:**

1. **Server-side verification only** - Never trust client-side payment claims
2. **HTTPS required** - Always use HTTPS in production
3. **Private key safety** - Never expose private keys in client code
4. **Amount validation** - Server verifies exact payment amounts on-chain
5. **Replay protection** - Built-in signature replay prevention via caching

**Best Practices:**

6. **Rate limiting** - Implement rate limiting to prevent abuse
7. **Transaction monitoring** - Monitor for unusual patterns
8. **Custom RPC endpoints** - Use private RPC for reliability
9. **Error handling** - Implement proper error handling
10. **Wallet validation** - Validate wallet addresses before processing

**What SPL-402 Handles Automatically:**
- ✅ Signature verification
- ✅ Amount verification
- ✅ Replay attack prevention
- ✅ Recipient verification
- ✅ Transaction confirmation status

## Network Support

- ✅ **Mainnet-beta** (production)
- ✅ **Devnet** (development/testing)
- ✅ **Testnet** (staging)

## Browser Support

- ✅ Node.js 18+
- ✅ Modern browsers (with bundler)
- ✅ Cloudflare Workers
- ✅ Deno
- ✅ Vercel Edge Functions

## Troubleshooting

### "429 Too Many Requests"
**Problem**: Rate limits on public RPC
**Solution**: Use a custom RPC endpoint

### "Transaction simulation failed"
**Problem**: Insufficient SOL or network congestion
**Solution**: Ensure sufficient balance, retry, or use better RPC

### "Payment verification failed"
**Problem**: Transaction not confirmed yet
**Solution**: Wait and retry, or use faster RPC

### "Payment validation failed"
**Problem**: RPC URL not set or insufficient balance
**Solution**: Configure RPC URL, verify wallet balance

### "Wallet not connected"
**Problem**: Payment attempted without connected wallet
**Solution**: Verify wallet is connected before calling makeRequest

### POST/PUT requests not working
**Problem**: Options parameter incorrectly placed
**Solution**: Pass options as third parameter: `makeRequest(url, wallet, { method: 'POST', body: '...' })`

## Decentralized API Network

SPL402 is building toward a fully decentralized P2P API network:

### Current Architecture

```
AI Agent / Client
       ↓
SPL402-enabled API Server
       ↓
Solana Blockchain (Payment + Attestation)
```

### Future Vision: P2P Mesh Network

```
[AI Agent + API Server] ←→ [AI Agent + API Server] ←→ [AI Agent + API Server]
         ↓                          ↓                          ↓
         └──────────────────────────┴──────────────────────────┘
                                    ↓
                         Solana Blockchain
                    (Settlement + Attestations)
```

**Key Features:**
- Self-verifying network through SAS attestations
- Open discovery via SPL402 Explorer
- No central authority or gatekeepers
- Censorship resistant
- Scalable P2P architecture
- Token-based economic incentives

**Current Status:**
- ✅ Phase 1: Payment protocol (live)
- ✅ Phase 2: SAS attestation integration (live)
- ✅ Phase 3: Server registration & verification (live)
- 🔄 Phase 4: P2P discovery protocol (in development)
- 📋 Phase 5: DAO governance (planned)

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT

## Links

**SPL402 Resources:**
- [Website](https://spl402.org)
- [GitHub Repository](https://github.com/astrohackerx/spl402)
- [NPM Package](https://www.npmjs.com/package/spl402)
- [Twitter/X](https://x.com/spl402)

**Documentation:**
- [Solana Docs](https://docs.solana.com)
- [HTTP 402 Status Code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402)
- [Security Policy](./SECURITY.md)

---

Built with ❤️ for the Solana ecosystem
