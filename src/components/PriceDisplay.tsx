import { useTokenMetadata } from '../hooks/useTokenMetadata';
import { formatPrice } from '../lib/solana';

interface PriceDisplayProps {
  price: number;
  scheme?: string;
  decimals?: number;
  mint?: string;
}

export function PriceDisplay({ price, scheme, decimals, mint }: PriceDisplayProps) {
  const { symbol } = useTokenMetadata(scheme === 'token-transfer' ? mint : undefined);

  return <>{formatPrice(price, scheme, decimals, symbol)}</>;
}
