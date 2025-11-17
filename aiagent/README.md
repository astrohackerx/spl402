# SPL402 Autonomous AI Agent

The first autonomous AI agent that can make its own decisions and pay for services using SPL402 tokens on Solana.

## Overview

This AI agent demonstrates the power of SPL402 by:
- Managing its own wallet and checking balances
- Scanning the network for verified LLM services
- Comparing prices and choosing the cheapest option
- Making on-chain payments autonomously
- Providing transparent, verifiable decision-making

## Features

- 💰 **Real-time Balance Tracking** - Shows SOL and SPL402 token balances with Solscan links
- 🧠 **Autonomous Decision Making** - Scans network, compares prices, and chooses best option
- 💬 **Chat Interface** - Ask anything and the agent will find and pay for LLM services
- 🔍 **Full Transparency** - Every step is shown with proof and blockchain links
- 😄 **Personality** - Fun, humorous agent with character

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_AGENT_PRIVATE_KEY=your_base58_private_key_here
```

3. Generate a wallet for your agent (or use existing):
```bash
solana-keygen new --outfile agent-wallet.json
# Then convert to base58 and add to .env
```

4. Fund the agent wallet with:
   - SOL (for transaction fees)
   - SPL402 tokens (for paying services)

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

The agent is a standalone app that can be deployed to any static hosting:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any web server

## How It Works

1. **User asks a question** → Agent displays "thinking" animation
2. **Check balance** → Verifies SOL + SPL402 balance
3. **Scan network** → Uses spl402 SDK to discover nodes on-chain
4. **Compare prices** → Sorts by price, chooses cheapest
5. **Make payment** → Uses spl402 SDK to pay and call API
6. **Display response** → Shows answer with transaction proof

## Security

- Agent private key is stored in `.env` (never commit to git)
- All transactions are signed client-side
- Full transparency - every action is logged
- Discovers services directly from blockchain using spl402

## Learn More

- [SPL402 Documentation](https://spl402.org/docs)
- [SPL402 GitHub](https://github.com/astrohackerx/spl402)
- [Solana Documentation](https://docs.solana.com)

## Credits

Built by [AstrohackerX](https://github.com/astrohackerx) using SPL402 protocol.
