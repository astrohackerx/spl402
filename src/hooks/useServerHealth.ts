import { useState, useEffect } from 'react';

interface ServerMetadata {
  version?: string;
  server?: {
    name?: string;
    description?: string;
    contact?: string;
  };
  wallet?: string;
  network?: string;
  scheme?: string;
  routes?: Array<{
    path: string;
    method: string;
    price: number;
  }>;
  capabilities?: string[];
}

interface ServerHealthStatus {
  [key: string]: {
    isOnline: boolean;
    responseTime: number | null;
    lastChecked: Date;
    metadata?: ServerMetadata;
    hasMetadataEndpoint: boolean;
  };
}

export function useServerHealth(endpoints: string[]) {
  const [healthStatus, setHealthStatus] = useState<ServerHealthStatus>({});
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (endpoints.length === 0) return;

    const checkHealth = async () => {
      setChecking(true);
      const results: ServerHealthStatus = {};

      await Promise.all(
        endpoints.map(async (endpoint) => {
          const startTime = Date.now();
          let isOnline = false;
          let responseTime: number | null = null;
          let metadata: ServerMetadata | undefined;
          let hasMetadataEndpoint = false;

          try {
            const response = await fetch(endpoint, {
              method: 'HEAD',
              mode: 'no-cors',
              signal: AbortSignal.timeout(10000),
            });

            responseTime = Date.now() - startTime;
            isOnline = true;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '';
            if (!errorMessage.includes('aborted')) {
              isOnline = false;
            }
          }

          if (isOnline) {
            try {
              const metadataResponse = await fetch(`${endpoint}/.well-known/spl402.json`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000),
              });

              if (metadataResponse.ok) {
                metadata = await metadataResponse.json();
                hasMetadataEndpoint = true;
              }
            } catch (error) {
              hasMetadataEndpoint = false;
            }
          }

          results[endpoint] = {
            isOnline,
            responseTime,
            lastChecked: new Date(),
            metadata,
            hasMetadataEndpoint,
          };
        })
      );

      setHealthStatus(results);
      setChecking(false);
    };

    checkHealth();

    const interval = setInterval(checkHealth, 60000);

    return () => clearInterval(interval);
  }, [endpoints.join(',')]);

  return { healthStatus, checking };
}
