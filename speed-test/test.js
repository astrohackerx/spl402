#!/usr/bin/env node

/**
 * SPL402 vs x402 Real Payment Flow Test
 *
 * This script performs COMPLETE payment flows:
 * 1. x402 Echo Merchant: Initial 402 -> Payment (REFUNDED) -> Verification
 * 2. SPL402: Initial 402 -> Solana payment -> Verification -> Access
 *
 * Measures end-to-end latency from first request to final data access
 */

import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token';
import bs58 from 'bs58';
import 'dotenv/config';

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
};

function log(msg, color = 'reset') {
  console.log(`${COLORS[color]}${msg}${COLORS.reset}`);
}

// Test configuration
const config = {
  spl402: {
    serverUrl: process.env.SERVER_URL || 'https://api.spl402.org',
    rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    payerKey: process.env.PAYER_PRIVATE_KEY,
    recipient: process.env.RECIPIENT_ADDRESS || 'EYKiGKpecbag4pFX2EXsKmWPaJNExeRBbzDs3UopDmY2',
  },
  x402: {
    // x402 Echo Merchant - FREE testing with instant refunds!
    echoUrl: 'https://x402.payai.network/api/solana/paid-content',
  }
};

// ============================================================================
// x402 Test (Echo Merchant - FREE with instant refund)
// ============================================================================

async function testX402Flow() {
  log('\n╔════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║      x402 Protocol Test (Echo Merchant - Solana Mainnet)     ║', 'cyan');
  log('║              🎉 FREE TEST - Payment auto-refunded!            ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════════╝', 'cyan');

  const results = {
    protocol: 'x402',
    steps: {},
    success: false,
    totalTime: 0
  };

  try {
    if (!config.spl402.payerKey) {
      log('\n⚠️  PAYER_PRIVATE_KEY not set in .env', 'yellow');
      log('   Testing 402 response only (no payment)...', 'yellow');

      const startTotal = performance.now();

      // Step 1: Initial 402 Request
      log('\n[1/3] Sending request to protected endpoint...', 'yellow');
      const step1Start = performance.now();

      const response402 = await fetch(config.x402.echoUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      const step1Time = performance.now() - step1Start;
      results.steps.initial402 = step1Time;

      log(`✓ Received HTTP ${response402.status}`, response402.status === 402 ? 'yellow' : 'green');
      log(`  Time: ${step1Time.toFixed(2)}ms`, 'cyan');

      const paymentInfo = await response402.json();
      log(`  Payment Info (x402 format):`, 'yellow');
      log(`  ${JSON.stringify(paymentInfo, null, 2)}`, 'cyan');

      results.totalTime = performance.now() - startTotal;
      results.steps.estimated = true;

      log(`\n⏱️  Measured Time: ${results.totalTime.toFixed(2)}ms (402 response only)`, 'cyan');
      log(`⏱️  Full Flow Requires: .env with PAYER_PRIVATE_KEY`, 'yellow');

      return results;
    }

    const connection = new Connection(config.spl402.rpcUrl, 'confirmed');
    const payer = Keypair.fromSecretKey(bs58.decode(config.spl402.payerKey));

    const startTotal = performance.now();

    // Step 1: Initial 402 Request
    log('\n[1/3] Sending request to protected endpoint...', 'yellow');
    const step1Start = performance.now();

    const response402 = await fetch(config.x402.echoUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    const step1Time = performance.now() - step1Start;
    results.steps.initial402 = step1Time;

    log(`✓ Received HTTP ${response402.status}`, response402.status === 402 ? 'yellow' : 'green');
    log(`  Time: ${step1Time.toFixed(2)}ms`, 'cyan');

    if (response402.status !== 402) {
      throw new Error(`Expected 402, got ${response402.status}`);
    }

    const paymentInfo = await response402.json();

    // x402 protocol format
    const paymentMethod = paymentInfo.accepts?.[0];
    if (!paymentMethod) {
      throw new Error('No payment method found in x402 response');
    }

    const recipient = paymentMethod.payTo;
    const amount = parseInt(paymentMethod.maxAmountRequired);
    const asset = paymentMethod.asset;
    const isUSDC = asset === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

    log(`  Payment Required:`, 'yellow');
    log(`    Network: ${paymentMethod.network}`, 'yellow');
    log(`    Token: ${isUSDC ? 'USDC' : asset}`, 'yellow');
    log(`    Amount: ${amount} ${isUSDC ? 'USDC base units' : 'lamports'}`, 'yellow');
    log(`    Recipient: ${recipient.substring(0, 20)}...`, 'yellow');

    // Step 2: Create and Send Payment
    log('\n[2/3] Creating x402 payment transaction...', 'yellow');
    const step2Start = performance.now();

    const recipientPubkey = new PublicKey(recipient);
    const tokenMint = new PublicKey(asset);

    // Get associated token accounts for USDC transfer
    const fromTokenAccount = await getAssociatedTokenAddress(tokenMint, payer.publicKey);
    const toTokenAccount = await getAssociatedTokenAddress(tokenMint, recipientPubkey);

    const transaction = new Transaction().add(
      createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        payer.publicKey,
        amount
      )
    );

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer.publicKey;
    transaction.sign(payer);

    log('  Sending transaction to Solana...', 'cyan');
    const signature = await connection.sendRawTransaction(transaction.serialize());

    log('  Waiting for confirmation...', 'cyan');
    await connection.confirmTransaction(signature, 'confirmed');

    const step2Time = performance.now() - step2Start;
    results.steps.payment = step2Time;

    log(`✓ Payment confirmed!`, 'green');
    log(`  Signature: ${signature.substring(0, 20)}...`, 'green');
    log(`  Time: ${step2Time.toFixed(2)}ms`, 'cyan');

    // Step 3: Retry with Payment Proof
    log('\n[3/3] Retrying request with payment proof...', 'yellow');
    const step3Start = performance.now();

    // x402 expects payment proof in X-PAYMENT header
    const paymentProof = {
      signature: signature,
      payer: payer.publicKey.toString(),
      network: 'solana'
    };

    const responseWithPayment = await fetch(config.x402.echoUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-PAYMENT': JSON.stringify(paymentProof),
      }
    });

    const step3Time = performance.now() - step3Start;
    results.steps.verification = step3Time;

    log(`✓ Received HTTP ${responseWithPayment.status}`, 'green');
    log(`  Time: ${step3Time.toFixed(2)}ms`, 'cyan');

    if (responseWithPayment.status === 200) {
      const data = await responseWithPayment.json();
      log(`✓ Access Granted!`, 'green');
      log(`  Data: ${JSON.stringify(data).substring(0, 100)}...`, 'cyan');
      log(`  💰 Payment will be REFUNDED by Echo Merchant`, 'green');
      results.success = true;
    }

    results.totalTime = performance.now() - startTotal;

    log(`\n⏱️  Total End-to-End Time: ${results.totalTime.toFixed(2)}ms`, 'green');
    log('   (402 + payment + blockchain + verification + access)', 'cyan');

  } catch (error) {
    results.error = error.message;
    log(`\n❌ Error: ${error.message}`, 'red');
  }

  return results;
}

