# SPL-402 SDK Examples

Professional TypeScript/React examples for real Solana developers.

## Quick Start

### 1. Verify Server Attestation

Check if an API server is verified on-chain:

```typescript
import { checkAttestationByEndpoint } from 'spl402';

const result = await checkAttestationByEndpoint(
  'https://api.example.com',
  'mainnet-beta'
);

if (result.isVerified) {
  console.log('✅ Server verified!');
  console.log('Wallet:', result.data?.wallet);
} else {
  console.log('❌ Not verified');
}
```

### 2. Discover All Servers

Find all verified SPL402 servers:

```typescript
import { queryVerifiedServers } from 'spl402';

const servers = await queryVerifiedServers('mainnet-beta');

servers.forEach(server => {
  console.log(server.endpoint, '-', server.description);
});
```

### 3. Make Paid Request

Use the `useSPL402` hook with Solana Wallet Adapter:

```tsx
import { useWallet } from '@solana/wallet-adapter-react';
import { useSPL402 } from 'spl402';

function MyComponent() {
  const { publicKey, signAndSendTransaction } = useWallet();

  const { makeRequest, loading, error } = useSPL402({
    network: 'mainnet-beta',
    rpcUrl: process.env.REACT_APP_SOLANA_RPC_URL,
  });

  const handlePaidRequest = async () => {
    const response = await makeRequest('/api/premium', {
      publicKey,
      signAndSendTransaction,
    });
    const data = await response.json();
  };

  return (
    <button onClick={handlePaidRequest} disabled={loading}>
      Get Premium Content
    </button>
  );
}
```

### 4. Vanilla TypeScript

No framework? No problem:

```typescript
import { createClient } from 'spl402';

const client = createClient({
  network: 'mainnet-beta',
  rpcUrl: process.env.SOLANA_RPC_URL,
});

const wallet = window.phantom?.solana;
await wallet.connect();

const response = await client.makeRequest('/api/premium', wallet);
const data = await response.json();
```

## Installation

```bash
npm install spl402 @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-react-ui
```

## Examples

### Payment Examples

#### React Component (`react-example.tsx`)

Full React component with:
- Wallet connection handling
- Loading states
- Error handling
- Success callbacks

**Use case:** React apps (CRA, Vite)

#### Vanilla TypeScript (`vanilla-ts.ts`)

Pure TypeScript with Phantom wallet:
- Direct wallet integration
- No framework dependencies
- Browser-ready

**Use case:** Vanilla JS/TS projects, simple integrations

#### Next.js App Router (`nextjs-app.tsx`)

Modern Next.js 14+ example:
- App Router compatible
- Tailwind CSS styled
- Full payment flow UI

**Use case:** Next.js applications

#### Express Server (`basic-server.js`)

Backend API server:
- Multiple protected routes
- Price tiers
- Payment verification

**Use case:** Node.js backend

#### Token Payments (`token-server.js`)

Accept SPL tokens (USDC, etc.):
- Token-based pricing
- Same verification flow

**Use case:** Stablecoin payments

#### Token-Gated Access (`tokengate-server.js`)

Restrict routes to token holders:
- Token balance verification on-chain
- Free access for token holders
- Hybrid routes (free for holders, paid for others)
- Token2022 support

**Use case:** DAO member areas, holder-only content, tiered access

#### Edge Functions (`fetch-handler.js`)

Serverless/edge compatible:
- Cloudflare Workers
- Vercel Edge
- Deno Deploy

**Use case:** Edge runtimes

### SAS Attestation Examples

#### Server Verification (`verify-server.js`)

Verify server attestations before payment:
- Check server wallet is verified on-chain
- Verify API endpoint has attestation
- Get server details (description, contact)

**Use case:** Client-side trust verification

#### Server Discovery (`discover-servers.js`)

Discover all verified SPL402 servers:
- Query all on-chain attestations
- Search servers by description
- Build server directory/marketplace

**Use case:** P2P network discovery, server listings

