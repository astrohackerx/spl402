# SPL-402 Complete Setup Guide

This guide shows you exactly how to set up both SOL transfers and token transfers for both server and client.

## Table of Contents
- [Server Setup](#server-setup)
  - [SOL Transfer Scheme](#sol-transfer-scheme-server)
  - [Token Transfer Scheme](#token-transfer-scheme-server)
- [Client Setup](#client-setup)
  - [SOL Transfer Scheme](#sol-transfer-scheme-client)
  - [Token Transfer Scheme](#token-transfer-scheme-client)
- [What You Need to Add Manually](#what-you-need-to-add-manually)
- [Complete Working Examples](#complete-working-examples)

---

## Server Setup

### SOL Transfer Scheme (Server)

**1. Install Dependencies**
```bash
npm install spl402 @solana/web3.js express
```

**2. Create Server**

```typescript
import { createServer, createExpressMiddleware } from 'spl402';
import express from 'express';

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_WALLET_ADDRESS',  // ← Your Solana wallet
  rpcUrl: process.env.SOLANA_RPC_URL,       // ← Custom RPC (required!)
  scheme: 'transfer',                        // ← SOL transfers (default)
  serverInfo: {
    name: 'My API Server',
    description: 'Premium data API',
    contact: 'https://myapi.com'
  },
  routes: [
    { path: '/api/premium', price: 0.001, method: 'GET' },  // 0.001 SOL
    { path: '/api/data', price: 0.0005, method: 'GET' },    // 0.0005 SOL
  ],
});

const app = express();
app.use(createExpressMiddleware(spl402));

// Your protected routes
app.get('/api/premium', (req, res) => {
  res.json({ message: 'Premium content!', data: {...} });
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'Data content!', data: {...} });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**What's automatically handled:**
- ✅ Payment verification
- ✅ Replay attack prevention
- ✅ Standard routes: `/health`, `/status`, `/.well-known/spl402.json`


---

### Token Transfer Scheme (Server)

**1. Install Dependencies**
```bash
npm install spl402 @solana/web3.js @solana/spl-token express
```

**2. Create Server**

```typescript
import { createServer, createExpressMiddleware } from 'spl402';
import express from 'express';

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_WALLET_ADDRESS',  // ← Your Solana wallet
  rpcUrl: process.env.SOLANA_RPC_URL,       // ← Custom RPC (required!)
  scheme: 'token-transfer',                  // ← Token transfers
  mint: 'DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump',  // ← Token mint
  decimals: 6,                               // ← Token decimals
  serverInfo: {
    name: 'My Token API Server',
    description: 'Premium API accepting SPL402 tokens',
    contact: 'https://myapi.com'
  },
  routes: [
    { path: '/api/premium', price: 10, method: 'GET' },   // 10 SPL402 tokens
    { path: '/api/data', price: 5, method: 'GET' },       // 5 SPL402 tokens
  ],
});

const app = express();
app.use(createExpressMiddleware(spl402));

// Your protected routes
app.get('/api/premium', (req, res) => {
  res.json({ message: 'Premium content!', data: {...} });
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'Data content!', data: {...} });
});

app.listen(3000, () => {
  console.log('Token API server running on port 3000');
});
```

**Common Token Configurations:**

| Token | Decimals | Mint Address |
|-------|----------|-------------|
| SPL402 | 6 | `DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump` |
| USDC | 6 | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |
| USDT | 6 | `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB` |

**What's automatically handled:**
- ✅ Token transfer verification
- ✅ Decimal conversion (UI amount ↔ raw amount)
- ✅ Mint address validation
- ✅ Replay attack prevention
- ✅ Standard routes


---

## Client Setup

### SOL Transfer Scheme (Client)

#### React/Next.js Setup

**1. Install Dependencies**
```bash
npm install spl402 @solana/web3.js @solana/spl-token bs58 \
  @solana/wallet-adapter-react @solana/wallet-adapter-react-ui \
  @solana/wallet-adapter-wallets
```

**2. Setup Wallet Provider (App-level)**

```tsx
// app/providers.tsx or pages/_app.tsx
import { useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

export function Providers({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() =>
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network),
    [network]
  );

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

**3. Use in Your Component**

```tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useSPL402 } from 'spl402';

export function PremiumContent() {
  const { publicKey, signAndSendTransaction } = useWallet();

  const { makeRequest, loading, error } = useSPL402({
    network: 'mainnet-beta',
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
    // No scheme specified = SOL transfers (default)
  });

  const fetchPremiumData = async () => {
    if (!publicKey || !signAndSendTransaction) {
      alert('Please connect your wallet');
      return;
    }

    try {
      const response = await makeRequest(
        'https://api.example.com/api/premium',
        { publicKey, signAndSendTransaction }
      );
      const data = await response.json();
      console.log('Premium data:', data);
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  return (
    <div>
      <WalletMultiButton />
      <button onClick={fetchPremiumData} disabled={loading || !publicKey}>
        {loading ? 'Processing...' : 'Get Premium Data (0.001 SOL)'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

**What's automatically handled:**
- ✅ 402 response detection
- ✅ Payment creation and signing
- ✅ Transaction submission
- ✅ Request retry with payment proof

**What you need to manually add:**
- ✅ Wallet adapter setup (one-time, app-level)
- ✅ Wallet connection UI
- ✅ Error handling

---

### Token Transfer Scheme (Client)

#### React/Next.js Setup

**Same wallet provider setup as above**, then:

```tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useSPL402 } from 'spl402';

export function TokenPremiumContent() {
  const { publicKey, signAndSendTransaction } = useWallet();

  const { makeRequest, loading, error } = useSPL402({
    network: 'mainnet-beta',
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
    scheme: 'token-transfer',                               // ← Token transfers
    mint: 'DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump',  // ← Token mint
    decimals: 6,                                            // ← Token decimals
  });

  const fetchPremiumData = async () => {
    if (!publicKey || !signAndSendTransaction) {
      alert('Please connect your wallet');
      return;
    }

    try {
      const response = await makeRequest(
        'https://api.example.com/api/premium',
        { publicKey, signAndSendTransaction }
      );
      const data = await response.json();
      console.log('Premium data:', data);
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  return (
    <div>
      <WalletMultiButton />
      <button onClick={fetchPremiumData} disabled={loading || !publicKey}>
        {loading ? 'Processing...' : 'Get Premium Data (10 SPL402)'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

**What's automatically handled:**
- ✅ Token transfer creation
- ✅ ATA (Associated Token Account) creation if needed
- ✅ Decimal conversion (10 tokens → 10,000,000 raw amount)
- ✅ Payment verification with correct scheme

**What you need to manually add:**
- ✅ Token configuration: `scheme`, `mint`, `decimals`
- ✅ Same wallet adapter setup as SOL transfers

---

## What You Need to Add Manually

### Server Side

| Feature | SOL Transfer | Token Transfer |
|---------|--------------|----------------|
| Dependencies | `spl402`, `@solana/web3.js`, `express` | Same + `@solana/spl-token` |
| Server config | `recipientAddress`, `routes`, `rpcUrl` | Same + `scheme`, `mint`, `decimals` |
| Route handlers | Your API logic | Your API logic |
| Custom RPC | **REQUIRED** | **REQUIRED** |
| Payment verification | ✅ Automatic | ✅ Automatic |
| Standard routes | ✅ Automatic | ✅ Automatic |

**Critical: Custom RPC Setup**

You MUST use a custom RPC endpoint. Public RPC has rate limits that will cause issues.

Get a free RPC from:
- **Helius** (recommended): https://www.helius.dev
- **QuickNode**: https://www.quicknode.com
- **Alchemy**: https://www.alchemy.com

```env
# .env
SOLANA_RPC_URL=https://your-custom-rpc-endpoint.com
```

### Client Side

| Feature | SOL Transfer | Token Transfer |
|---------|--------------|----------------|
| Dependencies | `spl402`, `@solana/web3.js`, wallet adapters | Same |
| Wallet provider setup | ✅ Required (one-time) | ✅ Required (one-time) |
| Wallet connection UI | ✅ Required | ✅ Required |
| Hook configuration | `network`, `rpcUrl` | Same + `scheme`, `mint`, `decimals` |
| Error handling | ✅ Recommended | ✅ Recommended |
| Payment flow | ✅ Automatic | ✅ Automatic |

**Wallet Adapter Setup:**
- Must be done once at app level
- Wrap your app in `ConnectionProvider` → `WalletProvider` → `WalletModalProvider`
- Import wallet adapter CSS styles
- Use `WalletMultiButton` component for connection UI

---

## Complete Working Examples

### SOL Transfer - Full Stack Example

**Server (server.ts):**
```typescript
import { createServer, createExpressMiddleware } from 'spl402';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: process.env.WALLET_ADDRESS!,
  rpcUrl: process.env.SOLANA_RPC_URL!,
  routes: [
    { path: '/api/premium', price: 0.001, method: 'GET' },
  ],
});

const app = express();
app.use(express.json());
app.use(createExpressMiddleware(spl402));

app.get('/api/premium', (req, res) => {
  res.json({
    message: 'Premium content!',
    data: { value: 'secret data' }
  });
});

app.listen(3000, () => console.log('Server running on :3000'));
```

**Client (PremiumContent.tsx):**
```tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useSPL402 } from 'spl402';
import { useState } from 'react';

export function PremiumContent() {
  const wallet = useWallet();
  const [data, setData] = useState<any>(null);

  const { makeRequest, loading, error } = useSPL402({
    network: 'mainnet-beta',
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL!,
  });

  const handleFetch = async () => {
    if (!wallet.publicKey || !wallet.signAndSendTransaction) return;

    try {
      const response = await makeRequest('/api/premium', wallet);
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  return (
    <div className="p-4">
      <WalletMultiButton />
      <button
        onClick={handleFetch}
        disabled={loading || !wallet.publicKey}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? 'Processing...' : 'Fetch Premium (0.001 SOL)'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

**Environment Variables:**
```env
# Server .env
WALLET_ADDRESS=YourSolanaWalletAddressHere
SOLANA_RPC_URL=https://your-helius-rpc-endpoint.com

# Client .env.local
NEXT_PUBLIC_SOLANA_RPC_URL=https://your-helius-rpc-endpoint.com
```

---

### Token Transfer - Full Stack Example

**Server (token-server.ts):**
```typescript
import { createServer, createExpressMiddleware } from 'spl402';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: process.env.WALLET_ADDRESS!,
  rpcUrl: process.env.SOLANA_RPC_URL!,
  scheme: 'token-transfer',
  mint: 'DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump',
  decimals: 6,
  routes: [
    { path: '/api/premium', price: 10, method: 'GET' },  // 10 SPL402 tokens
  ],
});

const app = express();
app.use(express.json());
app.use(createExpressMiddleware(spl402));

app.get('/api/premium', (req, res) => {
  res.json({
    message: 'Premium token-gated content!',
    data: { value: 'secret data' }
  });
});

app.listen(3000, () => console.log('Token server running on :3000'));
```

**Client (TokenPremiumContent.tsx):**
```tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useSPL402 } from 'spl402';
import { useState } from 'react';

export function TokenPremiumContent() {
  const wallet = useWallet();
  const [data, setData] = useState<any>(null);

  const { makeRequest, loading, error } = useSPL402({
    network: 'mainnet-beta',
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL!,
    scheme: 'token-transfer',
    mint: 'DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump',
    decimals: 6,
  });

  const handleFetch = async () => {
    if (!wallet.publicKey || !wallet.signAndSendTransaction) return;

    try {
      const response = await makeRequest('/api/premium', wallet);
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  return (
    <div className="p-4">
      <WalletMultiButton />
      <button
        onClick={handleFetch}
        disabled={loading || !wallet.publicKey}
        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded"
      >
        {loading ? 'Processing...' : 'Fetch Premium (10 SPL402)'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

**Same environment variables as SOL example**

---

## Key Differences Summary

| Aspect | SOL Transfer | Token Transfer |
|--------|--------------|----------------|
| Server `scheme` | `'transfer'` (default) | `'token-transfer'` |
| Server `mint` | Not needed | Required |
| Server `decimals` | Not needed | Required |
| Client config | Just `network`, `rpcUrl` | Add `scheme`, `mint`, `decimals` |
| Price units | SOL (e.g., 0.001) | Tokens (e.g., 10) |
| ATA creation | Not needed | Automatic if missing |
| Dependencies | Standard | Add `@solana/spl-token` |

Both schemes work identically otherwise - same payment flow, same verification, same security.
