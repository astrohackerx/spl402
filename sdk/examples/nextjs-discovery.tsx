'use client';

import { useState, useEffect } from 'react';
import { queryVerifiedServers, checkAttestationByWallet, type VerifiedServer } from 'spl402';

export default function ServerDiscoveryPage() {
  const [servers, setServers] = useState<VerifiedServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchWallet, setSearchWallet] = useState('');
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  useEffect(() => {
    async function loadServers() {
      try {
        const result = await queryVerifiedServers('mainnet-beta');
        setServers(result);
      } catch (error) {
        console.error('Failed to load servers:', error);
      } finally {
        setLoading(false);
      }
    }

    loadServers();
  }, []);

  async function handleVerifyWallet() {
    if (!searchWallet) return;

    setVerificationResult('Verifying...');

    const result = await checkAttestationByWallet(searchWallet, 'mainnet-beta');

    if (result.isVerified) {
      setVerificationResult(
        `✅ Verified! Server: ${result.data?.description} | Endpoint: ${result.data?.endpoint}`
      );
    } else {
      setVerificationResult(`❌ Not verified: ${result.error}`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">SPL402 Server Discovery</h1>
          <p className="text-gray-600">
            Find and verify on-chain attested SPL402 API servers
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Verify Server Wallet</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter wallet address"
              value={searchWallet}
              onChange={(e) => setSearchWallet(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleVerifyWallet}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Verify
            </button>
          </div>
          {verificationResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm">{verificationResult}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6">
            Verified Servers ({servers.length})
          </h2>

          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <div className="animate-spin text-4xl mb-4">⏳</div>
              <p>Loading verified servers from Solana...</p>
            </div>
          ) : servers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No verified servers found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {servers.map((server) => (
                <div
                  key={server.attestationPda}
                  className="border rounded-lg p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">
                          {server.description}
                        </h3>
                        <span className="text-green-600 text-xl">✅</span>
                      </div>
                      <a
                        href={server.endpoint}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {server.endpoint}
                      </a>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-gray-600 min-w-[80px]">
                        Wallet:
                      </span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono flex-1 break-all">
                        {server.wallet}
                      </code>
                    </div>

                    {server.contact && (
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-gray-600 min-w-[80px]">
                          Contact:
                        </span>
                        <span className="text-gray-700">{server.contact}</span>
                      </div>
                    )}

                    <div className="flex items-start gap-2">
                      <span className="font-medium text-gray-600 min-w-[80px]">
                        PDA:
                      </span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono flex-1 break-all">
                        {server.attestationPda}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
