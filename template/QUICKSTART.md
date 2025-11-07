# Quick Start Guide

Get the SPL-402 template running locally in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- A Solana wallet (Phantom or Solflare)
- Some SOL on mainnet for testing payments

## Step 1: Clone & Setup Server

```bash
cd template/server
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=3001
RECIPIENT_WALLET=YOUR_SOLANA_WALLET_ADDRESS_HERE
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
FRONTEND_URL=http://localhost:5173
```

**Important:** Replace `YOUR_SOLANA_WALLET_ADDRESS_HERE` with your actual Solana wallet address.

Start the server:
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════════════════╗
║  SPL-402 Server Template                               ║
╠════════════════════════════════════════════════════════╣
║  Status: Running                                       ║
║  Port: 3001                                            ║
...
```

## Step 2: Setup Frontend

Open a new terminal:

```bash
cd template/client
npm install
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:3001
```

Start the frontend:
```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

## Step 3: Test the Application

1. Open http://localhost:5173 in your browser

2. **Test Free Tier (no wallet needed):**
   - Click "Free Tier"
   - You should see the response instantly

3. **Test Premium Tier (requires payment):**
   - Click "Connect Wallet"
   - Connect your Phantom or Solflare wallet
   - Make sure you're on **Mainnet**
   - Click "Premium Tier" (costs 0.001 SOL)
   - Approve the transaction in your wallet
   - Wait ~1-2 seconds
   - You should see the premium data response

4. **Verify Payment:**
   - Check your wallet - you should see a transaction
   - Check the recipient wallet on Solana Explorer
   - You should see the incoming payment

## What's Happening?

When you click a premium tier:

1. **Frontend** creates a payment request
2. **Your wallet** signs and sends SOL transaction to blockchain
3. **Frontend** sends the transaction signature to the server
4. **Server** verifies the signature on-chain
5. **Server** returns the protected data
6. **Frontend** displays the response

All in ~500ms! 🚀

## Troubleshooting

### "Please connect your wallet first"
- Click "Connect Wallet" button
- Make sure you're on Mainnet, not Devnet

### "Transaction failed"
- Check you have enough SOL (need ~0.002 SOL for 0.001 payment + fees)
- Make sure you're on Mainnet
- Check your RPC isn't rate-limited

### Server won't start
- Port 3001 might be in use: `lsof -i :3001`
- Check Node.js version: `node --version` (should be 18+)
- Verify .env file exists

### CORS errors
- Make sure `FRONTEND_URL` in server .env matches your frontend URL
- Restart the server after changing .env

## Next Steps

Once you have it running locally:

1. **Customize the UI** - Edit `client/src/App.jsx`
2. **Add more endpoints** - Edit `server/index.js`
3. **Deploy to production** - See [SETUP.md](./SETUP.md)

## Available Endpoints

| Endpoint | Price | Description |
|----------|-------|-------------|
| `/api/free-data` | Free | No payment required |
| `/api/premium-data` | 0.001 SOL | ~$0.10 |
| `/api/ultra-premium` | 0.005 SOL | ~$0.50 |
| `/api/enterprise-data` | 0.01 SOL | ~$1.00 |

## Development Tips

### Hot Reload
Both server and client support hot reload:
- **Server:** Will auto-restart on file changes
- **Client:** Vite handles HMR automatically

### Debugging
- **Server logs:** Check the terminal running the server
- **Client logs:** Open browser DevTools console
- **Network requests:** Check DevTools Network tab

### Testing Different Wallets
The template supports:
- Phantom
- Solflare
- Any wallet-adapter compatible wallet

## Getting Help

- Check server logs in terminal
- Check browser console for errors
- Verify wallet is on Mainnet
- Make sure you have SOL for payments

## Important Notes

⚠️ **This template uses MAINNET**
- Real SOL will be spent
- Payments are irreversible
- Test with small amounts first

🔒 **Security**
- Never commit .env files
- Keep private keys secure
- Use environment variables for secrets

💰 **Costs**
- Each payment costs ~0.00001 SOL in network fees
- Plus the endpoint price (e.g., 0.001 SOL)
- Total: ~0.00101 SOL per premium request

---

Congratulations! You're now running SPL-402 locally! 🎉
