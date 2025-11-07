import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useSPL402 } from 'spl402';
import { Zap, Lock, Globe, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const endpoints = [
  {
    path: '/api/free-data',
    name: 'Free Tier',
    price: 0,
    description: 'No payment required',
    icon: Globe,
    color: 'from-gray-500 to-gray-600'
  },
  {
    path: '/api/premium-data',
    name: 'Premium Tier',
    price: 0.001,
    description: 'Advanced analytics & real-time updates',
    icon: Zap,
    color: 'from-[#9945FF] to-[#7d3dd6]'
  },
  {
    path: '/api/ultra-premium',
    name: 'Ultra Premium',
    price: 0.005,
    description: 'Dedicated manager & custom integrations',
    icon: Lock,
    color: 'from-[#14F195] to-[#0fc978]'
  },
  {
    path: '/api/enterprise-data',
    name: 'Enterprise',
    price: 0.01,
    description: 'White-label & 24/7 dedicated support',
    icon: CheckCircle,
    color: 'from-[#9945FF] to-[#14F195]'
  }
];

export default function App() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { publicKey } = wallet;
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  const { makeRequest } = useSPL402({
    network: 'mainnet-beta',
    rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  });

  const fetchData = async (endpoint) => {
    if (!publicKey && endpoint.price > 0) {
      setErrors({ ...errors, [endpoint.path]: 'Please connect your wallet first' });
      return;
    }

    setLoading({ ...loading, [endpoint.path]: true });
    setErrors({ ...errors, [endpoint.path]: null });
    setResponses({ ...responses, [endpoint.path]: null });

    try {
      let response;

      if (endpoint.price === 0) {
        response = await fetch(`${API_URL}${endpoint.path}`);
      } else {
        const walletAdapter = {
          publicKey: wallet.publicKey,
          signAndSendTransaction: async (transaction) => {
            const signature = await wallet.sendTransaction(transaction, connection, {
              skipPreflight: false,
            });
            return { signature };
          }
        };

        response = await makeRequest(`${API_URL}${endpoint.path}`, walletAdapter);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setResponses({ ...responses, [endpoint.path]: data });
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrors({ ...errors, [endpoint.path]: error.message });
    } finally {
      setLoading({ ...loading, [endpoint.path]: false });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#9945FF] to-[#14F195] rounded-lg flex items-center justify-center font-mono font-bold">
              402
            </div>
            <div>
              <h1 className="text-lg font-bold">SPL-402 Demo</h1>
              <p className="text-xs text-gray-400">Mainnet Template</p>
            </div>
          </div>
          <WalletMultiButton />
        </div>
      </div>

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4">
              Try <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">SPL-402</span> Live
            </h2>
            <p className="text-xl text-gray-400">
              Click any tier to fetch data. Premium tiers require SOL payment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {endpoints.map((endpoint) => {
              const Icon = endpoint.icon;
              const isLoading = loading[endpoint.path];
              const response = responses[endpoint.path];
              const error = errors[endpoint.path];

              return (
                <div key={endpoint.path} className="group relative">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${endpoint.color} rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur`} />
                  <div className="relative bg-[#0D0D0D] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${endpoint.color} rounded-xl flex items-center justify-center`}>
                          <Icon size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{endpoint.name}</h3>
                          <p className="text-sm text-gray-400">{endpoint.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold bg-gradient-to-r ${endpoint.color} text-transparent bg-clip-text`}>
                          {endpoint.price === 0 ? 'FREE' : `${endpoint.price} SOL`}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => fetchData(endpoint)}
                      disabled={isLoading}
                      className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                        endpoint.price === 0
                          ? 'bg-white/10 hover:bg-white/20'
                          : `bg-gradient-to-r ${endpoint.color} hover:opacity-90`
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>Fetch Data</>
                      )}
                    </button>

                    {error && (
                      <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <div className="flex items-center gap-2 text-red-400">
                          <AlertCircle size={16} />
                          <span className="text-sm font-medium">{error}</span>
                        </div>
                      </div>
                    )}

                    {response && (
                      <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="text-xs text-gray-400 mb-2">Response:</div>
                        <pre className="text-xs text-gray-300 overflow-x-auto">
                          {JSON.stringify(response, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">How it works</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="w-10 h-10 bg-[#9945FF]/20 rounded-lg flex items-center justify-center mb-3 font-bold text-[#9945FF]">
                  1
                </div>
                <h4 className="font-bold mb-2">Connect Wallet</h4>
                <p className="text-sm text-gray-400">Connect your Solana wallet (Phantom, Solflare, etc.)</p>
              </div>
              <div>
                <div className="w-10 h-10 bg-[#14F195]/20 rounded-lg flex items-center justify-center mb-3 font-bold text-[#14F195]">
                  2
                </div>
                <h4 className="font-bold mb-2">Choose Tier</h4>
                <p className="text-sm text-gray-400">Select a tier and click "Fetch Data" to make a request</p>
              </div>
              <div>
                <div className="w-10 h-10 bg-[#9945FF]/20 rounded-lg flex items-center justify-center mb-3 font-bold text-[#9945FF]">
                  3
                </div>
                <h4 className="font-bold mb-2">Automatic Payment</h4>
                <p className="text-sm text-gray-400">SPL-402 handles payment verification automatically</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
