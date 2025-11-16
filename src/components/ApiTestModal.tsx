import { useState } from 'react';
import { X, Play, Copy, Check, AlertCircle } from 'lucide-react';

interface ApiTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverEndpoint: string;
  serverName: string;
}

export function ApiTestModal({ isOpen, onClose, serverEndpoint, serverName }: ApiTestModalProps) {
  const [method, setMethod] = useState<'GET' | 'POST'>('GET');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

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

      const res = await fetch(serverEndpoint, options);
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
            <h2 className="text-2xl font-bold">Test API</h2>
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
            <label className="block text-sm font-medium mb-2">Endpoint</label>
            <div className="bg-black border border-white/10 rounded-lg px-4 py-3 text-sm font-mono text-gray-300">
              {serverEndpoint}
            </div>
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

          <button
            onClick={handleTest}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 disabled:opacity-50 rounded-xl font-semibold transition-all"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Testing...
              </>
            ) : (
              <>
                <Play size={18} />
                Send Request
              </>
            )}
          </button>

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
