# Deployment Guide for SPL402 Autonomous Agent

## Quick Start

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment variables**:
Copy `.env.example` to `.env` and fill in:
```env
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_AGENT_PRIVATE_KEY=your_base58_private_key_here
```

3. **Generate Agent Wallet** (if needed):
```bash
solana-keygen new --outfile agent-wallet.json
```

4. **Fund the Agent**:
   - Send SOL for transaction fees
   - Send SPL402 tokens (DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump)

5. **Build**:
```bash
npm run build
```

## Deployment Options

### Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard

### Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

3. Add environment variables in Netlify dashboard

### AWS S3 + CloudFront

1. Build the app:
```bash
npm run build
```

2. Upload `dist/` folder to S3 bucket

3. Configure CloudFront distribution

4. Set environment variables using S3 bucket policy

### Custom Domain

After deployment, point your domain to the hosting provider:
- Vercel: Add custom domain in project settings
- Netlify: Add custom domain in site settings
- AWS: Configure Route 53

## Environment Variables

Required environment variables:
- `VITE_SOLANA_RPC_URL` - Solana RPC endpoint (e.g., Helius, QuickNode)
- `VITE_AGENT_PRIVATE_KEY` - Agent's wallet private key (Base58 encoded)

## Security

- **NEVER** commit `.env` file to git
- **NEVER** expose private keys publicly
- Store private keys securely (use secrets management)
- Use environment variables in production

## Monitoring

Monitor your agent:
- Check wallet balance regularly
- Monitor transaction history on Solscan
- Set up alerts for low balance

## Support

- [SPL402 Documentation](https://spl402.org/docs)
- [GitHub Issues](https://github.com/astrohackerx/spl402/issues)
- [Twitter: @spl402](https://twitter.com/spl402)
