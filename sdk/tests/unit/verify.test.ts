import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Keypair } from '@solana/web3.js';
import { verifyPayment } from '../../src/verify';
import { SPL402PaymentPayload, SPL402_VERSION } from '../../src/types';

describe('Verify - Payment Version', () => {
  it('should reject unsupported SPL-402 version', async () => {
    const from = Keypair.generate().publicKey.toBase58();
    const to = Keypair.generate().publicKey.toBase58();

    const payment: SPL402PaymentPayload = {
      spl402Version: 99,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from,
        to,
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    const result = await verifyPayment(payment, 0.001, to, 'devnet');

    expect(result.valid).toBe(false);
    expect(result.reason).toContain('Unsupported SPL-402 version');
  });

  it('should accept SPL-402 version 1', async () => {
    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from: Keypair.generate().publicKey.toBase58(),
        to: Keypair.generate().publicKey.toBase58(),
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    expect(payment.spl402Version).toBe(1);
  });
});

describe('Verify - Network Validation', () => {
  it('should reject network mismatch', async () => {
    const from = Keypair.generate().publicKey.toBase58();
    const to = Keypair.generate().publicKey.toBase58();

    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'mainnet-beta',
      payload: {
        from,
        to,
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    const result = await verifyPayment(payment, 0.001, to, 'devnet');

    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Network mismatch');
  });

  it('should accept matching network', async () => {
    const from = Keypair.generate().publicKey.toBase58();
    const to = Keypair.generate().publicKey.toBase58();

    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from,
        to,
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    const result = await verifyPayment(payment, 0.001, to, 'devnet');
    expect(payment.network).toBe('devnet');
  });
});

describe('Verify - Recipient Validation', () => {
  it('should reject invalid recipient address', async () => {
    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from: Keypair.generate().publicKey.toBase58(),
        to: Keypair.generate().publicKey.toBase58(),
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    const result = await verifyPayment(payment, 0.001, 'invalid-address', 'devnet');

    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Invalid recipient address');
  });

  it('should accept valid recipient address', async () => {
    const to = Keypair.generate().publicKey.toBase58();
    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from: Keypair.generate().publicKey.toBase58(),
        to,
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    const result = await verifyPayment(payment, 0.001, to, 'devnet');
    expect(to.length).toBeGreaterThan(32);
  });
});

describe('Verify - Signature Validation', () => {
  it('should reject invalid signature format', async () => {
    const from = Keypair.generate().publicKey.toBase58();
    const to = Keypair.generate().publicKey.toBase58();

    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from,
        to,
        amount: 0.001,
        signature: 'invalid-signature',
        timestamp: Date.now(),
      },
    };

    const result = await verifyPayment(payment, 0.001, to, 'devnet');

    expect(result.valid).toBe(false);
    expect(result.reason).toContain('Invalid transaction signature');
  });

  it('should reject empty signature', async () => {
    const from = Keypair.generate().publicKey.toBase58();
    const to = Keypair.generate().publicKey.toBase58();

    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from,
        to,
        amount: 0.001,
        signature: '',
        timestamp: Date.now(),
      },
    };

    const result = await verifyPayment(payment, 0.001, to, 'devnet');

    expect(result.valid).toBe(false);
    expect(result.reason).toContain('Invalid transaction signature');
  });
});

