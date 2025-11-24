import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useSPL402 } from 'spl402';
import { Transaction } from '@solana/web3.js';

/**
 * React component example using SPL-402 with Solana Wallet Adapter
 *
 * IMPORTANT: makeRequest signature is:
 * makeRequest(url: string, wallet: WalletAdapter, options?: RequestInit)
 */
export function PremiumContentButton() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

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
    if (!publicKey || !sendTransaction) {
      alert('Please connect your wallet first');
      return;
    }

    // Create wallet adapter for SPL-402 (ONE user approval only)
    const walletAdapter = {
      publicKey,
      signAndSendTransaction: async (transaction: Transaction) => {
        const signature = await sendTransaction(transaction, connection);
        return { signature };
      }
    };

    try {
      // GET request - no options needed
      const response = await makeRequest(
        'https://api.example.com/premium',
        walletAdapter
      );

      const data = await response.json();
      console.log('Premium content:', data);
    } catch (err) {
      console.error('Failed to get premium content:', err);
    }
  };

  const handlePostContent = async () => {
    if (!publicKey || !sendTransaction) {
      alert('Please connect your wallet first');
      return;
    }

    // Create wallet adapter for SPL-402 (ONE user approval only)
    const walletAdapter = {
      publicKey,
      signAndSendTransaction: async (transaction: Transaction) => {
        const signature = await sendTransaction(transaction, connection);
        return { signature };
      }
    };

    try {
      // POST request - pass options as third parameter
      const response = await makeRequest(
        'https://api.example.com/content',
        walletAdapter,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'My Content', text: 'Hello World' })
        }
      );

      const data = await response.json();
      console.log('Post response:', data);
    } catch (err) {
      console.error('Failed to post content:', err);
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

      <button
        onClick={handlePostContent}
        disabled={!publicKey || loading}
        style={{ marginLeft: '10px' }}
      >
        {loading ? 'Processing Payment...' : 'Post Content (0.002 SOL)'}
      </button>

      {error && (
        <div style={{ color: 'red' }}>
          Error: {error.message}
        </div>
      )}
    </div>
  );
}