// ============================================================================
// SPL402 Test (Your Implementation)
// ============================================================================

async function testSPL402Flow() {
  log('\n╔════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║           SPL402 Protocol Test (Your API)                     ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════════╝', 'cyan');

  const results = {
    protocol: 'SPL402',
    steps: {},
    success: false,
    totalTime: 0
  };

  try {
    if (!config.spl402.payerKey) {
      log('\n⚠️  PAYER_PRIVATE_KEY not set in .env', 'yellow');
      log('   Testing 402 response only (no payment)...', 'yellow');

      const startTotal = performance.now();

      // Step 1: Initial 402 Request
      log('\n[1/3] Sending request to protected endpoint...', 'yellow');
      const step1Start = performance.now();

      const response402 = await fetch(`${config.spl402.serverUrl}/api/premium-data`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      const step1Time = performance.now() - step1Start;
      results.steps.initial402 = step1Time;

      log(`✓ Received HTTP ${response402.status}`, response402.status === 402 ? 'yellow' : 'green');
      log(`  Time: ${step1Time.toFixed(2)}ms`, 'cyan');

      const paymentInfo = await response402.json();
      log(`  Payment Required to: ${paymentInfo.recipient?.substring(0, 20)}...`, 'yellow');

      results.totalTime = performance.now() - startTotal;
      results.steps.estimated = true;

      log(`\n⏱️  Measured Time: ${results.totalTime.toFixed(2)}ms (402 response only)`, 'cyan');
      log(`⏱️  Full Flow Requires: .env with PAYER_PRIVATE_KEY`, 'yellow');

      return results;
    }

    const connection = new Connection(config.spl402.rpcUrl, 'confirmed');
    const payer = Keypair.fromSecretKey(bs58.decode(config.spl402.payerKey));
    const recipient = new PublicKey(config.spl402.recipient);

    const startTotal = performance.now();

    // Step 1: Initial 402 Request
    log('\n[1/3] Sending request to protected endpoint...', 'yellow');
    const step1Start = performance.now();

    const response402 = await fetch(`${config.spl402.serverUrl}/api/premium-data`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    const step1Time = performance.now() - step1Start;
    results.steps.initial402 = step1Time;

    log(`✓ Received HTTP ${response402.status}`, response402.status === 402 ? 'yellow' : 'green');
    log(`  Time: ${step1Time.toFixed(2)}ms`, 'cyan');

    if (response402.status !== 402) {
      throw new Error(`Expected 402, got ${response402.status}`);
    }

    const paymentInfo = await response402.json();
    log(`  Payment Required to: ${paymentInfo.recipient}`, 'yellow');
    log(`  Network: ${paymentInfo.network || 'solana mainnet-beta'}`, 'yellow');

    // Step 2: Create and Send Payment
    log('\n[2/3] Creating Solana payment transaction...', 'yellow');
    const step2Start = performance.now();

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: recipient,
        lamports: 1_000_000, // 0.001 SOL (matches /api/premium-data price)
      })
    );

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer.publicKey;
    transaction.sign(payer);

    log('  Sending transaction to Solana...', 'cyan');
    const signature = await connection.sendRawTransaction(transaction.serialize());

    log('  Waiting for confirmation...', 'cyan');
    await connection.confirmTransaction(signature, 'confirmed');

    const step2Time = performance.now() - step2Start;
    results.steps.payment = step2Time;

    log(`✓ Payment confirmed!`, 'green');
    log(`  Signature: ${signature.substring(0, 20)}...`, 'green');
    log(`  Time: ${step2Time.toFixed(2)}ms`, 'cyan');

    // Step 3: Retry with Payment Proof
    log('\n[3/3] Retrying request with payment proof...', 'yellow');
    const step3Start = performance.now();

    const spl402Payload = {
      spl402Version: 1,
      scheme: 'transfer',
      network: 'mainnet-beta',
      payload: {
        from: payer.publicKey.toString(),
        to: recipient.toString(),
        amount: 0.001,
        signature: signature,
        timestamp: Date.now()
      }
    };

    const responseWithPayment = await fetch(`${config.spl402.serverUrl}/api/premium-data`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Payment': JSON.stringify(spl402Payload)
      }
    });

    const step3Time = performance.now() - step3Start;
    results.steps.verification = step3Time;

    log(`✓ Received HTTP ${responseWithPayment.status}`, 'green');
    log(`  Time: ${step3Time.toFixed(2)}ms`, 'cyan');

    if (responseWithPayment.status === 200) {
      const data = await responseWithPayment.json();
      log(`✓ Access Granted!`, 'green');
      log(`  Data: ${JSON.stringify(data).substring(0, 100)}...`, 'cyan');
      results.success = true;
    }

    results.totalTime = performance.now() - startTotal;

    log(`\n⏱️  Total End-to-End Time: ${results.totalTime.toFixed(2)}ms`, 'green');
    log('   (402 + payment + blockchain + verification + access)', 'cyan');

  } catch (error) {
    results.error = error.message;
    log(`\n❌ Error: ${error.message}`, 'red');
  }

  return results;
}

