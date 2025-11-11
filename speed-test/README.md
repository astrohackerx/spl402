# SPL402 vs x402 Performance Test

Real payment flow comparison between SPL402 and x402 protocols.

## Quick Start

```bash
npm install
npm test
```

## What It Tests

### x402 Echo Merchant (FREE - Payment Refunded!)
- **Endpoint**: https://x402.payai.network/api/solana/paid-content
- Initial 402 response
- Estimated full payment flow with PayAI facilitator
- **Total**
- **Cost**

### SPL402
- **Endpoint**: https://api.spl402.org/api/premium
- Initial 402 response
- Full Solana payment flow (requires private key)
- **Cost**

## Test REAL Payments (Optional)

To test SPL402 with actual blockchain payments:

```bash
# Edit .env and add your Solana wallet private key
nano .env
# Add: PAYER_PRIVATE_KEY=your_base58_encoded_key

npm test
```

## Results

Add your `PAYER_PRIVATE_KEY` to `.env` to get real SPL402 measurements and compare with x402 Echo.

## Key Differences

- **x402**: Uses PayAI facilitator + requires x402 client library
- **SPL402**: Direct P2P payment + standard Solana web3.js

