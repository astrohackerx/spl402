# SPL-402 Production Template

Full-stack production template demonstrating SPL-402 protocol on Solana mainnet.

## Structure

```
template/
├── server/          # Express.js backend
│   ├── index.js     # Main server with SPL-402 middleware
│   ├── package.json
│   └── .env.example
├── client/          # React frontend
│   ├── src/
│   │   ├── App.jsx  # Main app with wallet integration
│   │   ├── main.jsx # Wallet providers setup
│   │   └── index.css
│   ├── package.json
│   └── .env.example
├── SETUP.md         # Detailed setup instructions
└── README.md        # This file
```

## Features

### Backend
- ✅ Express.js server with SPL-402 middleware
- ✅ 4 demo endpoints (free, premium, ultra-premium, enterprise)
- ✅ Mainnet-ready configuration
- ✅ CORS enabled
- ✅ Production-ready error handling

### Frontend
- ✅ React + Vite
- ✅ Solana Wallet Adapter integration
- ✅ spl402 React hooks
- ✅ Beautiful UI with Tailwind CSS
- ✅ Real-time payment processing
- ✅ Error handling & loading states

## Quick Start

### Server (Local Testing)

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your wallet address
npm start
```

### Client (Local Testing)

```bash
cd client
npm install
cp .env.example .env
# Edit .env with your server URL
npm run dev
```

## Production Deployment

See [SETUP.md](./SETUP.md) for complete production deployment instructions including:
- VPS setup with HTTPS
- Nginx configuration
- SSL with Let's Encrypt
- Vercel frontend deployment
- PM2 process management

## Environment Variables

### Server
```env
PORT=3001
RECIPIENT_WALLET=your_solana_wallet
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
FRONTEND_URL=https://your-frontend.vercel.app
```

### Client
```env
VITE_API_URL=https://api.spl402.org
```

## API Endpoints

| Endpoint | Price | Description |
|----------|-------|-------------|
| `/api/free-data` | Free | Public data |
| `/api/premium-data` | 0.001 SOL | Premium analytics |
| `/api/ultra-premium` | 0.005 SOL | Ultra premium features |
| `/api/enterprise-data` | 0.01 SOL | Enterprise tier |

## Tech Stack

**Backend:**
- Express.js
- spl402 (npm package)
- @solana/web3.js
- CORS

**Frontend:**
- React 18
- Vite
- spl402 (npm package)
- @solana/wallet-adapter-react
- Tailwind CSS
- Lucide React (icons)

## License

MIT
