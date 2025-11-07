import { useWallet } from '@solana/wallet-adapter-react';
import { useSPL402 } from 'spl402';

/**
 * React component example using SPL-402 with Solana Wallet Adapter
 */
export function PremiumContentButton() {
  const { publicKey, signAndSendTransaction } = useWallet();

  const { makeRequest, loading, error } = useSPL402({
    network: 'mainnet-beta',
    rpcUrl: process.env.REACT_APP_SOLANA_RPC_URL,
    onSuccess: (response) => {
      console.log('Payment successful!', response);
    },
    onError: (error) => {
      console.error('Payment failed:', error);
    },
  });

  const handleGetPremiumContent = async () => {
    if (!publicKey || !signAndSendTransaction) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const response = await makeRequest(
        'https://api.example.com/premium',
        { publicKey, signAndSendTransaction }
      );

      const data = await response.json();
      console.log('Premium content:', data);
    } catch (err) {
      console.error('Failed to get premium content:', err);
    }
  };

  return (
    <div>
      <button
        onClick={handleGetPremiumContent}
        disabled={!publicKey || loading}
      >
        {loading ? 'Processing Payment...' : 'Get Premium Content (0.001 SOL)'}
      </button>

      {error && (
        <div style={{ color: 'red' }}>
          Error: {error.message}
        </div>
      )}
    </div>
  );
}
