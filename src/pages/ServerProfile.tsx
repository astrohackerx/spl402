import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLink, Globe, Calendar, User, CheckCircle, XCircle, ArrowLeft, Activity, Play, Shield, Tag, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ApiTestModal } from '../components/ApiTestModal';
import { useServerHealth } from '../hooks/useServerHealth';
import { PriceDisplay } from '../components/PriceDisplay';

interface ApiServer {
  id: string;
  wallet_address: string;
  api_endpoint: string;
  description: string;
  contact: string;
  attestation_address: string;
  created_at: string;
  is_verified: boolean;
}

export function ServerProfile() {
  const { attestationPda } = useParams<{ attestationPda: string }>();
  const navigate = useNavigate();
  const [server, setServer] = useState<ApiServer | null>(null);
  const [loading, setLoading] = useState(true);
  const [testModalOpen, setTestModalOpen] = useState(false);

  const { healthStatus } = useServerHealth(server ? [server.api_endpoint] : []);
  const serverHealth = server ? healthStatus[server.api_endpoint] : null;

  useEffect(() => {
    if (attestationPda) {
      loadServer();
    }
  }, [attestationPda]);

  async function loadServer() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('api_servers')
        .select('*')
        .eq('attestation_address', attestationPda)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setServer(data);
      }
    } catch (error) {
      console.error('Error loading server:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#14F195]"></div>
            <p className="mt-4 text-gray-400">Loading server...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!server) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Server Not Found</h1>
            <p className="text-gray-400 mb-8">The server you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/explorer')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 rounded-xl font-semibold transition-all"
            >
              <ArrowLeft size={18} />
              Back to Explorer
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/explorer')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            Back to Explorer
          </button>

          <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/20 p-8 sm:p-12 border-b border-white/10">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <Globe size={32} className="text-[#14F195]" />
                    <h1 className="text-3xl sm:text-4xl font-bold">
                      {serverHealth?.metadata?.server?.name || server.description}
                    </h1>
                    {serverHealth && (
                      serverHealth.hasMetadataEndpoint ? (
                        <div className="flex items-center gap-1 px-3 py-1 bg-[#9945FF]/20 text-[#9945FF] border border-[#9945FF]/30 rounded-md">
                          <Shield size={14} />
                          <span className="text-xs font-medium">v2.0.1+</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 rounded-md">
                          <span className="text-xs font-medium">Legacy SDK. Needs Upgrade to v2.0.1+</span>
                        </div>
                      )
                    )}
                  </div>
                  <p className="text-gray-300 text-lg mb-2">
                    {serverHealth?.metadata?.server?.description || server.description}
                  </p>
                  <p className="text-gray-400 text-sm mb-4">{server.api_endpoint}</p>
                  <div className="flex flex-wrap gap-3">
                    {server.is_verified ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-[#14F195]/20 text-[#14F195] border border-[#14F195]/30 rounded-full">
                        <CheckCircle size={16} />
                        <span className="text-sm font-medium">Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full">
                        <XCircle size={16} />
                        <span className="text-sm font-medium">Unverified</span>
                      </div>
                    )}
                    {serverHealth && (
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                          serverHealth.isOnline
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            serverHealth.isOnline ? 'bg-green-400' : 'bg-gray-400'
                          }`}
                        />
                        <span className="text-sm font-medium">
                          {serverHealth.isOnline ? 'Online' : 'Offline'}
                        </span>
                        {serverHealth.responseTime && (
                          <span className="text-xs">
                            ({serverHealth.responseTime}ms)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setTestModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 rounded-xl font-semibold transition-all whitespace-nowrap"
                >
                  <Play size={18} />
                  Test API
                </button>
              </div>
            </div>

            <div className="p-8 sm:p-12">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-bold mb-4">Server Details</h2>
                  <div className="space-y-4">
                    <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User size={16} className="text-[#9945FF]" />
                        <p className="text-gray-500 text-sm font-medium">Wallet Address</p>
                      </div>
                      <a
                        href={`https://solscan.io/account/${server.wallet_address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#14F195] hover:text-[#14F195]/80 transition-colors group"
                      >
                        <span className="font-mono text-sm break-all">{server.wallet_address}</span>
                        <ExternalLink size={14} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>

                    <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe size={16} className="text-[#9945FF]" />
                        <p className="text-gray-500 text-sm font-medium">Project Website</p>
                      </div>
                      <a
                        href={
                          (serverHealth?.metadata?.server?.contact || server.contact).startsWith('http://') ||
                          (serverHealth?.metadata?.server?.contact || server.contact).startsWith('https://')
                            ? (serverHealth?.metadata?.server?.contact || server.contact)
                            : `https://${serverHealth?.metadata?.server?.contact || server.contact}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#14F195] hover:text-[#14F195]/80 transition-colors group"
                      >
                        <span className="text-sm break-all">{serverHealth?.metadata?.server?.contact || server.contact}</span>
                        <ExternalLink size={14} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>

                    <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={16} className="text-[#9945FF]" />
                        <p className="text-gray-500 text-sm font-medium">Registered</p>
                      </div>
                      <p className="text-white text-sm">
                        {new Date(server.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">Attestation</h2>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle size={20} className="text-[#14F195]" />
                        <h3 className="font-semibold">SAS Certificate</h3>
                      </div>
                      <p className="text-sm text-gray-400 mb-4">
                        This server is registered with Solana Attestation Service (SAS), providing
                        cryptographic proof of its identity on-chain.
                      </p>
                      <div className="bg-black/50 border border-white/10 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-2">Attestation PDA</p>
                        <a
                          href={`https://solscan.io/account/${server.attestation_address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[#14F195] hover:text-[#14F195]/80 transition-colors group"
                        >
                          <span className="font-mono text-xs break-all">{server.attestation_address}</span>
                          <ExternalLink size={14} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </div>
                    </div>

                    {serverHealth && (
                      <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Activity size={16} className="text-[#9945FF]" />
                          <p className="text-gray-500 text-sm font-medium">Health Status</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Status</span>
                            <span
                              className={
                                serverHealth.isOnline ? 'text-green-400 font-medium' : 'text-gray-400'
                              }
                            >
                              {serverHealth.isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>
                          {serverHealth.responseTime && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Response Time</span>
                              <span className="text-white">{serverHealth.responseTime}ms</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-400">Last Checked</span>
                            <span className="text-white">
                              {serverHealth.lastChecked.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {serverHealth?.metadata?.capabilities && serverHealth.metadata.capabilities.length > 0 && (
                <div className="mt-8 bg-black/30 border border-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag size={18} className="text-[#9945FF]" />
                    <h2 className="text-xl font-bold">Capabilities</h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {serverHealth.metadata.capabilities.map((cap, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-[#9945FF]/10 text-[#9945FF] border border-[#9945FF]/20 rounded-full text-sm font-medium"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {serverHealth?.metadata?.routes && serverHealth.metadata.routes.length > 0 && (
                <div className="mt-8 bg-black/30 border border-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign size={18} className="text-[#14F195]" />
                    <h2 className="text-xl font-bold">API Routes & Pricing</h2>
                  </div>
                  <div className="bg-black/50 border border-white/5 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <div className="space-y-3">
                      {serverHealth.metadata.routes.map((route, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-[#0D0D0D] border border-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-[#14F195]/10 text-[#14F195] border border-[#14F195]/20 rounded font-mono text-sm font-medium">
                              {route.method}
                            </span>
                            <span className="text-gray-200 font-mono text-sm">{route.path}</span>
                          </div>
                          <span className="text-[#14F195] font-bold text-sm">
                            <PriceDisplay
                              price={route.price}
                              scheme={serverHealth.metadata.scheme}
                              decimals={serverHealth.metadata.decimals}
                              mint={serverHealth.metadata.mint}
                            />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 bg-[#9945FF]/5 border border-[#9945FF]/20 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Integration Example</h2>
                <p className="text-gray-400 text-sm mb-4">
                  Use the SPL402 SDK to interact with this API:
                </p>
                <pre className="bg-black border border-white/10 rounded-lg p-4 text-xs font-mono text-gray-300 overflow-x-auto">
{`import { useSPL402 } from 'spl402';
import { useWallet } from '@solana/wallet-adapter-react';

const { publicKey, signAndSendTransaction } = useWallet();
const { makeRequest } = useSPL402({
  network: 'mainnet-beta',
  rpcUrl: process.env.REACT_APP_SOLANA_RPC_URL,
});

const response = await makeRequest('${server.api_endpoint}', {
  publicKey,
  signAndSendTransaction,
});

const data = await response.json();`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ApiTestModal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        serverEndpoint={server.api_endpoint}
        serverName={serverHealth?.metadata?.server?.name || server.description}
      />

      <Footer />
    </div>
  );
}
