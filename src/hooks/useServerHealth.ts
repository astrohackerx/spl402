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
  mint?: string;
  decimals?: number;
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

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries: number = 3,
  delay: number = 1000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('Max retries reached');
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
            const healthUrl = `${endpoint}/health`;
            const response = await fetchWithRetry(
              healthUrl,
              {
                method: 'GET',
                signal: AbortSignal.timeout(10000),
                headers: {
                  'Accept': 'application/json',
                },
              },
              2,
              1500
            );

            responseTime = Date.now() - startTime;
            isOnline = response.ok;

            if (!isOnline) {
              const fallbackResponse = await fetchWithRetry(
                endpoint,
                {
                  method: 'HEAD',
                  signal: AbortSignal.timeout(5000),
                },
                1,
                1000
              ).catch(() => null);

              if (fallbackResponse) {
                responseTime = Date.now() - startTime;
                isOnline = true;
              }
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '';
            if (!errorMessage.includes('aborted') && !errorMessage.includes('fetch')) {
              console.warn(`Health check failed for ${endpoint}:`, errorMessage);
            }
            isOnline = false;
          }

          if (isOnline) {
            try {
              const metadataUrl = `${endpoint}/.well-known/spl402.json`;
              const metadataResponse = await fetchWithRetry(
                metadataUrl,
                {
                  method: 'GET',
                  signal: AbortSignal.timeout(5000),
                  headers: {
                    'Accept': 'application/json',
                  },
                },
                2,
                1000
              );

              if (metadataResponse.ok) {
                try {
                  metadata = await metadataResponse.json();
                  hasMetadataEndpoint = true;
                } catch (e) {
                  console.warn(`Failed to parse metadata for ${endpoint}`);
                }
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