// ============================================================================
// Comparison Report
// ============================================================================

function generateReport(x402Results, spl402Results) {
  log('\n' + '═'.repeat(70), 'cyan');
  log('                    FINAL COMPARISON REPORT', 'bright');
  log('═'.repeat(70), 'cyan');

  log('\n📊 x402 Protocol (Echo Merchant - Solana):', 'yellow');
  log('─'.repeat(70), 'yellow');
  log(`  Initial 402 Response: ${x402Results.steps.initial402?.toFixed(2) || 'N/A'}ms`, 'cyan');

  if (x402Results.steps.payment) {
    log(`  Payment Transaction: ${x402Results.steps.payment?.toFixed(2)}ms`, 'cyan');
    log(`  Verification & Access: ${x402Results.steps.verification?.toFixed(2)}ms`, 'cyan');
    log(`  Total Measured: ${x402Results.totalTime?.toFixed(2)}ms`, 'yellow');
  } else {
    log(`  Payment Flow: Not tested (no private key)`, 'yellow');
  }

  log('\n📊 SPL402 Protocol (Your API):', 'green');
  log('─'.repeat(70), 'green');
  log(`  Initial 402 Response: ${spl402Results.steps.initial402?.toFixed(2) || 'N/A'}ms`, 'cyan');

  if (spl402Results.steps.payment) {
    log(`  Payment Transaction: ${spl402Results.steps.payment?.toFixed(2)}ms`, 'cyan');
    log(`  Verification & Access: ${spl402Results.steps.verification?.toFixed(2)}ms`, 'cyan');
    log(`  Total Measured: ${spl402Results.totalTime?.toFixed(2)}ms`, 'green');
  } else {
    log(`  Payment Flow: Not tested (no private key)`, 'yellow');
  }

  log('\n' + '═'.repeat(70), 'magenta');
  log('                        🏆 VERDICT', 'bright');
  log('═'.repeat(70), 'magenta');

  if (x402Results.totalTime && spl402Results.totalTime && !x402Results.steps.estimated && !spl402Results.steps.estimated) {
    // Both have real measurements
    const diff = x402Results.totalTime - spl402Results.totalTime;
    const faster = diff > 0 ? 'SPL402' : 'x402';
    const slower = diff > 0 ? 'x402' : 'SPL402';
    const diffMs = Math.abs(diff);
    const slowerTime = diff > 0 ? x402Results.totalTime : spl402Results.totalTime;
    const percentage = ((diffMs / slowerTime) * 100).toFixed(1);

    if (diff > 0) {
      log(`\n✨ SPL402 is ${diffMs.toFixed(0)}ms FASTER (${percentage}% improvement)`, 'green');
    } else if (diff < 0) {
      log(`\n✨ x402 is ${diffMs.toFixed(0)}ms FASTER (${percentage}% improvement)`, 'green');
    } else {
      log(`\n⚖️  Both protocols have identical latency!`, 'yellow');
    }

    log(`\n📊 Breakdown Comparison:`, 'cyan');
    log(`  Initial 402: x402 ${x402Results.steps.initial402?.toFixed(0)}ms vs SPL402 ${spl402Results.steps.initial402?.toFixed(0)}ms`, 'cyan');
    log(`  Payment: x402 ${x402Results.steps.payment?.toFixed(0)}ms vs SPL402 ${spl402Results.steps.payment?.toFixed(0)}ms`, 'cyan');
    log(`  Verification: x402 ${x402Results.steps.verification?.toFixed(0)}ms vs SPL402 ${spl402Results.steps.verification?.toFixed(0)}ms`, 'cyan');

  } else if (x402Results.steps.estimated || spl402Results.steps.estimated) {
    log(`\n⚠️  Cannot compare - Full payment flow not tested for both protocols`, 'yellow');
    log(`   Add PAYER_PRIVATE_KEY to .env to run real payment tests`, 'cyan');
    log(`   Then we can compare actual end-to-end latency`, 'cyan');
  }

  log('\n💡 Key Differences:', 'cyan');
  log('  • x402 Echo: Uses PayAI facilitator + Solana mainnet', 'yellow');
  log('  • SPL402: Direct P2P Solana payment (no middleman)', 'yellow');
  log('  • x402 Echo: FREE testing (payment refunded instantly)', 'yellow');
  log('  • SPL402: Real payments (~$0.003 per test)', 'yellow');

  log('\n📝 Testing Notes:', 'cyan');
  log('  • x402 Echo Merchant: https://x402.payai.network', 'yellow');
  log('  • Both protocols use Solana mainnet for fair comparison', 'yellow');
  log('  • Both use same RPC and confirmation level (confirmed)', 'yellow');
  log('  • Both use standard Solana web3.js for payments', 'yellow');

  log('\n' + '═'.repeat(70), 'cyan');
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  log('╔════════════════════════════════════════════════════════════════╗', 'bright');
  log('║        SPL402 vs x402 - REAL PAYMENT FLOW COMPARISON          ║', 'bright');
  log('╠════════════════════════════════════════════════════════════════╣', 'bright');
  log('║  Measuring complete end-to-end payment workflows               ║', 'bright');
  log('║  From initial 402 to final data access                         ║', 'bright');
  log('║                                                                 ║', 'bright');
  log('║  🎉 x402 Echo Merchant: FREE with instant refunds!            ║', 'bright');
  log('╚════════════════════════════════════════════════════════════════╝', 'bright');

  // Test x402 Echo Merchant
  const x402Results = await testX402Flow();
  await new Promise(r => setTimeout(r, 1000));

  // Test SPL402
  const spl402Results = await testSPL402Flow();

  // Generate comparison
  generateReport(x402Results, spl402Results);

  log('\n✨ Test Complete!\n', 'green');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
