import { useState, useEffect } from 'react';

interface ServerHealthStatus {
  [key: string]: {
    isOnline: boolean;
    responseTime: number | null;
    lastChecked: Date;
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
          try {
            const startTime = Date.now();
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(endpoint, {
              method: 'HEAD',
              signal: controller.signal,
              mode: 'no-cors',
            });

            clearTimeout(timeoutId);
            const responseTime = Date.now() - startTime;

            results[endpoint] = {
              isOnline: true,
              responseTime,
              lastChecked: new Date(),
            };
          } catch (error) {
            results[endpoint] = {
              isOnline: false,
              responseTime: null,
              lastChecked: new Date(),
            };
          }
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