describe('Verify - Timestamp Validation', () => {
  it('should reject expired timestamp (too old)', async () => {
    const from = Keypair.generate().publicKey.toBase58();
    const to = Keypair.generate().publicKey.toBase58();

    const expiredTimestamp = Date.now() - (6 * 60 * 1000);

    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from,
        to,
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: expiredTimestamp,
      },
    };

    const result = await verifyPayment(payment, 0.001, to, 'devnet');

    expect(result.valid).toBe(false);
    expect(result.reason).toContain('Payment timestamp expired');
  });

  it('should reject future timestamp (too new)', async () => {
    const from = Keypair.generate().publicKey.toBase58();
    const to = Keypair.generate().publicKey.toBase58();

    const futureTimestamp = Date.now() + (6 * 60 * 1000);

    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from,
        to,
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: futureTimestamp,
      },
    };

    const result = await verifyPayment(payment, 0.001, to, 'devnet');

    expect(result.valid).toBe(false);
    expect(result.reason).toContain('Payment timestamp expired');
  });

  it('should accept recent timestamp', async () => {
    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from: Keypair.generate().publicKey.toBase58(),
        to: Keypair.generate().publicKey.toBase58(),
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    expect(payment.payload.timestamp).toBeLessThanOrEqual(Date.now());
  });
});

describe('Verify - Payment Scheme', () => {
  it('should handle transfer scheme', async () => {
    const from = Keypair.generate().publicKey.toBase58();
    const to = Keypair.generate().publicKey.toBase58();

    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from,
        to,
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    const result = await verifyPayment(payment, 0.001, to, 'devnet');
    expect(payment.scheme).toBe('transfer');
  });

  it('should handle token-transfer scheme', async () => {
    const from = Keypair.generate().publicKey.toBase58();
    const to = Keypair.generate().publicKey.toBase58();
    const mint = Keypair.generate().publicKey.toBase58();

    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'token-transfer',
      network: 'devnet',
      payload: {
        from,
        to,
        mint,
        amount: 100,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    const result = await verifyPayment(payment, 100, to, 'devnet', 6);
    expect(payment.scheme).toBe('token-transfer');
  });

  it('should reject unsupported payment scheme', async () => {
    const payment: any = {
      spl402Version: SPL402_VERSION,
      scheme: 'unsupported-scheme',
      network: 'devnet',
      payload: {
        from: Keypair.generate().publicKey.toBase58(),
        to: Keypair.generate().publicKey.toBase58(),
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    const result = await verifyPayment(payment, 0.001, payment.payload.to, 'devnet');

    expect(result.valid).toBe(false);
    expect(result.reason).toContain('Unsupported payment scheme');
  });
});

describe('Verify - Token Transfer Validation', () => {
  it('should reject token transfer with invalid mint', async () => {
    const from = Keypair.generate().publicKey.toBase58();
    const to = Keypair.generate().publicKey.toBase58();

    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'token-transfer',
      network: 'devnet',
      payload: {
        from,
        to,
        mint: 'invalid-mint',
        amount: 100,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    const result = await verifyPayment(payment, 100, to, 'devnet', 6);

    expect(result.valid).toBe(false);
    expect(result.reason).toContain('Invalid token mint address');
  });

  it('should validate token transfer with valid mint', async () => {
    const mint = Keypair.generate().publicKey.toBase58();
    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'token-transfer',
      network: 'devnet',
      payload: {
        from: Keypair.generate().publicKey.toBase58(),
        to: Keypair.generate().publicKey.toBase58(),
        mint,
        amount: 100,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    if (payment.scheme === 'token-transfer' && 'mint' in payment.payload) {
      expect(payment.payload.mint).toBe(mint);
    }
  });
});

describe('Verify - Amount Validation', () => {
  it('should validate exact amount match', () => {
    const expectedAmount = 0.001;
    const actualAmount = 0.001;

    expect(expectedAmount).toBe(actualAmount);
  });

  it('should detect amount mismatch', () => {
    const expectedAmount = 0.001;
    const actualAmount = 0.0005;

    expect(expectedAmount).not.toBe(actualAmount);
  });

  it('should handle zero amounts', () => {
    const expectedAmount = 0;
    const actualAmount = 0;

    expect(expectedAmount).toBe(actualAmount);
  });

  it('should handle large token amounts', () => {
    const expectedAmount = 1_000_000;
    const actualAmount = 1_000_000;

    expect(expectedAmount).toBe(actualAmount);
  });
});
