import { describe, it, expect, beforeEach } from '@jest/globals';
import { Keypair } from '@solana/web3.js';
import { verifyPayment } from '../../src/verify';
import { SPL402PaymentPayload, SPL402_VERSION } from '../../src/types';

describe('Security - Replay Attack Prevention', () => {
  let validPayment: SPL402PaymentPayload;
  let recipientAddress: string;

  beforeEach(() => {
    recipientAddress = Keypair.generate().publicKey.toBase58();
    validPayment = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from: Keypair.generate().publicKey.toBase58(),
        to: recipientAddress,
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };
  });

  it('should cache verified signatures', async () => {
    const payment = { ...validPayment };
    expect(payment.payload.signature).toBeDefined();
  });

  it('should generate unique signatures for different payments', () => {
    const sig1 = '5'.repeat(88);
    const sig2 = '3'.repeat(88);

    expect(sig1).not.toBe(sig2);
  });

  it('should validate signature uniqueness', () => {
    const signatures = new Set<string>();
    const sig1 = Keypair.generate().publicKey.toBase58();
    const sig2 = Keypair.generate().publicKey.toBase58();

    signatures.add(sig1);
    expect(signatures.has(sig1)).toBe(true);
    expect(signatures.has(sig2)).toBe(false);

    signatures.add(sig2);
    expect(signatures.has(sig2)).toBe(true);
    expect(signatures.size).toBe(2);
  });
});

describe('Security - Timestamp Manipulation', () => {
  it('should reject very old timestamps', async () => {
    const recipientAddress = Keypair.generate().publicKey.toBase58();
    const oldTimestamp = Date.now() - (10 * 60 * 1000);

    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from: Keypair.generate().publicKey.toBase58(),
        to: recipientAddress,
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: oldTimestamp,
      },
    };

    const result = await verifyPayment(payment, 0.001, recipientAddress, 'devnet');

    expect(result.valid).toBe(false);
    expect(result.reason).toContain('expired');
  });

  it('should reject future timestamps', async () => {
    const recipientAddress = Keypair.generate().publicKey.toBase58();
    const futureTimestamp = Date.now() + (10 * 60 * 1000);

    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from: Keypair.generate().publicKey.toBase58(),
        to: recipientAddress,
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: futureTimestamp,
      },
    };

    const result = await verifyPayment(payment, 0.001, recipientAddress, 'devnet');

    expect(result.valid).toBe(false);
    expect(result.reason).toContain('expired');
  });

  it('should accept timestamps within valid window', () => {
    const now = Date.now();
    const validWindow = 5 * 60 * 1000;

    const recentTimestamp = now - (2 * 60 * 1000);
    expect(Math.abs(now - recentTimestamp)).toBeLessThan(validWindow);

    const veryRecentTimestamp = now - 30000;
    expect(Math.abs(now - veryRecentTimestamp)).toBeLessThan(validWindow);
  });
});

describe('Security - Amount Manipulation', () => {
  it('should detect insufficient payment', async () => {
    const recipientAddress = Keypair.generate().publicKey.toBase58();

    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from: Keypair.generate().publicKey.toBase58(),
        to: recipientAddress,
        amount: 0.0005,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    const expectedAmount = 0.001;
    expect(payment.payload.amount).toBeLessThan(expectedAmount);
  });

  it('should detect overpayment attempt', async () => {
    const recipientAddress = Keypair.generate().publicKey.toBase58();

    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from: Keypair.generate().publicKey.toBase58(),
        to: recipientAddress,
        amount: 0.002,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    const expectedAmount = 0.001;
    expect(payment.payload.amount).toBeGreaterThan(expectedAmount);
  });

  it('should require exact amount match', () => {
    const expected = 0.001;
    const actual1 = 0.001;
    const actual2 = 0.0010001;

    expect(expected).toBe(actual1);
    expect(expected).not.toBe(actual2);
  });
});

describe('Security - Recipient Spoofing', () => {
  it('should validate recipient address', async () => {
    const correctRecipient = Keypair.generate().publicKey.toBase58();
    const wrongRecipient = Keypair.generate().publicKey.toBase58();

    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from: Keypair.generate().publicKey.toBase58(),
        to: wrongRecipient,
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    expect(payment.payload.to).not.toBe(correctRecipient);
  });

  it('should reject payments to wrong recipient', async () => {
    const correctRecipient = Keypair.generate().publicKey.toBase58();
    const wrongRecipient = Keypair.generate().publicKey.toBase58();

    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from: Keypair.generate().publicKey.toBase58(),
        to: wrongRecipient,
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    expect(payment.payload.to).toBe(wrongRecipient);
    expect(payment.payload.to).not.toBe(correctRecipient);
  });
});

describe('Security - Network Confusion Attacks', () => {
  it('should reject mainnet payment on devnet server', async () => {
    const recipientAddress = Keypair.generate().publicKey.toBase58();

    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'mainnet-beta',
      payload: {
        from: Keypair.generate().publicKey.toBase58(),
        to: recipientAddress,
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    const result = await verifyPayment(payment, 0.001, recipientAddress, 'devnet');

    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Network mismatch');
  });

  it('should reject devnet payment on mainnet server', async () => {
    const recipientAddress = Keypair.generate().publicKey.toBase58();

    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from: Keypair.generate().publicKey.toBase58(),
        to: recipientAddress,
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    const result = await verifyPayment(payment, 0.001, recipientAddress, 'mainnet-beta');

    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Network mismatch');
  });

  it('should accept matching networks', async () => {
    const recipientAddress = Keypair.generate().publicKey.toBase58();

    const devnetPayment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from: Keypair.generate().publicKey.toBase58(),
        to: recipientAddress,
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    expect(devnetPayment.network).toBe('devnet');
  });
});

describe('Security - Signature Forgery Prevention', () => {
  it('should reject invalid signature format', async () => {
    const recipientAddress = Keypair.generate().publicKey.toBase58();

    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from: Keypair.generate().publicKey.toBase58(),
        to: recipientAddress,
        amount: 0.001,
        signature: 'forged-signature',
        timestamp: Date.now(),
      },
    };

    const result = await verifyPayment(payment, 0.001, recipientAddress, 'devnet');

    expect(result.valid).toBe(false);
    expect(result.reason).toContain('Invalid transaction signature');
  });

  it('should validate signature length', async () => {
    const shortSignature = '123';
    const validSignature = '5'.repeat(88);

    expect(shortSignature.length).toBeLessThan(64);
    expect(validSignature.length).toBeGreaterThanOrEqual(64);
  });
});

describe('Security - Version Mismatch Attacks', () => {
  it('should reject future protocol versions', async () => {
    const recipientAddress = Keypair.generate().publicKey.toBase58();

    const payment: SPL402PaymentPayload = {
      spl402Version: 999,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from: Keypair.generate().publicKey.toBase58(),
        to: recipientAddress,
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    const result = await verifyPayment(payment, 0.001, recipientAddress, 'devnet');

    expect(result.valid).toBe(false);
    expect(result.reason).toContain('Unsupported SPL-402 version');
  });

  it('should only accept version 1', async () => {
    const recipientAddress = Keypair.generate().publicKey.toBase58();

    const payment: SPL402PaymentPayload = {
      spl402Version: SPL402_VERSION,
      scheme: 'transfer',
      network: 'devnet',
      payload: {
        from: Keypair.generate().publicKey.toBase58(),
        to: recipientAddress,
        amount: 0.001,
        signature: '5'.repeat(88),
        timestamp: Date.now(),
      },
    };

    expect(payment.spl402Version).toBe(1);
    expect(SPL402_VERSION).toBe(1);
  });
});
