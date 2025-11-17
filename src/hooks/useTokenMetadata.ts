import { useState, useEffect } from 'react';
import { getTokenMetadata } from '../lib/tokenMetadata';

export function useTokenMetadata(mintAddress?: string) {
  const [symbol, setSymbol] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mintAddress) {
      setSymbol(undefined);
      return;
    }

    setLoading(true);
    getTokenMetadata(mintAddress)
      .then((metadata) => {
        setSymbol(metadata?.symbol);
      })
      .catch(() => {
        setSymbol(undefined);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [mintAddress]);

  return { symbol, loading };
}
