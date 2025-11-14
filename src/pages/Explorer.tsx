import { useState, useEffect } from 'react';
import { ExternalLink, Globe, Calendar, User, CheckCircle, XCircle, Server, Activity, Shield, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

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

interface AttestationData {
  address: string;
  credential: string;
  schema: string;
  data: {
    wallet?: string;
    endpoint?: string;
    description?: string;
    contact?: string;
  };
  expiry: number;
  createdAt: string;
}

type TabType = 'nodes' | 'attestations';

export function Explorer() {
  const [activeTab, setActiveTab] = useState<TabType>('nodes');
  const [servers, setServers] = useState<ApiServer[]>([]);
  const [attestations, setAttestations] = useState<AttestationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryAttestations, setSearchQueryAttestations] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [currentPageNodes, setCurrentPageNodes] = useState(1);
  const [currentPageAttestations, setCurrentPageAttestations] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPageNodes(1);
  }, [searchQuery, filterActive]);

  useEffect(() => {
    setCurrentPageAttestations(1);
  }, [searchQueryAttestations]);

  async function loadData() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('api_servers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setServers(data || []);

      const credentialPda = '9GdE9guo1HnMfiFPFPwEbirW4TU3JD1ynRQ7mxvr71yc';
      const schemaPda = '9KvM6vBmzLTiJ5ZFq4sva9pfEkgBp2PJ7cpzZxQCUxeD';

      const attestationsData: AttestationData[] = (data || []).map((server) => {
        return {
          address: server.attestation_address,
          credential: credentialPda,
          schema: schemaPda,
          data: {
            description: server.description,
            endpoint: server.api_endpoint,
            wallet: server.wallet_address,
            contact: server.contact
          },
          expiry: 0,
          createdAt: server.created_at
        };
      });

      setAttestations(attestationsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredServers = servers.filter((server) => {
    const matchesSearch =
      searchQuery === '' ||
      server.wallet_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.api_endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterActive === null || server.is_verified === filterActive;

    return matchesSearch && matchesFilter;
  });

  const filteredAttestations = attestations.filter((attestation) => {
    const matchesSearch =
      searchQueryAttestations === '' ||
      (attestation.data.description?.toLowerCase().includes(searchQueryAttestations.toLowerCase()));

    return matchesSearch;
  });

  const totalPagesNodes = Math.ceil(filteredServers.length / itemsPerPage);
  const totalPagesAttestations = Math.ceil(filteredAttestations.length / itemsPerPage);

  const paginatedServers = filteredServers.slice(
    (currentPageNodes - 1) * itemsPerPage,
    currentPageNodes * itemsPerPage
  );

  const paginatedAttestations = filteredAttestations.slice(
    (currentPageAttestations - 1) * itemsPerPage,
    currentPageAttestations * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">SPL-402 Network Explorer</h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Explore active AI Agents/API servers in the autonomous SPL-402 network
            </p>
          </div>

          <div className="flex gap-2 mb-8 border-b border-white/10">
            <button
              onClick={() => setActiveTab('nodes')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all relative ${
                activeTab === 'nodes'
                  ? 'text-[#14F195]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Server size={20} />
              <span>Nodes</span>
              {activeTab === 'nodes' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#9945FF] to-[#14F195]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('attestations')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all relative ${
                activeTab === 'attestations'
                  ? 'text-[#14F195]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Shield size={20} />
              <span>SAS Attestations</span>
              {activeTab === 'attestations' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#9945FF] to-[#14F195]" />
              )}
            </button>
          </div>

          {activeTab === 'nodes' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#9945FF]/5 border border-[#9945FF]/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-[#9945FF]/20 rounded-lg">
                  <Server size={24} className="text-[#9945FF]" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{servers.length}</div>
              <div className="text-sm text-gray-400">Total Nodes</div>
            </div>

            <div className="bg-gradient-to-br from-[#14F195]/10 to-[#14F195]/5 border border-[#14F195]/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-[#14F195]/20 rounded-lg">
                  <CheckCircle size={24} className="text-[#14F195]" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {servers.filter(s => s.is_verified).length}
              </div>
              <div className="text-sm text-gray-400">Verified</div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Activity size={24} className="text-red-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {servers.filter(s => !s.is_verified).length}
              </div>
              <div className="text-sm text-gray-400">Unverified</div>
            </div>
          </div>
          )}

          {activeTab === 'attestations' && (
            <>
              <div className="bg-gradient-to-br from-[#9945FF]/5 to-[#14F195]/5 border border-[#14F195]/20 rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Shield size={32} className="text-[#14F195]" />
                  <h2 className="text-2xl font-bold">Solana Attestation Service (SAS)</h2>
                </div>
                <p className="text-gray-300 leading-relaxed mb-6">
                  SAS ensures decentralized, cryptographic trust for all participating servers in the SPL-402 network.
                  Each API server signs its identity using its Solana wallet and receives a SAS certificate, enabling
                  automated validation between clients and servers.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield size={18} className="text-[#9945FF]" />
                      <p className="text-gray-400 text-sm font-medium">Credential PDA</p>
                    </div>
                    <a
                      href="https://solscan.io/account/9GdE9guo1HnMfiFPFPwEbirW4TU3JD1ynRQ7mxvr71yc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#14F195] hover:text-[#14F195]/80 transition-colors group/link"
                    >
                      <span className="font-mono text-xs break-all">9GdE9guo1HnMfiFPFPwEbirW4TU3JD1ynRQ7mxvr71yc</span>
                      <ExternalLink size={14} className="flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                  </div>

                  <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={18} className="text-[#9945FF]" />
                      <p className="text-gray-400 text-sm font-medium">Schema PDA</p>
                    </div>
                    <a
                      href="https://solscan.io/account/9KvM6vBmzLTiJ5ZFq4sva9pfEkgBp2PJ7cpzZxQCUxeD"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#14F195] hover:text-[#14F195]/80 transition-colors group/link"
                    >
                      <span className="font-mono text-xs break-all">9KvM6vBmzLTiJ5ZFq4sva9pfEkgBp2PJ7cpzZxQCUxeD</span>
                      <ExternalLink size={14} className="flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                    <CheckCircle size={20} className="text-[#14F195] mb-2" />
                    <h3 className="font-semibold mb-2">Server Attestation</h3>
                    <p className="text-sm text-gray-400">Each API server cryptographically proves its identity on-chain</p>
                  </div>
                  <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                    <Activity size={20} className="text-[#14F195] mb-2" />
                    <h3 className="font-semibold mb-2">Automated Validation</h3>
                    <p className="text-sm text-gray-400">Clients automatically verify SAS attestations before data exchange</p>
                  </div>
                  <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                    <Shield size={20} className="text-[#14F195] mb-2" />
                    <h3 className="font-semibold mb-2">Censorship Resistance</h3>
                    <p className="text-sm text-gray-400">No central authority controls attestation issuance</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'nodes' && (
          <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-4 sm:p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by wallet, endpoint, or name..."
                className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-[#14F195]/50 transition-colors"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterActive(null)}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                    filterActive === null
                      ? 'bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white'
                      : 'bg-[#0D0D0D] border border-white/10 text-gray-300 hover:border-[#14F195]/30'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterActive(true)}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                    filterActive === true
                      ? 'bg-[#14F195] text-black'
                      : 'bg-[#0D0D0D] border border-white/10 text-gray-300 hover:border-[#14F195]/30'
                  }`}
                >
                  Verified
                </button>
                <button
                  onClick={() => setFilterActive(false)}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                    filterActive === false
                      ? 'bg-red-500 text-white'
                      : 'bg-[#0D0D0D] border border-white/10 text-gray-300 hover:border-red-500/30'
                  }`}
                >
                  Unverified
                </button>
              </div>
            </div>
          </div>
          )}

          {activeTab === 'nodes' && (
            <>
              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#14F195]"></div>
                  <p className="mt-4 text-gray-400">Loading servers...</p>
                </div>
              ) : filteredServers.length === 0 ? (
                <div className="text-center py-20 bg-[#0D0D0D] border border-white/10 rounded-2xl">
                  <p className="text-gray-400">No servers found matching your criteria</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 mb-8">
                    {paginatedServers.map((server) => (
                  <div
                    key={server.id}
                    className="group bg-[#0D0D0D] border border-white/10 hover:border-[#14F195]/30 rounded-2xl p-6 sm:p-8 transition-all relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/0 to-[#14F195]/0 group-hover:from-[#9945FF]/5 group-hover:to-[#14F195]/5 transition-all" />

                    <div className="relative">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <Globe size={24} className="text-[#14F195] flex-shrink-0" />
                            <h3 className="text-xl sm:text-2xl font-bold break-all">{server.description}</h3>
                          </div>
                          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">API: {server.api_endpoint}</p>
                        </div>
                        <div className="flex-shrink-0">
                          {server.is_verified ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-[#14F195]/10 text-[#14F195] border border-[#14F195]/20 rounded-full">
                              <CheckCircle size={16} />
                              <span className="text-sm font-medium">Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full">
                              <XCircle size={16} />
                              <span className="text-sm font-medium">Unverified</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <User size={16} className="text-[#9945FF]" />
                            <p className="text-gray-500 text-sm font-medium">Wallet Address</p>
                          </div>
                          <a
                            href={`https://solscan.io/account/${server.wallet_address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#14F195] hover:text-[#14F195]/80 transition-colors group/link"
                          >
                            <span className="font-mono text-xs sm:text-sm break-all">{server.wallet_address}</span>
                            <ExternalLink size={14} className="flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </a>
                        </div>

                        <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Globe size={16} className="text-[#9945FF]" />
                            <p className="text-gray-500 text-sm font-medium">Project</p>
                          </div>
                          <a
                            href={
                              server.contact.startsWith('http://') || server.contact.startsWith('https://')
                                ? server.contact
                                : `https://${server.contact}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#14F195] hover:text-[#14F195]/80 transition-colors group/link"
                          >
                            <span className="text-sm break-all">{server.contact}</span>
                            <ExternalLink size={14} className="flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </a>
                        </div>

                        <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle size={16} className="text-[#9945FF]" />
                            <p className="text-gray-500 text-sm font-medium">Attestation PDA</p>
                          </div>
                          <a
                            href={`https://solscan.io/account/${server.attestation_address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#14F195] hover:text-[#14F195]/80 transition-colors group/link"
                          >
                            <span className="font-mono text-xs sm:text-sm break-all">{server.attestation_address}</span>
                            <ExternalLink size={14} className="flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </a>
                        </div>

                        <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
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
                  </div>
                ))}
              </div>

                  <div className="flex flex-col items-center gap-6">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#0D0D0D] border border-white/10 rounded-full">
                      <span className="text-gray-400 text-sm">Showing</span>
                      <span className="text-[#14F195] font-bold text-lg">{paginatedServers.length}</span>
                      <span className="text-gray-400 text-sm">of</span>
                      <span className="text-white font-bold text-lg">{filteredServers.length}</span>
                      <span className="text-gray-400 text-sm">servers</span>
                    </div>

                    {totalPagesNodes > 1 && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPageNodes(prev => Math.max(1, prev - 1))}
                          disabled={currentPageNodes === 1}
                          className="px-4 py-2 bg-[#0D0D0D] border border-white/10 rounded-lg hover:border-[#14F195]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPagesNodes }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPageNodes(page)}
                              className={`w-10 h-10 rounded-lg transition-colors ${
                                currentPageNodes === page
                                  ? 'bg-[#14F195] text-black font-bold'
                                  : 'bg-[#0D0D0D] border border-white/10 hover:border-[#14F195]/50'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setCurrentPageNodes(prev => Math.min(totalPagesNodes, prev + 1))}
                          disabled={currentPageNodes === totalPagesNodes}
                          className="px-4 py-2 bg-[#0D0D0D] border border-white/10 rounded-lg hover:border-[#14F195]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === 'attestations' && (
            <>
              <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-4 sm:p-6 mb-6">
                <input
                  type="text"
                  value={searchQueryAttestations}
                  onChange={(e) => setSearchQueryAttestations(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-[#14F195]/50 transition-colors"
                />
              </div>

              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#14F195]"></div>
                  <p className="mt-4 text-gray-400">Loading attestations from blockchain...</p>
                </div>
              ) : filteredAttestations.length === 0 ? (
                <div className="text-center py-20 bg-[#0D0D0D] border border-white/10 rounded-2xl">
                  <p className="text-gray-400">No attestations found matching your criteria</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedAttestations.map((attestation, index) => {
                      const contactUrl = attestation.data.contact || '#';
                      const fullUrl = contactUrl.startsWith('http://') || contactUrl.startsWith('https://')
                        ? contactUrl
                        : `https://${contactUrl}`;
                      const proofUrl = `https://explorer.solana.com/address/${attestation.address}`;

                      return (
                      <div
                        key={attestation.address}
                        className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-white/10 hover:border-[#14F195]/40 rounded-2xl p-8 transition-all relative overflow-hidden h-full"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/0 to-[#14F195]/0 hover:from-[#9945FF]/10 hover:to-[#14F195]/10 transition-all" />

                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#14F195]/20 to-transparent rounded-bl-full opacity-50" />

                        <div className="relative">
                          <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-black/50 backdrop-blur-sm rounded-xl border border-white/20">
                              <svg width="32" height="32" viewBox="0 0 397.7 311.7">
                                <linearGradient id={`solanaGrad${index}`} x1="360.879" y1="351.455" x2="141.213" y2="-69.294" gradientUnits="userSpaceOnUse">
                                  <stop offset="0" stopColor="#14F195"/>
                                  <stop offset="1" stopColor="#9945FF"/>
                                </linearGradient>
                                <path fill={`url(#solanaGrad${index})`} d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"/>
                                <path fill={`url(#solanaGrad${index})`} d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"/>
                                <path fill={`url(#solanaGrad${index})`} d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"/>
                              </svg>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#14F195]/10 border border-[#14F195]/30 rounded-full">
                              <CheckCircle size={14} className="text-[#14F195]" />
                              <span className="text-[#14F195] text-xs font-medium">VERIFIED</span>
                            </div>
                          </div>

                          <div className="mb-6 text-center">
                            <h3 className="text-2xl font-bold text-white">
                              {attestation.data.description || `SPL-402 Certificate #${index + 1}`}
                            </h3>
                          </div>

                          <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                            <a
                              href={fullUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#14F195] hover:bg-[#14F195]/80 text-black font-semibold rounded-lg transition-colors"
                            >
                              <Globe size={16} />
                              <span>Project</span>
                              <ExternalLink size={14} />
                            </a>
                            <a
                              href={proofUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0D0D0D] hover:bg-[#0D0D0D]/80 border border-white/20 hover:border-[#14F195]/50 text-white font-semibold rounded-lg transition-colors"
                            >
                              <Shield size={16} />
                              <span>Proof</span>
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col items-center gap-6 mt-8">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#0D0D0D] border border-white/10 rounded-full">
                      <span className="text-gray-400 text-sm">Showing</span>
                      <span className="text-[#14F195] font-bold text-lg">{paginatedAttestations.length}</span>
                      <span className="text-gray-400 text-sm">of</span>
                      <span className="text-white font-bold text-lg">{filteredAttestations.length}</span>
                      <span className="text-gray-400 text-sm">attestations</span>
                    </div>

                    {totalPagesAttestations > 1 && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPageAttestations(prev => Math.max(1, prev - 1))}
                          disabled={currentPageAttestations === 1}
                          className="px-4 py-2 bg-[#0D0D0D] border border-white/10 rounded-lg hover:border-[#14F195]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPagesAttestations }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPageAttestations(page)}
                              className={`w-10 h-10 rounded-lg transition-colors ${
                                currentPageAttestations === page
                                  ? 'bg-[#14F195] text-black font-bold'
                                  : 'bg-[#0D0D0D] border border-white/10 hover:border-[#14F195]/50'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setCurrentPageAttestations(prev => Math.min(totalPagesAttestations, prev + 1))}
                          disabled={currentPageAttestations === totalPagesAttestations}
                          className="px-4 py-2 bg-[#0D0D0D] border border-white/10 rounded-lg hover:border-[#14F195]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
