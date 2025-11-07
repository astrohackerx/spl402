import { useCallback, useState } from 'react';
import { SPL402Client } from './client';
import type { WalletAdapter } from './client';
import type { SPL402Config } from './types';

export interface UseSPL402Options extends SPL402Config {
  onSuccess?: (response: Response) => void;
  onError?: (error: Error) => void;
}

export interface UseSPL402Return {
  makeRequest: (url: string, wallet: WalletAdapter, options?: RequestInit) => Promise<Response>;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * React hook for making SPL-402 payment-protected requests
 *
 * @example
 * ```tsx
 * const { makeRequest, loading, error } = useSPL402({
 *   network: 'mainnet-beta',
 *   rpcUrl: process.env.REACT_APP_SOLANA_RPC_URL
 * });
 *
 * const handleRequest = async () => {
 *   if (!wallet) return;
 *   const response = await makeRequest('/api/premium', wallet);
 *   const data = await response.json();
 * };
 * ```
 */
export function useSPL402(options: UseSPL402Options): UseSPL402Return {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const client = new SPL402Client(options);

  const makeRequest = useCallback(async (
    url: string,
    wallet: WalletAdapter,
    fetchOptions?: RequestInit
  ): Promise<Response> => {
    setLoading(true);
    setError(null);

    try {
      const response = await client.makeRequest(url, wallet, fetchOptions);
      options.onSuccess?.(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client, options]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    makeRequest,
    loading,
    error,
    reset,
  };
}
