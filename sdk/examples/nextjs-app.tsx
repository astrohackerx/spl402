/**
 * Next.js App Router example with SPL-402
 */

'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useSPL402 } from 'spl402';
import { useState } from 'react';

export default function PremiumAPIPage() {
  const { publicKey, signAndSendTransaction } = useWallet();
  const [content, setContent] = useState<any>(null);

  const { makeRequest, loading, error } = useSPL402({
    network: 'mainnet-beta',
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL!,
  });

  const fetchPremiumData = async () => {
    if (!publicKey || !signAndSendTransaction) return;

    const response = await makeRequest('/api/premium', {
      publicKey,
      signAndSendTransaction,
    });

    const data = await response.json();
    setContent(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Premium API Access</h1>

      <WalletMultiButton className="mb-6" />

      {publicKey ? (
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded">
            <p className="text-sm text-gray-600">Connected wallet:</p>
            <p className="font-mono text-sm">{publicKey.toBase58()}</p>
          </div>

          <button
            onClick={fetchPremiumData}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Processing Payment...' : 'Get Premium Data (0.001 SOL)'}
          </button>

          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-semibold">Error:</p>
              <p>{error.message}</p>
            </div>
          )}

          {content && (
            <div className="p-4 bg-green-100 border border-green-400 rounded">
              <p className="font-semibold mb-2">Premium Content:</p>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(content, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p>Please connect your wallet to access premium content.</p>
        </div>
      )}
    </div>
  );
}
