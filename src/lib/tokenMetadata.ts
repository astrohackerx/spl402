const tokenCache = new Map<string, { symbol: string; name: string; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60;

export async function getTokenMetadata(mintAddress: string): Promise<{ symbol: string; name: string } | null> {
  const cached = tokenCache.get(mintAddress);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return { symbol: cached.symbol, name: cached.name };
  }

  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mintAddress}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.pairs && data.pairs.length > 0) {
      const pair = data.pairs[0];
      const symbol = pair.baseToken?.symbol || 'TOKEN';
      const name = pair.baseToken?.name || symbol;

      tokenCache.set(mintAddress, {
        symbol,
        name,
        timestamp: Date.now(),
      });

      return { symbol, name };
    }
  } catch (error) {
    console.error('Error fetching token metadata:', error);
  }

  return null;
}
