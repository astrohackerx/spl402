import { createClient } from 'spl402';
import type { WalletAdapter } from 'spl402';

/**
 * Vanilla TypeScript example using SPL-402 with Phantom wallet
 */

// Initialize the client
const client = createClient({
  network: 'mainnet-beta',
  rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
});

// Get Phantom wallet
function getPhantomWallet(): WalletAdapter | null {
  if ('phantom' in window) {
    const phantom = (window as any).phantom?.solana;
    if (phantom?.isPhantom) {
      return phantom;
    }
  }
  return null;
}

// Make a paid request
async function getPremiumContent() {
  const wallet = getPhantomWallet();

  if (!wallet) {
    throw new Error('Phantom wallet not found. Please install it.');
  }

  // Connect wallet if not connected
  if (!wallet.publicKey) {
    await wallet.connect();
  }

  try {
    console.log('Making paid request...');

    const response = await client.makeRequest(
      'https://api.example.com/premium',
      wallet
    );

    if (response.ok) {
      const data = await response.json();
      console.log('Premium content received:', data);
      return data;
    } else {
      throw new Error(`Request failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Payment failed:', error);
    throw error;
  }
}

// Export for use in your app
export { getPremiumContent, client };

// Example usage
if (typeof window !== 'undefined') {
  // Browser environment
  document.getElementById('get-premium-btn')?.addEventListener('click', async () => {
    try {
      const data = await getPremiumContent();
      alert('Success! Check console for data.');
    } catch (error) {
      alert('Failed: ' + (error as Error).message);
    }
  });
}
