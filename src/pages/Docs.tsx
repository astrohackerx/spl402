import { useState } from 'react';
import { Book, Code, Server, Wallet, ArrowRight, Github, ChevronRight, Copy, Check, Zap } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function Docs() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sections = [
    { id: 'getting-started', label: 'Getting Started', icon: Book },
    { id: 'comparison', label: 'SPL-402 vs x402', icon: Zap },
    { id: 'installation', label: 'Installation', icon: Code },
    { id: 'server-setup', label: 'Server Setup', icon: Server },
    { id: 'client-setup', label: 'Client Setup', icon: Wallet },
    { id: 'token-transfers', label: 'Token Transfers', icon: Wallet },
    { id: 'security', label: 'Security', icon: Server },
    { id: 'whitepaper', label: 'Whitepaper', icon: Book },
    { id: 'api-reference', label: 'API Reference', icon: Code },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="pt-20 flex">
        <aside className="hidden lg:block fixed left-0 top-20 bottom-0 w-64 border-r border-white/10 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <nav className="p-6 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-[#9945FF]/20 to-[#14F195]/20 border border-[#14F195]/30 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 lg:ml-64 px-4 sm:px-6 lg:px-12 py-12 max-w-4xl">
          <div className="lg:hidden mb-8">
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              {sections.map((section) => (
                <option key={section.id} value={section.id} className="bg-black">
                  {section.label}
                </option>
              ))}
            </select>
          </div>

          {activeSection === 'getting-started' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black mb-4">Getting Started</h1>
                <p className="text-xl text-gray-400">
                  Add Solana Payment Layer 402 to your API in minutes
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-3">What is SPL-402?</h3>
                <p className="text-gray-300 mb-4">
                  SPL-402 brings HTTP 402 Payment Required to life on Solana. It enables direct wallet-to-wallet
                  payments for API endpoints with zero platform fees and lightning-fast verification.
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <ChevronRight size={18} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span>Direct wallet-to-wallet transfers with zero intermediaries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={18} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span>Zero platform fees (only ~$0.00001 Solana network fee)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={18} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span>~500ms payment verification (2-3x faster than alternatives)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={18} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span>Works with standard HTTP/fetch APIs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={18} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span>Support for SOL and SPL tokens (USDC, USDT, SPL402, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={18} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span>Built-in replay attack prevention</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">How It Works</h2>
                <div className="space-y-4">
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#9945FF]/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[#9945FF]">
                        1
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Client Requests Protected Resource</h3>
                        <p className="text-sm text-gray-400">Client sends a GET request to your protected endpoint</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#14F195]/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[#14F195]">
                        2
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Server Returns 402 Payment Required</h3>
                        <p className="text-sm text-gray-400">Server responds with payment details (amount, recipient, network)</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#9945FF]/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[#9945FF]">
                        3
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Client Creates & Submits Payment</h3>
                        <p className="text-sm text-gray-400">Client creates transaction, signs with wallet, submits to Solana</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#14F195]/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[#14F195]">
                        4
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Client Retries with Proof</h3>
                        <p className="text-sm text-gray-400">Client retries original request with transaction signature as proof</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#9945FF]/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[#9945FF]">
                        5
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Server Verifies Payment</h3>
                        <p className="text-sm text-gray-400">Server checks transaction on-chain to verify payment</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#14F195]/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[#14F195]">
                        6
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Server Returns Protected Content</h3>
                        <p className="text-sm text-gray-400">Payment verified! Server returns 200 OK with requested content</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'comparison' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black mb-4">SPL-402 vs x402</h1>
                <p className="text-xl text-gray-400">
                  Why SPL-402 is 3-4x faster and better for your projects
                </p>
              </div>

              <div className="bg-black/50 border border-white/10 rounded-2xl p-8">
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p className="text-lg text-white font-semibold">
                    What if HTTP 402 actually worked the way it was supposed to? What if when a server says "payment required," you just pay them? Directly.
                  </p>
                  <p>
                    x402? It's just PayPal with extra steps. You still need a facilitator. Still need permission. Still need to trust someone in the middle. They call it "decentralized" but your payment goes through their servers. They verify it. They control it.
                  </p>
                  <p>
                    <strong className="text-[#14F195]">spl402?</strong> Server sends you a Solana address. You send tokens. Server checks the blockchain. Done.
                  </p>
                  <p>
                    No accounts to create. No API keys. No "onboarding process." No waiting for some company to approve your merchant account.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-3">Performance Advantage</h3>
                <p className="text-gray-300 mb-4">
                  SPL-402 achieves 3-4x faster payment verification through architectural improvements and direct blockchain interaction.
                  Our average verification time is ~500ms compared to x402's ~2000ms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Feature Comparison</h2>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Feature</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/30 rounded-xl p-3 text-center">
                    <div className="text-xs uppercase tracking-wider text-[#14F195] font-bold">SPL-402</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">x402</div>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-3 flex items-center">
                    <span className="text-sm text-gray-400">Latency</span>
                  </div>
                  <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-3 flex items-center justify-center">
                    <span className="text-base font-bold text-[#14F195]">1s</span>
                  </div>
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-3 flex items-center justify-center">
                    <span className="text-sm text-gray-400">2.5s+</span>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-3 flex items-center">
                    <span className="text-sm text-gray-400">Platform Fees</span>
                  </div>
                  <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-3 flex items-center justify-center">
                    <span className="text-base font-bold text-[#14F195]">0%</span>
                  </div>
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-3 flex items-center justify-center">
                    <span className="text-sm text-gray-400">Variable</span>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-3 flex items-center">
                    <span className="text-sm text-gray-400">Transaction Cost</span>
                  </div>
                  <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-3 flex items-center justify-center">
                    <span className="text-base font-bold text-[#14F195]">~$0.00001</span>
                  </div>
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-3 flex items-center justify-center">
                    <span className="text-sm text-gray-400">Higher</span>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-3 flex items-center">
                    <span className="text-sm text-gray-400">Dynamic Routes</span>
                  </div>
                  <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-3 flex items-center justify-center">
                    <span className="text-base font-bold text-[#14F195]">Yes</span>
                  </div>
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-3 flex items-center justify-center">
                    <span className="text-sm text-gray-400">No</span>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-3 flex items-center">
                    <span className="text-sm text-gray-400">Smart Client</span>
                  </div>
                  <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-3 flex items-center justify-center">
                    <span className="text-base font-bold text-[#14F195]">Yes</span>
                  </div>
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-3 flex items-center justify-center">
                    <span className="text-sm text-gray-400">No</span>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-3 flex items-center">
                    <span className="text-sm text-gray-400">System</span>
                  </div>
                  <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-3 flex items-center justify-center">
                    <span className="text-sm font-bold text-[#14F195]">Decentralized</span>
                  </div>
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-3 flex items-center justify-center">
                    <span className="text-sm text-gray-400">Centralized</span>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-3 flex items-center">
                    <span className="text-sm text-gray-400">Middleman</span>
                  </div>
                  <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-3 flex items-center justify-center">
                    <span className="text-base font-bold text-[#14F195]">None</span>
                  </div>
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-3 flex items-center justify-center">
                    <span className="text-sm text-gray-400">Yes</span>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-3 flex items-center">
                    <span className="text-sm text-gray-400">API Keys</span>
                  </div>
                  <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-3 flex items-center justify-center">
                    <span className="text-sm font-bold text-[#14F195]">Not required</span>
                  </div>
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-3 flex items-center justify-center">
                    <span className="text-sm text-gray-400">Required</span>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-3 flex items-center">
                    <span className="text-sm text-gray-400">Setup Time</span>
                  </div>
                  <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-3 flex items-center justify-center">
                    <span className="text-base font-bold text-[#14F195]">&lt; 5 min</span>
                  </div>
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-3 flex items-center justify-center">
                    <span className="text-sm text-gray-400">Longer</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#9945FF]/5 border border-[#9945FF]/20 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4 text-[#9945FF]">Why SPL-402 is faster:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm">
                      <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">No facilitator:</strong>
                        <p className="text-gray-400">Payments go directly from payer to recipient wallet. No third-party payment processor in between means no additional API calls or processing delays.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Minimal verification:</strong>
                        <p className="text-gray-400">Only checks on-chain transaction signature directly. No external service coordination or multi-step verification processes.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Optimized code:</strong>
                        <p className="text-gray-400">Zero external dependencies means no bloat. Pure Solana primitives with optimized transaction handling and verification logic.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Local-first:</strong>
                        <p className="text-gray-400">Can verify payments without multiple external RPC calls. Efficient caching and signature verification reduces network overhead.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Dynamic routing:</strong>
                        <p className="text-gray-400">Full support for Express dynamic route parameters and routers. x402 does not support dynamic routing at all.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4 text-[#14F195]">What this means for you:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm">
                      <Zap size={16} className="text-[#9945FF] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Lower costs:</strong>
                        <p className="text-gray-400">Users pay only ~$0.00001 per transaction (Solana network fee) instead of percentage-based platform fees.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <Zap size={16} className="text-[#9945FF] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Better UX:</strong>
                        <p className="text-gray-400">Sub-second payment confirmations create a smooth, responsive experience that doesn't frustrate users with long wait times.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <Zap size={16} className="text-[#9945FF] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Simpler setup:</strong>
                        <p className="text-gray-400">No API keys, no third-party accounts, no complex configuration. Just install and configure your wallet address.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <Zap size={16} className="text-[#9945FF] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Full control:</strong>
                        <p className="text-gray-400">Direct wallet-to-wallet payments mean instant settlement with no chargebacks, and you always have full control of your funds.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-black/50 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3">Technical Architecture Difference</h3>
                <div className="space-y-4 text-sm text-gray-300">
                  <div>
                    <strong className="text-white">SPL-402 Architecture:</strong>
                    <p className="mt-1">Client → Your API → Solana Network (Direct)</p>
                    <p className="text-gray-400 mt-1">Simple, direct payment flow with no intermediaries. Your server verifies transactions directly on Solana.</p>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <strong className="text-white">x402 Architecture:</strong>
                    <p className="mt-1">Client → Your API → x402 Service → Solana Network</p>
                    <p className="text-gray-400 mt-1">Additional layer adds latency, requires API keys, and introduces a potential single point of failure.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'installation' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black mb-4">Installation</h1>
                <p className="text-xl text-gray-400">
                  Install SPL-402 and its peer dependencies
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Server Installation</h2>
                <p className="text-gray-300 mb-4 text-sm">
                  For Node.js/Express servers:
                </p>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-mono">Terminal</span>
                    <button
                      onClick={() => handleCopy('npm install spl402', 'npm')}
                      className="flex items-center gap-2 text-xs text-[#14F195] hover:text-[#14F195]/80"
                    >
                      {copiedCode === 'npm' ? <Check size={14} /> : <Copy size={14} />}
                      {copiedCode === 'npm' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="p-6 text-sm overflow-x-auto">
                    <code className="font-mono text-[#14F195]">npm install spl402</code>
                  </pre>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Client Installation (React/Next.js)</h2>
                <p className="text-gray-300 mb-4 text-sm">
                  For React or Next.js applications, install SPL-402 along with Solana wallet adapter packages:
                </p>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-mono">Terminal</span>
                    <button
                      onClick={() => handleCopy('npm install spl402 @solana/web3.js @solana/spl-token bs58\nnpm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets', 'yarn')}
                      className="flex items-center gap-2 text-xs text-[#14F195] hover:text-[#14F195]/80"
                    >
                      {copiedCode === 'yarn' ? <Check size={14} /> : <Copy size={14} />}
                      {copiedCode === 'yarn' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="p-6 text-sm overflow-x-auto">
                    <code className="font-mono text-[#14F195]">npm install spl402 @solana/web3.js @solana/spl-token bs58{'\n'}npm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets</code>
                  </pre>
                </div>
              </div>

              <div className="bg-[#9945FF]/5 border border-[#9945FF]/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3 text-[#9945FF]">Peer Dependencies</h3>
                <p className="text-gray-300 text-sm mb-3">
                  SPL-402 has zero direct dependencies for minimal bundle size. The following are peer dependencies:
                </p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span><code className="px-2 py-1 bg-black/50 rounded text-[#14F195]">@solana/web3.js</code> - Core Solana blockchain interaction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span><code className="px-2 py-1 bg-black/50 rounded text-[#14F195]">@solana/spl-token</code> - SPL token transfer operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span><code className="px-2 py-1 bg-black/50 rounded text-[#14F195]">bs58</code> - Base58 encoding/decoding for signatures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span><code className="px-2 py-1 bg-black/50 rounded text-[#14F195]">react</code> - Optional, only for React hooks</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'server-setup' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black mb-4">Server Setup</h1>
                <p className="text-xl text-gray-400">
                  Configure SPL-402 middleware on your server
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold mb-3 text-red-400">⚠️ Important: Custom RPC Required</h3>
                <p className="text-gray-300 mb-3">
                  The default Solana public RPC has strict rate limits and will not work reliably in production.
                  You <strong className="text-white">must</strong> use a custom RPC endpoint from providers like Helius, QuickNode, or Alchemy.
                </p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Helius</strong> (recommended): https://www.helius.dev - 100 req/sec free tier</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">QuickNode:</strong> https://www.quicknode.com - 30M credits/month free</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Alchemy:</strong> https://www.alchemy.com - 300M compute units/month free</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[#14F195]/10 to-[#9945FF]/10 border border-[#9945FF]/20 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold mb-3 text-[#14F195]">Key Features</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Express Router Support:</strong> Works seamlessly with Express Router for modular route organization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Route Parameters:</strong> Full support for dynamic route parameters (e.g., /api/user/:id)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Mixed Routes:</strong> Combine free and paid routes in the same application</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Simplified Verification:</strong> Automatic payment verification with built-in replay attack prevention</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Express Setup</h2>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-mono">server.js</span>
                    <button
                      onClick={() => handleCopy(`import { createServer, createExpressMiddleware } from 'spl402';
import express from 'express';

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: process.env.RECIPIENT_WALLET,
  rpcUrl: process.env.SOLANA_RPC_URL,
  routes: [
    { path: '/api/premium', price: 0.001 },
    { path: '/api/data', price: 0.0005 },
  ],
});

const app = express();
app.use(createExpressMiddleware(spl402));

app.get('/api/premium', (req, res) => {
  res.json({ message: 'Premium content' });
});

app.listen(3000);`, 'express')}
                      className="flex items-center gap-2 text-xs text-[#9945FF] hover:text-[#9945FF]/80"
                    >
                      {copiedCode === 'express' ? <Check size={14} /> : <Copy size={14} />}
                      {copiedCode === 'express' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="p-6 text-sm overflow-x-auto">
                    <code className="font-mono text-gray-300">{`import { createServer, createExpressMiddleware } from 'spl402';
import express from 'express';

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: process.env.RECIPIENT_WALLET,
  rpcUrl: process.env.SOLANA_RPC_URL,
  routes: [
    { path: '/api/premium', price: 0.001 },
    { path: '/api/data', price: 0.0005 },
  ],
});

const app = express();
app.use(createExpressMiddleware(spl402));

app.get('/api/premium', (req, res) => {
  res.json({ message: 'Premium content' });
});

app.listen(3000);`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Configuration Options</h2>
                <div className="bg-[#0D0D0D] border border-white/10 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead className="bg-[#0A0A0A]">
                        <tr className="border-b border-white/10">
                          <th className="text-left p-4 text-sm font-semibold">Option</th>
                          <th className="text-left p-4 text-sm font-semibold">Type</th>
                          <th className="text-left p-4 text-sm font-semibold">Required</th>
                          <th className="text-left p-4 text-sm font-semibold">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-b border-white/10">
                          <td className="p-4 font-mono text-[#14F195]">network</td>
                          <td className="p-4 text-gray-400">string</td>
                          <td className="p-4 text-[#14F195]">Yes</td>
                          <td className="p-4 text-gray-400">Solana network (mainnet-beta, devnet, testnet)</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="p-4 font-mono text-[#14F195]">recipientAddress</td>
                          <td className="p-4 text-gray-400">string</td>
                          <td className="p-4 text-[#14F195]">Yes</td>
                          <td className="p-4 text-gray-400">Your Solana wallet address to receive payments</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="p-4 font-mono text-[#14F195]">rpcUrl</td>
                          <td className="p-4 text-gray-400">string</td>
                          <td className="p-4 text-gray-400">Optional</td>
                          <td className="p-4 text-gray-400">Custom Solana RPC endpoint URL (highly recommended)</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="p-4 font-mono text-[#14F195]">routes</td>
                          <td className="p-4 text-gray-400">array</td>
                          <td className="p-4 text-[#14F195]">Yes</td>
                          <td className="p-4 text-gray-400">Array of route configs with path and price</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="p-4 font-mono text-[#14F195]">scheme</td>
                          <td className="p-4 text-gray-400">string</td>
                          <td className="p-4 text-gray-400">Optional</td>
                          <td className="p-4 text-gray-400">'transfer' (SOL) or 'token-transfer' (SPL tokens)</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="p-4 font-mono text-[#14F195]">mint</td>
                          <td className="p-4 text-gray-400">string</td>
                          <td className="p-4 text-gray-400">If tokens</td>
                          <td className="p-4 text-gray-400">Token mint address (required for token-transfer)</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-mono text-[#14F195]">decimals</td>
                          <td className="p-4 text-gray-400">number</td>
                          <td className="p-4 text-gray-400">If tokens</td>
                          <td className="p-4 text-gray-400">Token decimals (required for token-transfer)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3 text-[#14F195]">Server Environment Variables</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Create a <code className="px-2 py-1 bg-black/50 rounded text-[#14F195]">.env</code> file in your server directory:
                </p>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm space-y-1">
                  <div className="text-gray-400">PORT=3001</div>
                  <div className="text-gray-400">RECIPIENT_WALLET=your_solana_wallet_address_here</div>
                  <div className="text-gray-400">SOLANA_RPC_URL=https://your-rpc-endpoint.com  # Get from helius.dev or quicknode.com</div>
                  <div className="text-gray-400">FRONTEND_URL=https://your-frontend.vercel.app</div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'client-setup' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black mb-4">Client Setup</h1>
                <p className="text-xl text-gray-400">
                  Use SPL-402 in your React application
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#14F195]/10 to-[#9945FF]/10 border border-[#9945FF]/20 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold mb-3 text-[#14F195]">Smart Client Detection</h3>
                <p className="text-gray-300 mb-3">
                  The <code className="px-2 py-1 bg-black/50 rounded text-[#14F195]">useSPL402</code> hook is a smart client that automatically detects and uses whatever payment scheme the server requires.
                </p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span>Automatically detects if server requires SOL or SPL tokens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span>Reads scheme, mint, and decimals from 402 response</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span>No manual configuration needed on client side</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span>Single client works with any SPL-402 server configuration</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">React Hook Usage</h2>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-mono">PremiumContent.tsx</span>
                    <button
                      onClick={() => handleCopy(`import { useSPL402 } from 'spl402';
import { useWallet } from '@solana/wallet-adapter-react';

function PremiumContent() {
  const { publicKey, signAndSendTransaction } = useWallet();

  const { makeRequest, loading, error } = useSPL402({
    network: 'mainnet-beta',
    rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL,
  });

  const fetchPremiumData = async () => {
    try {
      const response = await makeRequest('/api/premium', {
        publicKey,
        signAndSendTransaction,
      });
      const data = await response.json();
      console.log('Premium data:', data);
    } catch (err) {
      console.error('Failed to fetch:', err);
    }
  };

  return (
    <div>
      <button
        onClick={fetchPremiumData}
        disabled={loading || !publicKey}
      >
        {loading ? 'Processing...' : 'Get Premium Data (0.001 SOL)'}
      </button>
      {error && <p className="error">{error.message}</p>}
    </div>
  );
}`, 'react')}
                      className="flex items-center gap-2 text-xs text-[#14F195] hover:text-[#14F195]/80"
                    >
                      {copiedCode === 'react' ? <Check size={14} /> : <Copy size={14} />}
                      {copiedCode === 'react' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="p-6 text-sm overflow-x-auto">
                    <code className="font-mono text-gray-300">{`import { useSPL402 } from 'spl402';
import { useWallet } from '@solana/wallet-adapter-react';

function PremiumContent() {
  const { publicKey, signAndSendTransaction } = useWallet();

  const { makeRequest, loading, error } = useSPL402({
    network: 'mainnet-beta',
    rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL,
  });

  const fetchPremiumData = async () => {
    try {
      const response = await makeRequest('/api/premium', {
        publicKey,
        signAndSendTransaction,
      });
      const data = await response.json();
      console.log('Premium data:', data);
    } catch (err) {
      console.error('Failed to fetch:', err);
    }
  };

  return (
    <div>
      <button
        onClick={fetchPremiumData}
        disabled={loading || !publicKey}
      >
        {loading ? 'Processing...' : 'Get Premium Data (0.001 SOL)'}
      </button>
      {error && <p className="error">{error.message}</p>}
    </div>
  );
}`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Wallet Setup</h2>
                <p className="text-gray-300 mb-4">
                  You need to set up Solana wallet adapter in your app:
                </p>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-mono">App.tsx</span>
                    <button
                      onClick={() => handleCopy(`import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

const wallets = [new PhantomWalletAdapter()];
const endpoint = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

function App() {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* Your app components */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}`, 'wallet')}
                      className="flex items-center gap-2 text-xs text-[#9945FF] hover:text-[#9945FF]/80"
                    >
                      {copiedCode === 'wallet' ? <Check size={14} /> : <Copy size={14} />}
                      {copiedCode === 'wallet' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="p-6 text-sm overflow-x-auto">
                    <code className="font-mono text-gray-300">{`import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

const wallets = [new PhantomWalletAdapter()];
const endpoint = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

function App() {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* Your app components */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}`}</code>
                  </pre>
                </div>
              </div>

              <div className="bg-[#9945FF]/5 border border-[#9945FF]/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3 text-[#9945FF]">Required Wallet Adapters</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Install the necessary wallet adapter packages:
                </p>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-[#14F195]">
                  npm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets
                </div>
              </div>

              <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3 text-[#14F195]">Client Environment Variables</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Create a <code className="px-2 py-1 bg-black/50 rounded text-[#14F195]">.env</code> file in your client directory:
                </p>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm space-y-1">
                  <div className="text-gray-400">VITE_API_URL=http://localhost:3001</div>
                  <div className="text-gray-400">VITE_SOLANA_RPC_URL=https://your-rpc-endpoint.com  # Get from helius.dev</div>
                </div>
                <p className="text-gray-300 text-sm mt-3">
                  <strong className="text-white">Note:</strong> For Vite projects, environment variables must be prefixed with <code className="px-2 py-1 bg-black/50 rounded text-[#14F195]">VITE_</code>
                </p>
              </div>
            </div>
          )}

          {activeSection === 'token-transfers' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black mb-4">Token Transfers</h1>
                <p className="text-xl text-gray-400">
                  Accept SPL tokens like USDC, USDT, or custom tokens
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-3">About SPL Token Payments</h3>
                <p className="text-gray-300 mb-4">
                  SPL-402 supports both native SOL transfers and SPL token transfers. This allows you to accept
                  stablecoins like USDC or USDT, or even your own custom tokens.
                </p>
                <p className="text-gray-300">
                  <strong className="text-[#14F195]">Smart Client Detection:</strong> The useSPL402 hook automatically detects
                  and uses whatever payment scheme your server requires. No need to manually configure scheme, mint, or decimals on the client.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Server Configuration for Tokens</h2>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-mono">token-server.js</span>
                    <button
                      onClick={() => handleCopy(`import { createServer, createExpressMiddleware } from 'spl402';
import express from 'express';

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: process.env.RECIPIENT_WALLET,
  rpcUrl: process.env.SOLANA_RPC_URL,
  scheme: 'token-transfer',
  mint: 'DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump', // SPL402 token
  decimals: 6,
  routes: [
    { path: '/api/premium', price: 10 },  // 10 SPL402 tokens
    { path: '/api/data', price: 5 },      // 5 SPL402 tokens
  ],
});

const app = express();
app.use(createExpressMiddleware(spl402));

app.get('/api/premium', (req, res) => {
  res.json({ message: 'Premium content paid with tokens!' });
});

app.listen(3000);`, 'token-server')}
                      className="flex items-center gap-2 text-xs text-[#9945FF] hover:text-[#9945FF]/80"
                    >
                      {copiedCode === 'token-server' ? <Check size={14} /> : <Copy size={14} />}
                      {copiedCode === 'token-server' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="p-6 text-sm overflow-x-auto">
                    <code className="font-mono text-gray-300">{`import { createServer, createExpressMiddleware } from 'spl402';
import express from 'express';

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: process.env.RECIPIENT_WALLET,
  rpcUrl: process.env.SOLANA_RPC_URL,
  scheme: 'token-transfer',
  mint: 'DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump', // SPL402 token
  decimals: 6,
  routes: [
    { path: '/api/premium', price: 10 },  // 10 SPL402 tokens
    { path: '/api/data', price: 5 },      // 5 SPL402 tokens
  ],
});

const app = express();
app.use(createExpressMiddleware(spl402));

app.get('/api/premium', (req, res) => {
  res.json({ message: 'Premium content paid with tokens!' });
});

app.listen(3000);`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Common SPL Tokens</h2>
                <div className="bg-[#0D0D0D] border border-white/10 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                      <thead>
                        <tr className="border-b border-white/10 bg-[#0A0A0A]">
                          <th className="text-left p-4 text-sm font-semibold">Token</th>
                          <th className="text-left p-4 text-sm font-semibold">Decimals</th>
                          <th className="text-left p-4 text-sm font-semibold">Mint Address</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="p-4 font-mono text-[#14F195]">SPL402</td>
                          <td className="p-4 text-gray-400">6</td>
                          <td className="p-4 text-gray-400 font-mono text-xs">DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump</td>
                        </tr>
                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="p-4 font-mono text-[#14F195]">USDC</td>
                          <td className="p-4 text-gray-400">6</td>
                          <td className="p-4 text-gray-400 font-mono text-xs">EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v</td>
                        </tr>
                        <tr className="hover:bg-white/5">
                          <td className="p-4 font-mono text-[#14F195]">USDT</td>
                          <td className="p-4 text-gray-400">6</td>
                          <td className="p-4 text-gray-400 font-mono text-xs">Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3 text-[#14F195]">Important Notes</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Decimals matter:</strong> Always specify the correct decimals for your token.
                      Most tokens use 6 or 9 decimals.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">ATA creation:</strong> SPL-402 automatically creates associated token accounts
                      if they don't exist for the recipient.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">User balance:</strong> Ensure users have sufficient token balance plus SOL
                      for transaction fees.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black mb-4">Security</h1>
                <p className="text-xl text-gray-400">
                  Built-in security features and best practices
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-3">Security-First Design</h3>
                <p className="text-gray-300 mb-4">
                  SPL-402 is built with security at its core. All payments are verified on-chain with multiple
                  layers of protection against common attacks.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Built-in Security Features</h2>
                <div className="space-y-4">
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-2 text-[#14F195]">Replay Attack Prevention</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Every transaction signature is cached and checked. If a signature has been used before,
                      the payment is rejected automatically.
                    </p>
                    <div className="bg-black/50 rounded-lg p-4 text-xs text-gray-300">
                      <div>Cache size: 10,000 signatures</div>
                      <div>Cache expiry: 5 minutes</div>
                      <div>Memory-based: No database required</div>
                    </div>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-2 text-[#14F195]">On-Chain Verification</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      All payments are verified directly on Solana blockchain. The server checks:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>Transaction exists on-chain</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>Transaction is confirmed (not pending)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>Transaction didn't fail or error</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>Exact payment amount matches expected price</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>Payment went to correct recipient address</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-2 text-[#14F195]">Timestamp Validation</h3>
                    <p className="text-sm text-gray-400">
                      Payment timestamps are validated with a 5-minute window. This prevents old transaction
                      signatures from being replayed after cache expiry.
                    </p>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-2 text-[#14F195]">Signature Verification</h3>
                    <p className="text-sm text-gray-400">
                      All transaction signatures are cryptographically validated using Solana's base58 encoding.
                      Invalid signatures are rejected immediately.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
                <div className="space-y-4">
                  <div className="bg-[#9945FF]/5 border border-[#9945FF]/20 rounded-xl p-6">
                    <h3 className="font-bold mb-3 text-[#9945FF]">Critical Security Rules</h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-[#9945FF]/20 rounded flex items-center justify-center flex-shrink-0 text-[#9945FF] font-bold text-xs">
                          1
                        </div>
                        <div>
                          <strong className="text-white">Server-side verification only:</strong>
                          <p className="text-gray-400 mt-1">Never trust client-side payment claims. Always verify transactions on your server.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-[#9945FF]/20 rounded flex items-center justify-center flex-shrink-0 text-[#9945FF] font-bold text-xs">
                          2
                        </div>
                        <div>
                          <strong className="text-white">HTTPS required:</strong>
                          <p className="text-gray-400 mt-1">Always use HTTPS in production to prevent payment data interception.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-[#9945FF]/20 rounded flex items-center justify-center flex-shrink-0 text-[#9945FF] font-bold text-xs">
                          3
                        </div>
                        <div>
                          <strong className="text-white">Custom RPC endpoint:</strong>
                          <p className="text-gray-400 mt-1">Use a private RPC endpoint (Helius, QuickNode, Alchemy) to avoid rate limits and ensure reliability.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-[#9945FF]/20 rounded flex items-center justify-center flex-shrink-0 text-[#9945FF] font-bold text-xs">
                          4
                        </div>
                        <div>
                          <strong className="text-white">Rate limiting:</strong>
                          <p className="text-gray-400 mt-1">Implement rate limiting to prevent abuse and excessive verification requests.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-[#9945FF]/20 rounded flex items-center justify-center flex-shrink-0 text-[#9945FF] font-bold text-xs">
                          5
                        </div>
                        <div>
                          <strong className="text-white">Monitor transactions:</strong>
                          <p className="text-gray-400 mt-1">Keep logs of all payment attempts and watch for unusual patterns.</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-6">
                    <h3 className="font-bold mb-3 text-[#14F195]">What SPL-402 Handles for You</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>Cryptographic signature verification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>Exact payment amount validation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>Replay attack prevention</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>Recipient address verification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>Transaction confirmation status checks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>Network and payment scheme validation</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3">Verification Performance</h3>
                <p className="text-gray-300 text-sm mb-4">
                  SPL-402 verification is optimized for both speed and security:
                </p>
                <div className="space-y-3 text-sm">
                  <div className="bg-[#0D0D0D] rounded-lg p-4">
                    <strong className="text-white">Step 1: Signature existence check</strong>
                    <p className="text-gray-400 mt-1">Verifies transaction exists and is confirmed on-chain</p>
                  </div>
                  <div className="bg-[#0D0D0D] rounded-lg p-4">
                    <strong className="text-white">Step 2: Amount and recipient validation</strong>
                    <p className="text-gray-400 mt-1">Validates exact payment amount and recipient address</p>
                  </div>
                  <div className="bg-[#0D0D0D] rounded-lg p-4">
                    <strong className="text-white">Typical verification time: ~500-1000ms</strong>
                    <p className="text-gray-400 mt-1">Fast on-chain verification with in-memory replay attack prevention</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'whitepaper' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black mb-4">SPL402 Whitepaper</h1>
                <p className="text-xl text-gray-400">
                  Decentralized Payment Protocol for AI Agents and APIs
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold mb-2">Document Information</h3>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div><strong className="text-white">Author:</strong> Astrohacker</div>
                      <div><strong className="text-white">Network:</strong> Solana mainnet-beta</div>
                      <div><strong className="text-white">Token:</strong> SPL402 (DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump)</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
                <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                  <p className="text-gray-300 leading-relaxed">
                    SPL402 is a Solana-native decentralized payment protocol designed for AI agents and API services.
                    Unlike x402, which suffers from centralization and reliance on intermediaries like Coinbase, SPL402
                    enables direct on-chain payments verified via Solana signatures. It is open-source, fast, and
                    developer-friendly, allowing AI service providers to integrate payment and access controls without
                    relying on third-party payment processors.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Motivation</h2>
                <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                  <p className="text-gray-300 mb-4">
                    Centralized API payment solutions, such as x402, face several critical limitations:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#14F195] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-white">Single-point-of-failure:</strong>
                        <p className="text-gray-400 text-sm mt-1">A dominant platform can throttle or block payments.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#14F195] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-white">Middleman dependency:</strong>
                        <p className="text-gray-400 text-sm mt-1">Intermediaries control transaction flow and take fees.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#14F195] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-white">Limited decentralization:</strong>
                        <p className="text-gray-400 text-sm mt-1">Agents and developers cannot easily verify or audit transactions on-chain.</p>
                      </div>
                    </li>
                  </ul>
                  <p className="text-gray-300 mt-4">
                    SPL402 addresses these by providing a <strong className="text-[#14F195]">trustless, decentralized, and Solana-native protocol</strong>.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">SPL402 Overview</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-2 text-[#14F195]">Server SDK</h3>
                    <p className="text-sm text-gray-400">
                      Integrates with any API server to verify SPL402 transactions and gate access.
                    </p>
                  </div>
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-2 text-[#14F195]">Client SDK</h3>
                    <p className="text-sm text-gray-400">
                      Integrated by AI agents or applications to initiate and confirm on-chain payments.
                    </p>
                  </div>
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-2 text-[#14F195]">Tokenized Payments</h3>
                    <p className="text-sm text-gray-400">
                      Uses SOL or any SPL token for transactions, enabling direct payment rails without credit cards or banks.
                    </p>
                  </div>
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-2 text-[#14F195]">Solana Verification</h3>
                    <p className="text-sm text-gray-400">
                      All payments are verified with Solana signatures, ensuring security and transparency.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Architecture</h2>
                <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#9945FF]/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[#9945FF]">
                        1
                      </div>
                      <p className="text-sm text-gray-300">
                        Client sends a request to an API endpoint integrated with SPL402 SDK
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#14F195]/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[#14F195]">
                        2
                      </div>
                      <p className="text-sm text-gray-300">
                        Server checks if the client has paid in SPL402 tokens
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#9945FF]/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[#9945FF]">
                        3
                      </div>
                      <p className="text-sm text-gray-300">
                        Server verifies the transaction on Solana mainnet
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#14F195]/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[#14F195]">
                        4
                      </div>
                      <p className="text-sm text-gray-300">
                        Access is granted if payment is confirmed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Transaction Lifecycle</h2>
                <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                  <ol className="space-y-3 text-sm text-gray-300">
                    <li className="flex gap-3">
                      <span className="text-[#14F195] font-bold">1.</span>
                      <div>
                        <strong className="text-white">Wallet connection:</strong> Client connects Solana wallet
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-[#14F195] font-bold">2.</span>
                      <div>
                        <strong className="text-white">Payment initiation:</strong> Client triggers payment via SPL402 SDK
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-[#14F195] font-bold">3.</span>
                      <div>
                        <strong className="text-white">On-chain confirmation:</strong> Transaction recorded on Solana blockchain
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-[#14F195] font-bold">4.</span>
                      <div>
                        <strong className="text-white">Server verification:</strong> Server SDK validates transaction
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-[#14F195] font-bold">5.</span>
                      <div>
                        <strong className="text-white">Access provisioned:</strong> API response delivered
                      </div>
                    </li>
                  </ol>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Decentralized API Network Vision</h2>
                <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-2xl p-6">
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-start gap-3">
                      <Check size={18} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Peer-to-peer server connections:</strong> SPL402 servers can communicate and verify each other
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check size={18} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Verified online network:</strong> Clients and developers can query which servers are authenticated
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check size={18} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Censorship resistance:</strong> No single entity controls access or payments
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check size={18} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Scalability:</strong> Each server contributes to network throughput
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Security & Verification Layer</h2>
                <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#14F195] rounded-full mt-2 flex-shrink-0"></div>
                      <span>All SPL402 payments are <strong className="text-white">on-chain</strong>, eliminating middleman risk</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#14F195] rounded-full mt-2 flex-shrink-0"></div>
                      <span>Servers enforce <strong className="text-white">wallet verification</strong> and <strong className="text-white">transaction signature checks</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#14F195] rounded-full mt-2 flex-shrink-0"></div>
                      <span>Future SAS integration ensures server authenticity and auditability</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Token Utility (SPL402)</h2>
                <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold mb-2 text-[#14F195]">Payment Medium</h3>
                      <p className="text-sm text-gray-400">Required for premium API tiers</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2 text-[#14F195]">Governance (Future)</h3>
                      <p className="text-sm text-gray-400">Token holders can vote on network upgrades</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2 text-[#14F195]">Access Control</h3>
                      <p className="text-sm text-gray-400">Server SDK enforces payment and attestation verification</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Roadmap & Ecosystem</h2>
                <div className="space-y-3">
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#14F195]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Check size={18} className="text-[#14F195]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-1">Phase 1: Foundation</h3>
                      <p className="text-xs text-gray-400">Mainnet deployment, SDK integration with client & server</p>
                    </div>
                  </div>
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#14F195]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Check size={18} className="text-[#14F195]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-1">Phase 2: Starter Kit & Templates</h3>
                      <p className="text-xs text-gray-400">AI Agents Marketplace, GPT-420 AI Agent, API Data App template</p>
                    </div>
                  </div>
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#14F195]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Check size={18} className="text-[#14F195]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-1">Phase 3: SAS Attestation</h3>
                      <p className="text-xs text-gray-400">Support for automated server verification</p>
                    </div>
                  </div>
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#9945FF]/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[#9945FF] text-xs">
                      ...
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-1">Phase 4: Decentralized Network</h3>
                      <p className="text-xs text-gray-400">P2P verification and network expansion</p>
                    </div>
                  </div>
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#9945FF]/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[#9945FF] text-xs">
                      ...
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-1">Phase 5: DAO Governance</h3>
                      <p className="text-xs text-gray-400">Community-driven protocol development</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-3">Learn More</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <a
                    href="https://www.npmjs.com/package/spl402"
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-3 bg-black/50 hover:bg-black/70 rounded-lg transition-colors text-sm"
                  >
                    <Code size={18} className="text-[#14F195]" />
                    <span>NPM Package</span>
                    <ArrowRight size={16} className="ml-auto" />
                  </a>
                  <a
                    href="https://github.com/astrohackerx/spl402"
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-3 bg-black/50 hover:bg-black/70 rounded-lg transition-colors text-sm"
                  >
                    <Github size={18} className="text-[#14F195]" />
                    <span>GitHub</span>
                    <ArrowRight size={16} className="ml-auto" />
                  </a>
                  <a
                    href="https://solana.com"
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-3 bg-black/50 hover:bg-black/70 rounded-lg transition-colors text-sm"
                  >
                    <Server size={18} className="text-[#14F195]" />
                    <span>Solana</span>
                    <ArrowRight size={16} className="ml-auto" />
                  </a>
                  <a
                    href="https://x.com/spl402"
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-3 bg-black/50 hover:bg-black/70 rounded-lg transition-colors text-sm"
                  >
                    <span className="text-[#14F195]">𝕏</span>
                    <span>Follow on X</span>
                    <ArrowRight size={16} className="ml-auto" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'api-reference' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black mb-4">API Reference</h1>
                <p className="text-xl text-gray-400">
                  Complete API documentation for SPL-402
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Server API</h2>

                <div className="space-y-6">
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-2 text-[#14F195]">createServer(config)</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Creates a new SPL-402 server instance with the specified configuration.
                    </p>
                    <div className="bg-black/50 rounded-lg p-4 mb-4">
                      <code className="font-mono text-sm text-gray-300">
                        {`const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'your_wallet',
  rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL,
  routes: [
    { path: '/api/premium', price: 0.001 }
  ]
});`}
                      </code>
                    </div>
                    <div className="text-sm">
                      <strong className="text-white">Returns:</strong>
                      <span className="text-gray-400 ml-2">SPL402Server instance</span>
                    </div>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-2 text-[#14F195]">createExpressMiddleware(server)</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Creates Express middleware from an SPL-402 server instance.
                    </p>
                    <div className="bg-black/50 rounded-lg p-4 mb-4">
                      <code className="font-mono text-sm text-gray-300">
                        {`const middleware = createExpressMiddleware(spl402);
app.use(middleware);`}
                      </code>
                    </div>
                    <div className="text-sm">
                      <strong className="text-white">Returns:</strong>
                      <span className="text-gray-400 ml-2">Express middleware function</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Client API</h2>

                <div className="space-y-6">
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-2 text-[#14F195]">useSPL402(config)</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      React hook for making payment-protected API requests.
                    </p>
                    <div className="bg-black/50 rounded-lg p-4 mb-4">
                      <code className="font-mono text-sm text-gray-300">
                        {`const { makeRequest, loading, error } = useSPL402({
  network: 'mainnet-beta',
  rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL,
});`}
                      </code>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong className="text-white">Returns:</strong>
                      </div>
                      <ul className="list-disc list-inside text-gray-400 ml-4 space-y-1">
                        <li><code className="text-[#14F195]">makeRequest</code> - Function to make payment-protected requests</li>
                        <li><code className="text-[#14F195]">loading</code> - Boolean indicating if payment is processing</li>
                        <li><code className="text-[#14F195]">error</code> - Error object if payment fails</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-2 text-[#14F195]">makeRequest(url, walletOptions)</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Makes a payment-protected request to the specified URL.
                    </p>
                    <div className="bg-black/50 rounded-lg p-4 mb-4">
                      <code className="font-mono text-sm text-gray-300">
                        {`const response = await makeRequest('/api/premium', {
  publicKey,
  signAndSendTransaction,
});`}
                      </code>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong className="text-white">Parameters:</strong>
                      </div>
                      <ul className="list-disc list-inside text-gray-400 ml-4 space-y-1">
                        <li><code className="text-[#14F195]">url</code> - API endpoint URL</li>
                        <li><code className="text-[#14F195]">walletOptions</code> - Object with publicKey and signAndSendTransaction from useWallet()</li>
                      </ul>
                      <div className="mt-3">
                        <strong className="text-white">Returns:</strong>
                        <span className="text-gray-400 ml-2">Promise&lt;Response&gt;</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-3">Need Help?</h3>
                <p className="text-gray-300 mb-4">
                  Check out our GitHub repository for more examples and community support.
                </p>
                <a
                  href="https://github.com/astrohackerx/spl402"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 rounded-lg font-semibold transition-opacity"
                >
                  <Github size={18} />
                  View on GitHub
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
