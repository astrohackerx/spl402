export const LAMPORTS_PER_SOL = 1_000_000_000;

export function lamportsToSol(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL;
}

export function solToLamports(sol: number): number {
  return Math.floor(sol * LAMPORTS_PER_SOL);
}

export function formatSol(sol: number, decimals: number = 4): string {
  return sol.toFixed(decimals);
}

export function formatPrice(
  price: number,
  scheme?: string,
  tokenDecimals?: number,
  tokenSymbol?: string
): string {
  if (price === 0) {
    return 'FREE';
  }

  let actualAmount: number;
  let symbol: string;

  if (scheme === 'token-transfer' && tokenDecimals !== undefined) {
    actualAmount = price;
    symbol = tokenSymbol || 'tokens';
  } else {
    actualAmount = price;
    symbol = 'SOL';
  }

  let displayDecimals = 4;
  if (actualAmount < 0.0001) {
    displayDecimals = Math.min(tokenDecimals ?? 9, 9);
  } else if (actualAmount < 0.01) {
    displayDecimals = 6;
  }

  return `${actualAmount.toFixed(displayDecimals)} ${symbol}`;
}
