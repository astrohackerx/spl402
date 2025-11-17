import { useState, useCallback, useMemo, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token';
import toast from 'react-hot-toast';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

const SPL402_TOKEN_MINT = new PublicKey('DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump');
const SPL402_DECIMALS = 6;
const PAYMENT_AMOUNT = 10000 * Math.pow(10, SPL402_DECIMALS);
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

export function Verify() {
  const { publicKey, sendTransaction } = useWallet();
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);

  const connection = useMemo(() => new Connection(RPC_URL), []);

  useEffect(() => {
    if (publicKey) {
      checkTokenBalance();
    } else {
      setTokenBalance(null);
    }
  }, [publicKey]);

  const checkTokenBalance = useCallback(async () => {
    if (!publicKey) return;

    setLoadingBalance(true);
    try {
      const tokenAccount = await getAssociatedTokenAddress(
        SPL402_TOKEN_MINT,
        publicKey
      );

      const balance = await connection.getTokenAccountBalance(tokenAccount);
      setTokenBalance(balance.value.uiAmount || 0);
    } catch (error: any) {
      if (error.message?.includes('could not find account')) {
        setTokenBalance(0);
        toast.error('No SPL402 token account found. You need SPL402 tokens to register.');
      } else {
        console.error('Failed to fetch token balance:', error);
        toast.error('Failed to fetch token balance');
      }
    } finally {
      setLoadingBalance(false);
    }
  }, [publicKey, connection]);

  const handleRegister = useCallback(async () => {
    if (!apiEndpoint || !description || !contact) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!sendTransaction) {
      toast.error('Wallet does not support sending transactions');
      return;
    }

    const requiredTokens = PAYMENT_AMOUNT / Math.pow(10, SPL402_DECIMALS);
    if (tokenBalance !== null && tokenBalance < requiredTokens) {
      toast.error(`Insufficient SPL402 tokens. You have ${tokenBalance.toLocaleString()}, but need ${requiredTokens.toLocaleString()}`);
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const recipientWallet = new PublicKey(import.meta.env.VITE_PAYMENT_WALLET);

      const senderATA = await getAssociatedTokenAddress(
        SPL402_TOKEN_MINT,
        publicKey
      );

      const recipientATA = await getAssociatedTokenAddress(
        SPL402_TOKEN_MINT,
        recipientWallet
      );

      const { blockhash } = await connection.getLatestBlockhash();

      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey,
      }).add(
        createTransferInstruction(
          senderATA,
          recipientATA,
          publicKey,
          PAYMENT_AMOUNT
        )
      );

      toast.loading('Sending payment transaction...', { id: 'payment' });
      const txSignature = await sendTransaction(transaction, connection);
      toast.loading('Confirming transaction...', { id: 'payment' });

      await connection.confirmTransaction(txSignature, 'confirmed');
      toast.success('Payment confirmed!', { id: 'payment' });

      toast.loading('Registering server...', { id: 'register' });
      const response = await fetch(`${BACKEND_URL}/api/register-server`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serverWallet: publicKey.toBase58(),
          apiEndpoint,
          description,
          contact,
          paymentSignature: txSignature,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Successfully registered!', { id: 'register' });
        setStatus({
          type: 'success',
          message: `Successfully registered! Attestation PDA: ${data.data?.attestationPda || 'N/A'}`,
        });
        setApiEndpoint('');
        setDescription('');
        setContact('');
        checkTokenBalance();
      } else {
        toast.error(data.error || 'Registration failed', { id: 'register' });
        setStatus({ type: 'error', message: data.error || 'Registration failed' });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed', { id: 'payment' });
      toast.dismiss('register');
      setStatus({ type: 'error', message: error.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  }, [publicKey, sendTransaction, apiEndpoint, description, contact, connection, tokenBalance, checkTokenBalance]);

  const requiredTokens = PAYMENT_AMOUNT / Math.pow(10, SPL402_DECIMALS);
  const hasInsufficientBalance = tokenBalance !== null && tokenBalance < requiredTokens;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Register Your API Server</h1>
            <p className="text-gray-400 text-sm sm:text-base mb-4">
              Connect wallet and register your API server to join the SPL-402 autonomous AI network.
            </p>
            <div className="bg-gradient-to-r from-[#9945FF]/10 to-[#14F195]/10 border border-white/10 rounded-xl p-6 space-y-3">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Shield size={20} className="text-[#14F195]" />
                What is SAS Attestation?
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Solana Attestation Service (SAS) provides cryptographic verification for your API server.
                Each registered server receives a unique attestation PDA (Program Derived Address) that proves
                its identity on-chain, enabling trustless payments and verification between AI agents and APIs.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#14F195]/10 border border-[#14F195]/20 rounded-full">
                  <CheckCircle size={14} className="text-[#14F195]" />
                  <span className="text-xs text-[#14F195] font-medium">Decentralized</span>
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#14F195]/10 border border-[#14F195]/20 rounded-full">
                  <CheckCircle size={14} className="text-[#14F195]" />
                  <span className="text-xs text-[#14F195] font-medium">Censorship Resistant</span>
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#14F195]/10 border border-[#14F195]/20 rounded-full">
                  <CheckCircle size={14} className="text-[#14F195]" />
                  <span className="text-xs text-[#14F195] font-medium">Trustless</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-center mb-6">
              <WalletMultiButton />
            </div>

            {publicKey && (
              <>
                <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-4">
                  <p className="text-sm text-[#14F195] mb-2 break-all">
                    <strong>Connected Wallet:</strong> {publicKey.toBase58()}
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    This wallet address will be linked to your attestation. Make sure to configure this
                    address in your server's payment configuration to receive payments.
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[#14F195]/20">
                    <div>
                      <p className="text-xs text-gray-400">SPL402 Balance:</p>
                      {loadingBalance ? (
                        <p className="text-sm text-white">Loading...</p>
                      ) : (
                        <p className="text-sm font-bold text-white">
                          {tokenBalance !== null ? tokenBalance.toLocaleString() : 'Unknown'} SPL402
                        </p>
                      )}
                    </div>
                    {hasInsufficientBalance && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                        <AlertCircle size={14} className="text-red-400" />
                        <span className="text-xs text-red-400 font-medium">Insufficient</span>
                      </div>
                    )}
                  </div>
                </div>

                {hasInsufficientBalance && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <p className="text-sm text-red-400">
                      <strong>Insufficient Balance:</strong> You need {requiredTokens.toLocaleString()} SPL402 tokens to register, but you only have {tokenBalance?.toLocaleString() || 0}.
                    </p>
                    <a
                      href="https://pump.fun/coin/DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs text-[#14F195] hover:underline"
                    >
                      Buy SPL402 tokens →
                    </a>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">API Endpoint</label>
                  <input
                    type="url"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    placeholder="https://api.example.com"
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-[#14F195]/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Project name</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Your AI Agent/Project name"
                    rows={3}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-[#14F195]/50 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Website</label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="yourproject.com"
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-[#14F195]/50 transition-colors"
                  />
                </div>

                <div className="bg-[#9945FF]/5 border border-[#9945FF]/20 rounded-xl p-4">
                  <p className="text-sm text-[#9945FF]">
                    <strong>Registration Fee:</strong> {requiredTokens.toLocaleString()} SPL402 tokens
                  </p>
                </div>

                <button
                  onClick={handleRegister}
                  disabled={loading || !publicKey || !apiEndpoint || !description || !contact || loadingBalance || hasInsufficientBalance}
                  className="w-full bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 rounded-xl transition-all text-sm sm:text-base"
                >
                  {loading ? 'Registering...' : loadingBalance ? 'Checking Balance...' : hasInsufficientBalance ? 'Insufficient Balance' : 'Register Server'}
                </button>

                {status && (
                  <div
                    className={`rounded-xl p-4 border text-sm ${
                      status.type === 'success'
                        ? 'bg-[#14F195]/5 border-[#14F195]/20 text-[#14F195]'
                        : 'bg-red-500/5 border-red-500/20 text-red-400'
                    }`}
                  >
                    <p className="break-words">{status.message}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
