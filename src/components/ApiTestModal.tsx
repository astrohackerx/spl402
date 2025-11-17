import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useSPL402 } from 'spl402';
import toast from 'react-hot-toast';
import { X, Play, Copy, Check, AlertCircle, Wallet, RefreshCw } from 'lucide-react';
import { PriceDisplay } from './PriceDisplay';

interface ApiTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverEndpoint: string;
  serverName: string;
}

interface Route {
  path: string;
  method: string;
  price: number;
  description?: string;
}

interface ServerMetadata {
  version: string;
  server: {
    name: string;
    description?: string;
    contact?: string;
  };
  wallet: string;
  network: string;
  scheme?: string;
  mint?: string;
  decimals?: number;
  routes: Route[];
  capabilities?: string[];
}

export function ApiTestModal({ isOpen, onClose, serverEndpoint, serverName }: ApiTestModalProps) {
  const wallet = useWallet();
  const { publicKey, signTransaction } = wallet;
  const [method, setMethod] = useState<'GET' | 'POST'>('GET');
  const [requestPath, setRequestPath] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [metadata, setMetadata] = useState<ServerMetadata | null>(null);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  const { makeRequest } = useSPL402({
    network: 'mainnet-beta',
    rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  });

  useEffect(() => {
    if (isOpen) {
      fetchMetadata();
    }
  }, [isOpen]);

  const fetchMetadata = async () => {
    setLoadingMetadata(true);
    try {
      const res = await fetch(`${serverEndpoint}/.well-known/spl402.json`);
      if (res.ok) {
        const data = await res.json();
        setMetadata(data);
      }
    } catch (err) {
      console.log('Could not fetch server metadata');
    } finally {
      setLoadingMetadata(false);
    }
  };

  const handleRouteSelect = (route: Route) => {
    setSelectedRoute(route);
    setRequestPath(route.path);
    setMethod(route.method as 'GET' | 'POST');
  };

  if (!isOpen) return null;

  const fullEndpoint = requestPath ? `${serverEndpoint}${requestPath.startsWith('/') ? '' : '/'}${requestPath}` : serverEndpoint;

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setPaymentRequired(false);

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (method === 'POST' && requestBody) {
        try {
          JSON.parse(requestBody);
          options.body = requestBody;
        } catch (e) {
          throw new Error('Invalid JSON in request body');
        }
      }

      const res = await fetch(fullEndpoint, options);

      if (res.status === 402) {
        setPaymentRequired(true);
        const text = await res.text();
        let formattedResponse = text;
        try {
          const json = JSON.parse(text);
          formattedResponse = JSON.stringify(json, null, 2);
        } catch {
          formattedResponse = text;
        }

        setResponse(
          `Status: 402 Payment Required\n\n` +
          `This endpoint requires payment. Click "Pay & Request" below to:\n` +
          `1. Connect your wallet\n` +
          `2. Make the payment\n` +
          `3. Retry the request with payment proof\n\n` +
          `Payment Details:\n${formattedResponse}`
        );
        return;
      }

      const text = await res.text();

      let formattedResponse = text;
      try {
        const json = JSON.parse(text);
        formattedResponse = JSON.stringify(json, null, 2);
      } catch {
        formattedResponse = text;
      }

      setResponse(
        `Status: ${res.status} ${res.statusText}\n\nHeaders:\n${Array.from(res.headers.entries())
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')}\n\nBody:\n${formattedResponse}`
      );
    } catch (err: any) {
      setError(err.message || 'Failed to make request');
    } finally {
      setLoading(false);
    }
  };

  const handlePayAndRequest = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!signTransaction || !wallet.sendTransaction) {
      toast.error('Wallet does not support signing transactions');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (method === 'POST' && requestBody) {
        options.body = requestBody;
      }

      toast.loading('Processing SPL402 payment...', { id: 'payment' });

      const { Connection } = await import('@solana/web3.js');
      const connection = new Connection(
        import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
      );

      const walletAdapter = {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
        signAndSendTransaction: async (transaction: any) => {
          const signature = await wallet.sendTransaction!(transaction, connection);
          return { signature };
        }
      };

      const res = await makeRequest(fullEndpoint, walletAdapter as any, options);

      toast.success('Payment successful!', { id: 'payment' });

      const text = await res.text();
      let formattedResponse = text;
      try {
        const json = JSON.parse(text);
        formattedResponse = JSON.stringify(json, null, 2);
      } catch {
        formattedResponse = text;
      }

      setResponse(
        `Status: ${res.status} ${res.statusText}\n\n` +
        `✓ Payment processed successfully!\n\n` +
        `Headers:\n${Array.from(res.headers.entries())
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')}\n\nBody:\n${formattedResponse}`
      );
      setPaymentRequired(false);
    } catch (err: any) {
      console.error('SPL402 payment error:', err);
      toast.error(err.message || 'Payment failed', { id: 'payment' });
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold">Test API with SPL402</h2>
            <p className="text-gray-400 text-sm mt-1">{serverName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Base Endpoint</label>
            <div className="bg-black border border-white/10 rounded-lg px-4 py-3 text-sm font-mono text-gray-300">
              {serverEndpoint}
            </div>
          </div>

          {loadingMetadata && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <RefreshCw size={16} className="animate-spin" />
              Loading available routes...
            </div>
          )}

          {metadata && metadata.routes && metadata.routes.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Available Routes (from /.well-known/spl402.json)</label>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-white/10 rounded-lg p-3 bg-black/50">
                {metadata.routes.map((route, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRouteSelect(route)}
                    className={`w-full text-left p-3 rounded-lg border transition-all hover:border-[#14F195]/50 ${
                      selectedRoute === route
                        ? 'border-[#14F195] bg-[#14F195]/10'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#9945FF]/20 text-[#9945FF]">
                          {route.method}
                        </span>
                        <span className="text-sm font-mono text-gray-300">{route.path}</span>
                      </div>
                      <span className="text-sm font-semibold text-[#14F195]">
                        <PriceDisplay
                          price={route.price}
                          scheme={metadata?.scheme}
                          decimals={metadata?.decimals}
                          mint={metadata?.mint}
                        />
                      </span>
                    </div>
                    {route.description && (
                      <p className="text-xs text-gray-400 mt-1">{route.description}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Path (optional)</label>
            <input
              type="text"
              value={requestPath}
              onChange={(e) => setRequestPath(e.target.value)}
              placeholder="/api/data"
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#14F195]/50 transition-colors"
            />
            {requestPath && (
              <p className="text-xs text-gray-400 mt-2">
                Full URL: <span className="text-[#14F195]">{fullEndpoint}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Method</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMethod('GET')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  method === 'GET'
                    ? 'bg-[#14F195] text-black'
                    : 'bg-white/5 border border-white/10 hover:border-[#14F195]/50'
                }`}
              >
                GET
              </button>
              <button
                onClick={() => setMethod('POST')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  method === 'POST'
                    ? 'bg-[#14F195] text-black'
                    : 'bg-white/5 border border-white/10 hover:border-[#14F195]/50'
                }`}
              >
                POST
              </button>
            </div>
          </div>

          {method === 'POST' && (
            <div>
              <label className="block text-sm font-medium mb-2">Request Body (JSON)</label>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                placeholder='{"key": "value"}'
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#14F195]/50 transition-colors resize-none"
                rows={6}
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleTest}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 disabled:opacity-50 rounded-xl font-semibold transition-all"
            >
              {loading && !paymentRequired ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Testing...
                </>
              ) : (
                <>
                  <Play size={18} />
                  Test Request
                </>
              )}
            </button>

            {paymentRequired && (
              <button
                onClick={handlePayAndRequest}
                disabled={loading || !publicKey}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#14F195] hover:bg-[#14F195]/90 disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-xl font-semibold transition-all"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wallet size={18} />
                    Pay & Request
                  </>
                )}
              </button>
            )}
          </div>

          {paymentRequired && !publicKey && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-400 font-medium mb-1">Wallet Required</p>
                  <p className="text-yellow-300 text-sm">Please connect your Solana wallet to make a payment and access this endpoint.</p>
                </div>
              </div>
              <WalletMultiButton className="!bg-[#14F195] hover:!bg-[#14F195]/90 !text-black !font-semibold !rounded-lg !h-10 !px-4 !text-sm" />
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium mb-1">Request Failed</p>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          )}

          {response && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Response</label>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-[#14F195] hover:text-[#14F195]/80 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-black border border-white/10 rounded-lg px-4 py-3 text-xs font-mono text-gray-300 overflow-x-auto max-h-96 overflow-y-auto">
                {response}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