#### React Attestation UI (`react-attestation.tsx`)

React components for attestation UI:
- `ServerVerificationBadge` - Show verified status
- `ServerDiscoveryList` - Display all servers
- Loading/error states
- Tailwind CSS styled

**Use case:** React apps with attestation verification

#### Next.js Discovery Page (`nextjs-discovery.tsx`)

Full Next.js server discovery page:
- List all verified servers
- Search by wallet address
- Beautiful UI with Tailwind CSS
- Real-time verification

**Use case:** Next.js marketplace or directory

## Server Setup

```javascript
import { createServer, createExpressMiddleware } from 'spl402';
import express from 'express';

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: process.env.RECIPIENT_WALLET,
  rpcUrl: process.env.SOLANA_RPC_URL,
  routes: [
    { path: '/api/premium', price: 0.001 },
    { path: '/api/data', price: 0.0005 },
  ],
});

const app = express();
app.use(createExpressMiddleware(spl402));

app.get('/api/premium', (req, res) => {
  res.json({ message: 'Premium content' });
});

app.listen(3000);
```

## Environment Variables

Create `.env`:

```bash
# Required: Custom RPC endpoint (get from Helius, QuickNode, or Alchemy)
SOLANA_RPC_URL=https://your-rpc-endpoint.com

# For server
RECIPIENT_WALLET=YourSolanaWalletAddress

# For React apps
REACT_APP_SOLANA_RPC_URL=https://your-rpc-endpoint.com

# For Next.js
NEXT_PUBLIC_SOLANA_RPC_URL=https://your-rpc-endpoint.com
```

## RPC Providers (Required)

**Don't use public RPC endpoints in production!**

Get a free RPC endpoint:
1. **Helius** (recommended): https://www.helius.dev - 100 req/s free
2. **QuickNode**: https://www.quicknode.com - 30M credits/month
3. **Alchemy**: https://www.alchemy.com - Free tier available

## Testing

### Run Server

```bash
cd examples
node basic-server.js
```

### Test with React

```bash
npm install
npm run dev
# Visit http://localhost:3000
```

### Test with Next.js

```bash
npx create-next-app my-app
cd my-app
npm install spl402 @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-react-ui
# Copy nextjs-app.tsx to app/page.tsx
npm run dev
```

## TypeScript Support

Full TypeScript support out of the box:

```typescript
import type { WalletAdapter, SPL402Config } from 'spl402';

const config: SPL402Config = {
  network: 'mainnet-beta',
  rpcUrl: process.env.SOLANA_RPC_URL!,
};
```

## Wallet Adapters

Works with any Solana wallet:
- ✅ Phantom
- ✅ Solflare
- ✅ Backpack
- ✅ Glow
- ✅ Any wallet implementing `publicKey` and `signAndSendTransaction`

## Error Handling

```typescript
const { makeRequest, error } = useSPL402({ ... });

try {
  await makeRequest('/api/premium', wallet);
} catch (err) {
  if (err.message.includes('Wallet not connected')) {
    // Handle wallet not connected
  } else if (err.message.includes('Payment verification failed')) {
    // Handle payment failure
  }
}
```

## Best Practices

1. **Always use custom RPC** - Public endpoints are rate-limited
2. **Handle wallet states** - Check connection before requests
3. **Show loading indicators** - Payments take ~500ms-2s
4. **Implement retries** - Network can be congested
5. **Test on devnet first** - Use devnet before mainnet

## Production Checklist

- [ ] Custom RPC endpoint configured
- [ ] Environment variables set
- [ ] Error boundaries implemented
- [ ] Loading states handled
- [ ] Wallet connection flow tested
- [ ] Payment amounts verified
- [ ] HTTPS enabled
- [ ] Rate limiting on server

## Support

- GitHub Issues: [github.com/yourusername/spl402/issues](https://github.com/yourusername/spl402/issues)
- Documentation: [github.com/yourusername/spl402](https://github.com/yourusername/spl402)

## License

MIT
