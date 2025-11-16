# spl402

**SPL-402: Solana Payment Layer 402** - HTTP-native payments for Solana blockchain

A lightweight, zero-dependency implementation of HTTP 402 Payment Required for Solana. Accept direct wallet-to-wallet payments on your API endpoints with no middlemen, platforms, or facilitators.

Now with **Solana Attestation Service (SAS)** integration for on-chain server identity verification and decentralized API discovery.

## Table of Contents

- [What is SPL-402?](#what-is-spl-402)
- [Why SPL-402 vs x402?](#why-spl-402-vs-x402)
- [What's New in v2.0.1](#whats-new-in-v201)
- [How It Works](#how-it-works)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Standard Routes (v2.0.1)](#standard-routes-v201)
- [Important: RPC Configuration](#important-rpc-configuration)
- [Solana Attestation Service (SAS) Integration](#solana-attestation-service-sas-integration)
- [API Reference](#api-reference)
- [Configuration Examples](#configuration-examples)
- [Examples](#examples)
- [Features](#features)
- [Testing](#testing)
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
- **Lightning fast**: 2-3x faster than alternative solutions (500-1000ms vs ~2000-2500ms)
- **On-chain verification**: SAS attestations prove server identity and ownership
- **Decentralized registry**: Join the growing network of verified API servers

Think of it as "pay-per-request" for your APIs, without payment processors, subscriptions, or API key management.

> **SPL402 Token**: Use the native SPL402 token for payments!
>
> Mint Address: `DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump`
>
> [View on Solana Explorer](https://solscan.io/token/DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump)

## Why SPL-402 vs x402?

| Feature | SPL-402 | x402 |
|---------|---------|------|
| **Latency** | ~500-1000ms | ~2000-2500ms |
| **Platform Fees** | 0% (only network fees) | Variable fees |
| **Dependencies** | 0 (peer deps only) | Multiple libraries |
| **Transaction Cost** | ~$0.00001 | Higher |
| **Speed** | 2-3x faster | Baseline |
| **Middleman** | None (direct P2P) | Yes (facilitator) |
| **API Keys** | Not required | Required |
| **Setup Time** | < 5 minutes | Longer |
| **Open Source** | ✅ MIT License | ⚠️ Varies |

**Why is SPL-402 faster?**

1. **No facilitator**: Payments go directly from payer to recipient - no third-party processing
2. **Optimized verification**: Balanced mode checks signature status first (~150ms), then validates amount
3. **Smart caching**: In-memory replay attack prevention - no database queries needed
4. **Pure Solana**: Zero external dependencies, leverages native Solana RPC primitives
5. **Efficient protocol**: Minimal overhead - just standard HTTP + Solana transaction verification

## What's New in v2.0.1

### 🎉 Standard Routes Implementation

**Every SPL-402 server now automatically includes these public endpoints:**

- **`GET /health`** - Health check endpoint (returns `{ status: "ok", timestamp: ... }`)
- **`GET /status`** - Alias for `/health`
- **`GET /.well-known/spl402.json`** - Server metadata following RFC 8615 standard

These routes are:
- ✅ **Auto-registered** - No configuration needed
- ✅ **Free to access** - No payment required
- ✅ **Production ready** - Used by SPL-402 Explorer for status checks

### 📊 Server Metadata Configuration

Add optional metadata to your server:

```typescript
const server = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_WALLET',
  serverInfo: {                    // NEW in v2.0.1!
    name: 'My API Server',
    description: 'Premium data API with SPL-402 payments',
    contact: 'https://myapi.com',
    capabilities: ['data-api', 'ai-inference']
  },
  routes: [
    { path: '/api/premium', price: 0.001 }
  ]
});
```

### 🔧 New Server Methods

- `getServerMetadata()` - Returns complete server metadata
- `createHealthResponse()` - Generates health check response
- `createMetadataResponse()` - Generates metadata response

### 🔄 100% Backwards Compatible

All v2.0.0 code works without changes! The `serverInfo` field is optional, and standard routes are added automatically.

**[View full release notes →](../tests/RELEASE_NOTES_2.0.1.md)**

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

**Basic installation:**
```bash
npm install spl402 @solana/web3.js @solana/spl-token bs58
```

**For React/Next.js apps:**
```bash
npm install spl402 @solana/web3.js @solana/spl-token bs58 @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets
```

**Using Yarn:**
```bash
yarn add spl402 @solana/web3.js @solana/spl-token bs58
```

**Peer dependencies:**
- `@solana/web3.js` (^1.95.0) - Core Solana blockchain interaction
- `@solana/spl-token` (^0.4.0) - SPL token transfer operations
- `bs58` (^6.0.0) - Base58 encoding/decoding for signatures
- `react` (^18.0.0) - Optional, only required for React hooks (`useSPL402`)

## Quick Start

### Server Setup (Express)

```typescript
import { createServer, createExpressMiddleware } from 'spl402';
import express from 'express';

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_WALLET_ADDRESS', // Your Solana wallet
  rpcUrl: process.env.SOLANA_RPC_URL,      // CRITICAL: Use custom RPC endpoint!
  serverInfo: {                             // Optional (v2.0.1+)
    name: 'My API Server',
    description: 'Premium data API',
    contact: 'https://myapi.com',
    capabilities: ['data-api']
  },
  routes: [
    { path: '/api/premium', price: 0.001, method: 'GET' },  // 0.001 SOL
    { path: '/api/data', price: 0.0005, method: 'GET' },    // 0.0005 SOL
  ],
});

const app = express();
app.use(createExpressMiddleware(spl402));

// Standard routes are auto-registered:
// GET /health          → 200 OK (free)
// GET /status          → 200 OK (free)
// GET /.well-known/spl402.json → metadata (free)

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
  serverInfo: {                        // Optional (v2.0.1+)
    name: 'Edge API Server',
    description: 'Serverless API with SPL-402',
    contact: 'https://myapi.com'
  },
  routes: [{ path: '/api/data', price: 0.001 }],
});

const middleware = createFetchMiddleware(spl402);

// Standard routes are handled automatically by middleware:
// GET /health          → 200 OK (free)
// GET /status          → 200 OK (free)
// GET /.well-known/spl402.json → metadata (free)

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

Choose one of these providers (all offer free tiers):

1. **Helius** (strongly recommended): https://www.helius.dev
   - Free tier: 100 requests/second
   - Best performance for production
   - Excellent Solana optimization
   - Generous limits

2. **QuickNode**: https://www.quicknode.com
   - Free tier: 30M credits/month
   - High reliability
   - Global infrastructure

3. **Alchemy**: https://www.alchemy.com
   - Free tier: 300M compute units/month
   - Multi-chain support
   - Good developer tools

4. **Triton (RPC Pool)**: https://rpcpool.com
   - Free tier available
   - Solana-native provider

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

## Standard Routes (v2.0.1)

### Overview

Every SPL-402 server automatically exposes these standard endpoints:

#### `GET /health`
Health check endpoint for monitoring and uptime verification.

**Response:**
```json
{
  "status": "ok",
  "timestamp": 1763322021055
}
```

**Use Cases:**
- Load balancer health checks
- Monitoring tools (Uptime Robot, Pingdom, etc.)
- Status dashboards
- Automated alerting systems

#### `GET /status`
Alias for `/health` endpoint. Returns identical response.

#### `GET /.well-known/spl402.json`
Server metadata endpoint following RFC 8615 (Well-Known URIs).

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
    },
    {
      "path": "/api/data",
      "method": "GET",
      "price": 0.0005
    }
  ],
  "capabilities": ["data-api", "premium-content"]
}
```

**Use Cases:**
- API discovery and documentation
- Automatic pricing display in explorers
- Client capability negotiation
- P2P network node discovery (Phase 4)

### Standard Routes Configuration

Standard routes are **automatically registered** and require **no payment**. They don't interfere with your custom routes.

```typescript
const server = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_WALLET',
  serverInfo: {                // Optional metadata
    name: 'My API Server',
    description: 'API description',
    contact: 'https://myapi.com',
    capabilities: ['data-api', 'ai-inference']
  },
  routes: [
    { path: '/api/data', price: 0.001 }
  ]
});

// These routes are automatically available:
// GET /health
// GET /status
// GET /.well-known/spl402.json
```

### Accessing Standard Routes

**In Express:**
```typescript
const app = express();
app.use(createExpressMiddleware(spl402));
// /health, /status, /.well-known/spl402.json are automatically handled
```

**In Fetch/Edge:**
```typescript
const middleware = createFetchMiddleware(spl402);
// Middleware automatically handles standard routes
```

**Testing:**
```bash
# Health check
curl http://localhost:3000/health

# Server metadata
curl http://localhost:3000/.well-known/spl402.json
```

### New Server Methods (v2.0.1)

#### `getServerMetadata()`
Returns the complete server metadata object.

```typescript
const metadata = server.getServerMetadata();
console.log(metadata);
```

#### `createHealthResponse()`
Generates a standardized health check response.

```typescript
const healthResponse = server.createHealthResponse();
// Returns: { status: 200, headers: {...}, body: {...} }
```

#### `createMetadataResponse()`
Generates a standardized metadata response.

```typescript
const metadataResponse = server.createMetadataResponse();
// Returns: { status: 200, headers: {...}, body: {...} }
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
  decimals?: number,               // Required if scheme is 'token-transfer'
  rpcUrl?: string,                 // Custom RPC endpoint (HIGHLY RECOMMENDED)
  serverInfo?: {                   // Optional (v2.0.1+)
    name?: string,                 // Display name for your server
    description?: string,          // Server description
    contact?: string,              // Contact URL or email
    capabilities?: string[]        // Server capabilities/features
  }
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

#### Payment Verification

SPL-402 uses an optimized verification approach (~150-200ms):
- Fast signature existence check using `getSignatureStatuses`
- Verifies transaction didn't fail or get dropped
- Validates exact amount transferred matches expected price
- Confirms recipient wallet received payment
- Built-in replay attack prevention

#### `verifyPayment(request: VerifyPaymentRequest)`

Verifies payment against Solana blockchain (uses RPC).

#### `verifyPaymentLocal(payment: SPL402PaymentPayload, signature: string)`

Verifies payment signature locally (no RPC call).

## Examples

Check the [`examples/`](./examples) directory for production-ready code:

**Client Examples:**
- **[react-example.tsx](./examples/react-example.tsx)** - React component with `useSPL402` hook
- **[nextjs-app.tsx](./examples/nextjs-app.tsx)** - Next.js App Router integration
- **[vanilla-ts.ts](./examples/vanilla-ts.ts)** - Vanilla TypeScript with Phantom wallet

**Server Examples:**
- **[basic-server.js](./examples/basic-server.js)** - Express server with SOL payments
- **[token-server.js](./examples/token-server.js)** - Accept SPL tokens (SPL402, USDC, etc.)
- **[fetch-handler.js](./examples/fetch-handler.js)** - Edge runtime compatible handler

**Complete Setup Guide:**
See [examples/README.md](./examples/README.md) for detailed setup instructions, environment configuration, and implementation patterns.

## Solana Attestation Service (SAS) Integration

SPL402 2.0 introduces support for on-chain server attestations. Server operators can create verifiable attestations on Solana blockchain that prove they control the wallet receiving payments.

### What is SAS?

Solana Attestation Service provides cryptographic proof of server identity and ownership stored on-chain:

- **Server wallet address** - Proves operator controls the payment recipient
- **API endpoint URL** - Links the on-chain identity to the API server
- **Immutable timestamp** - Permanent record on Solana blockchain
- **Public verification** - Anyone can verify attestations on-chain

### Why Use Attestations?

**Benefits:**
- **Trust**: Clients verify the API server owns the payment wallet
- **Transparency**: All attestations are publicly auditable on Solana
- **Decentralization**: Enables discovery of verified API servers
- **Censorship Resistance**: No central authority controls registration

### Client-Side Verification

The SDK provides functions to verify server attestations on-chain:

**1. Query All Verified Servers**

```typescript
import { queryVerifiedServers } from 'spl402';

// Get all verified SPL402 servers
const servers = await queryVerifiedServers('mainnet-beta');

servers.forEach(server => {
  console.log('Wallet:', server.wallet);
  console.log('Endpoint:', server.endpoint);
  console.log('Description:', server.description);
  console.log('Attestation PDA:', server.attestationPda);
});
```

**2. Check Server by Wallet Address**

```typescript
import { checkAttestationByWallet } from 'spl402';

const result = await checkAttestationByWallet(
  'SERVER_WALLET_ADDRESS',
  'mainnet-beta'
);

if (result.isVerified) {
  console.log('✅ Server verified!');
  console.log('API Endpoint:', result.data?.endpoint);
  console.log('Attestation:', result.attestationPda);
} else {
  console.log('❌ Not verified:', result.error);
}
```

**3. Check Server by API Endpoint**

```typescript
import { checkAttestationByEndpoint } from 'spl402';

const result = await checkAttestationByEndpoint(
  'https://api.example.com',
  'mainnet-beta'
);

if (result.isVerified) {
  console.log('✅ API server verified!');
  console.log('Wallet:', result.data?.wallet);
} else {
  console.log('❌ Not verified:', result.error);
}
```

**4. Get Attestation by PDA**

```typescript
import { getAttestationByPda } from 'spl402';

const result = await getAttestationByPda(
  'ATTESTATION_PDA_ADDRESS',
  'mainnet-beta'
);

if (result.isVerified) {
  console.log('Server Data:', result.data);
}
```

### Types

```typescript
interface VerifiedServer {
  wallet: string;
  endpoint: string;
  description: string;
  contact: string;
  attestationPda: string;
}

interface AttestationCheckResult {
  isVerified: boolean;
  attestationPda?: string;
  data?: VerifiedServer;
  error?: string;
}
```

### Server Registration

For information about registering your API server and creating attestations, visit [spl402.org](https://spl402.org)

## Features

### ✅ Current Features

**Core Functionality:**
- ✅ Direct SOL transfers (native Solana payments)
- ✅ SPL token transfers (SPL402, USDC, USDT, custom tokens)
- ✅ Payment verification with replay attack prevention
- ✅ Cryptographic signature validation
- ✅ Multiple routes with individual pricing
- ✅ Two verification modes (strict & balanced)
- ✅ **On-chain attestation verification support**
- ✅ **Client-side server identity verification**

**Standard Routes (v2.0.1):**
- ✅ Automatic `/health` endpoint
- ✅ Automatic `/status` endpoint
- ✅ Automatic `/.well-known/spl402.json` metadata endpoint
- ✅ Server metadata configuration
- ✅ RFC 8615 compliance

**Integration:**
- ✅ React hooks (`useSPL402`)
- ✅ Express.js middleware
- ✅ Fetch-compatible middleware (Cloudflare Workers, Deno, Vercel Edge)
- ✅ Solana Wallet Adapter integration
- ✅ Custom RPC endpoint support

**Developer Experience:**
- ✅ Full TypeScript support with complete type definitions
- ✅ Zero dependencies (only peer dependencies)
- ✅ Comprehensive examples and documentation
- ✅ Works with all major Solana wallets
- ✅ 65 comprehensive tests (100% pass rate)

### 🔄 Roadmap

**Recently Shipped:**
- ✅ **v2.0.1**: Standard routes (`/health`, `/status`, `/.well-known/spl402.json`)
- ✅ **v2.0.1**: Server metadata configuration
- ✅ **v2.0.1**: Health check and metadata endpoints
- ✅ **v2.0**: Client-side attestation verification support
- ✅ **v2.0**: Documentation for on-chain server identity verification
- ✅ **v2.0**: Integration with decentralized API server discovery

**Coming Soon:**
- [ ] Payment session management (avoid repeated payments)
- [ ] Webhook notifications for payment events
- [ ] Built-in rate limiting helpers
- [ ] Analytics and metrics dashboard
- [ ] Payment receipt generation
- [ ] Subscription/recurring payment patterns
- [ ] Multi-currency support
- [ ] WebSocket payment streaming
- [ ] P2P decentralized API discovery network (Phase 4)

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

### SPL Token Payments (SPL402, USDC, USDT, etc.)

```typescript
const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_WALLET',
  rpcUrl: process.env.SOLANA_RPC_URL,
  scheme: 'token-transfer',
  mint: 'DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump', // SPL402 token mint
  decimals: 6, // SPL402 has 6 decimals
  routes: [
    { path: '/api/data', price: 10, method: 'GET' }, // 10 SPL402
  ],
});
```

**Common SPL Token Configuration:**

| Token | Decimals | Mint Address |
|-------|----------|-------------|
| SPL402 | 6 | `DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump` |
| USDC | 6 | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |
| USDT | 6 | `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB` |
| SOL | 9 | Native (use `transfer` scheme, not `token-transfer`) |

For other tokens, check decimals on [Solana Explorer](https://explorer.solana.com) or [Solscan](https://solscan.io).

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

**v2.0.1 Test Results:**
```
============================================================
Test Summary
============================================================
✅ Passed: 65
❌ Failed: 0
📊 Total:  65
============================================================
```

**Test Coverage:**
- ✅ Server creation and configuration
- ✅ Standard routes auto-registration (v2.0.1)
- ✅ Health check responses (v2.0.1)
- ✅ Metadata endpoint (v2.0.1)
- ✅ ServerInfo configuration (v2.0.1)
- ✅ Client instance creation
- ✅ Payment payload generation
- ✅ Cryptographic signature verification
- ✅ Express middleware functionality
- ✅ Fetch middleware functionality
- ✅ Route matching and pricing
- ✅ Error handling
- ✅ Backwards compatibility (v2.0.1)

**Development:**
```bash
npm run build  # Build TypeScript
npm run dev    # Watch mode for development
```

**Run Specific Tests:**
```bash
cd tests
npm run test:standard-routes  # Test v2.0.1 features
```

## Security Considerations

**Critical Security Rules:**

1. **Server-side verification only** - Never trust client-side payment claims; always verify on your server
2. **HTTPS required** - Always use HTTPS in production to prevent payment data interception
3. **Private key safety** - Never expose private keys in client code or frontend applications
4. **Amount validation** - Server must verify payment amounts match expected prices exactly
5. **Replay attack prevention** - SPL-402 includes built-in signature replay prevention via caching

**Best Practices:**

6. **Rate limiting** - Implement rate limiting to prevent abuse and excessive verification requests
7. **Transaction monitoring** - Monitor for unusual patterns (repeated failures, abnormal amounts)
8. **Custom RPC endpoints** - Use private RPC to avoid public rate limits and improve reliability
9. **Error handling** - Implement proper error handling to avoid leaking sensitive information
10. **Wallet validation** - Validate wallet addresses and permissions before processing payments

**What SPL-402 Handles Automatically:**
- ✅ Signature verification (cryptographic proof of payment)
- ✅ Amount verification (checks exact payment amount on-chain)
- ✅ Replay attack prevention (signature deduplication)
- ✅ Recipient verification (confirms payment went to correct wallet)
- ✅ Transaction confirmation status

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

## Decentralized API Network

SPL402 is building toward a fully decentralized, peer-to-peer API network:

### Current Architecture

```
AI Agent / Client
       ↓
SPL402-enabled API Server
       ↓
Solana Blockchain (Payment + Attestation Verification)
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
- **Self-Verifying Network**: Every node verifies peers through SAS attestations
- **Open Discovery**: Browse verified APIs via SPL402 Explorer
- **No Central Authority**: No gatekeepers, registries, or central control
- **Censorship Resistant**: Impossible to block or throttle individual servers
- **Scalable**: Network grows organically as nodes join
- **Economic Incentives**: Token-based payment flows between nodes

**Use Cases:**
- AI agents discovering and paying for API services
- Decentralized data marketplaces
- Cross-service micropayments
- Machine-to-machine economy
- Censorship-resistant API infrastructure

**Current Status:**
- ✅ Phase 1: Payment protocol (live)
- ✅ Phase 2: SAS attestation integration (live)
- ✅ Phase 3: Server registration & verification (live)
- 🔄 Phase 4: P2P discovery protocol (in development)
- 📋 Phase 5: DAO governance (planned)

## Contributing

Contributions welcome! Please check the issues or submit PRs.

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

---

Built with ❤️ for the Solana ecosystem
