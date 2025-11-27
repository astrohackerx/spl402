import { describe, it, expect } from '@jest/globals';
import {
  getRpcUrl,
  createConnection,
  validatePublicKey,
  validateSignature,
  lamportsToSol,
  solToLamports,
  formatAmount,
  toTokenAmount,
  fromTokenAmount,
} from '../../src/utils';

describe('Utils - RPC Configuration', () => {
  it('should return mainnet-beta RPC URL', () => {
    const url = getRpcUrl('mainnet-beta');
    expect(url).toBe('https://api.mainnet-beta.solana.com');
  });

  it('should return devnet RPC URL', () => {
    const url = getRpcUrl('devnet');
    expect(url).toBe('https://api.devnet.solana.com');
  });

  it('should return testnet RPC URL', () => {
    const url = getRpcUrl('testnet');
    expect(url).toBe('https://api.testnet.solana.com');
  });

  it('should return custom RPC URL when provided', () => {
    const customUrl = 'https://custom-rpc.example.com';
    const url = getRpcUrl('mainnet-beta', customUrl);
    expect(url).toBe(customUrl);
  });

  it('should throw error for unknown network', () => {
    expect(() => getRpcUrl('invalid' as any)).toThrow('Unknown network');
  });

  it('should create connection with default RPC', () => {
    const connection = createConnection('devnet');
    expect(connection).toBeDefined();
    expect(connection.rpcEndpoint).toContain('devnet');
  });

  it('should create connection with custom RPC', () => {
    const customUrl = 'https://custom-rpc.example.com';
    const connection = createConnection('mainnet-beta', customUrl);
    expect(connection).toBeDefined();
    expect(connection.rpcEndpoint).toBe(customUrl);
  });
});

describe('Utils - Public Key Validation', () => {
  it('should validate correct public key', () => {
    const validKey = 'DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump';
    expect(validatePublicKey(validKey)).toBe(true);
  });

  it('should reject invalid public key', () => {
    expect(validatePublicKey('invalid-key')).toBe(false);
    expect(validatePublicKey('')).toBe(false);
    expect(validatePublicKey('123')).toBe(false);
  });

  it('should reject too short public key', () => {
    expect(validatePublicKey('shortkey')).toBe(false);
  });

  it('should reject too long public key', () => {
    const longKey = 'a'.repeat(100);
    expect(validatePublicKey(longKey)).toBe(false);
  });
});

describe('Utils - Signature Validation', () => {
  it('should validate correct signature format', () => {
    const validSig = '5'.repeat(87) + '1';
    expect(validateSignature(validSig)).toBe(true);
  });

  it('should reject invalid signature', () => {
    expect(validateSignature('invalid-signature')).toBe(false);
    expect(validateSignature('')).toBe(false);
  });

  it('should reject too short signature', () => {
    expect(validateSignature('short')).toBe(false);
  });
});

describe('Utils - Lamports Conversion', () => {
  it('should convert SOL to lamports', () => {
    expect(solToLamports(1)).toBe(1_000_000_000);
    expect(solToLamports(0.5)).toBe(500_000_000);
    expect(solToLamports(0.001)).toBe(1_000_000);
    expect(solToLamports(0.0001)).toBe(100_000);
  });

  it('should convert lamports to SOL', () => {
    expect(lamportsToSol(1_000_000_000)).toBe(1);
    expect(lamportsToSol(500_000_000)).toBe(0.5);
    expect(lamportsToSol(1_000_000)).toBe(0.001);
  });

  it('should handle zero values', () => {
    expect(solToLamports(0)).toBe(0);
    expect(lamportsToSol(0)).toBe(0);
  });

  it('should handle very small amounts', () => {
    expect(solToLamports(0.000000001)).toBe(1);
    expect(lamportsToSol(1)).toBe(0.000000001);
  });

  it('should round down fractional lamports', () => {
    expect(solToLamports(0.0000000015)).toBe(1);
  });
});

describe('Utils - Token Amount Conversion', () => {
  it('should convert token amount with 6 decimals (USDC)', () => {
    expect(toTokenAmount(1, 6)).toBe(1_000_000);
    expect(toTokenAmount(0.5, 6)).toBe(500_000);
    expect(toTokenAmount(100, 6)).toBe(100_000_000);
  });

  it('should convert token amount with 9 decimals (SOL)', () => {
    expect(toTokenAmount(1, 9)).toBe(1_000_000_000);
    expect(toTokenAmount(0.001, 9)).toBe(1_000_000);
  });

  it('should convert token amount with 0 decimals', () => {
    expect(toTokenAmount(5, 0)).toBe(5);
    expect(toTokenAmount(100, 0)).toBe(100);
  });

  it('should convert raw amount to token amount', () => {
    expect(fromTokenAmount(1_000_000, 6)).toBe(1);
    expect(fromTokenAmount(500_000, 6)).toBe(0.5);
    expect(fromTokenAmount(1_000_000_000, 9)).toBe(1);
  });

  it('should handle zero token amounts', () => {
    expect(toTokenAmount(0, 6)).toBe(0);
    expect(fromTokenAmount(0, 6)).toBe(0);
  });

  it('should round down fractional token amounts', () => {
    expect(toTokenAmount(0.0000015, 6)).toBe(1);
  });
});

describe('Utils - Amount Formatting', () => {
  it('should format amount with default decimals', () => {
    const formatted = formatAmount(1_000_000_000);
    expect(formatted).toBe('1.000000000');
  });

  it('should format amount with 6 decimals', () => {
    const formatted = formatAmount(1_000_000, 6);
    expect(formatted).toBe('1.000000');
  });

  it('should format amount with 0 decimals', () => {
    const formatted = formatAmount(100, 0);
    expect(formatted).toBe('100');
  });

  it('should format zero amount', () => {
    const formatted = formatAmount(0, 6);
    expect(formatted).toBe('0.000000');
  });
});

describe('Utils - Edge Cases', () => {
  it('should handle maximum safe integer for lamports', () => {
    const maxLamports = Number.MAX_SAFE_INTEGER;
    const sol = lamportsToSol(maxLamports);
    expect(sol).toBeGreaterThan(0);
  });

  it('should handle negative amounts consistently', () => {
    expect(solToLamports(-1)).toBe(-1_000_000_000);
    expect(lamportsToSol(-1_000_000_000)).toBe(-1);
  });

  it('should handle very large token amounts', () => {
    const largeAmount = 1_000_000_000;
    expect(toTokenAmount(largeAmount, 6)).toBe(largeAmount * 1_000_000);
  });
});
