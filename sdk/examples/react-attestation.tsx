import React, { useState, useEffect } from 'react';
import { checkAttestationByEndpoint, type VerifiedServer } from 'spl402';

interface Props {
  apiEndpoint: string;
  network?: 'mainnet-beta' | 'devnet';
}

export function ServerVerificationBadge({ apiEndpoint, network = 'mainnet-beta' }: Props) {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [serverData, setServerData] = useState<VerifiedServer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyServer() {
      setLoading(true);
      setError(null);

      try {
        const result = await checkAttestationByEndpoint(apiEndpoint, network);

        setIsVerified(result.isVerified);
        if (result.data) {
          setServerData(result.data);
        } else {
          setError(result.error || 'Verification failed');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    }

    verifyServer();
  }, [apiEndpoint, network]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <span className="animate-spin">⏳</span>
        <span>Verifying...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <span>❌</span>
        <span>Not verified</span>
      </div>
    );
  }

  if (isVerified && serverData) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-green-600 font-semibold">
          <span>✅</span>
          <span>Verified Server</span>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <div>
            <span className="font-medium">Wallet:</span>{' '}
            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
              {serverData.wallet.slice(0, 8)}...{serverData.wallet.slice(-8)}
            </code>
          </div>
          <div>
            <span className="font-medium">Description:</span> {serverData.description}
          </div>
          {serverData.contact && (
            <div>
              <span className="font-medium">Contact:</span> {serverData.contact}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export function ServerDiscoveryList() {
  const [servers, setServers] = useState<VerifiedServer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServers() {
      const { queryVerifiedServers } = await import('spl402');
      const result = await queryVerifiedServers('mainnet-beta');
      setServers(result);
      setLoading(false);
    }

    loadServers();
  }, []);

  if (loading) {
    return <div>Loading verified servers...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Verified SPL402 Servers</h2>
      {servers.length === 0 ? (
        <p className="text-gray-500">No verified servers found</p>
      ) : (
        <div className="grid gap-4">
          {servers.map((server, index) => (
            <div
              key={server.attestationPda}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{server.description}</h3>
                  <a
                    href={server.endpoint}
                    className="text-blue-600 hover:underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {server.endpoint}
                  </a>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Wallet:</span>{' '}
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                        {server.wallet}
                      </code>
                    </div>
                    {server.contact && (
                      <div>
                        <span className="font-medium">Contact:</span> {server.contact}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-green-600 text-2xl">✅</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
