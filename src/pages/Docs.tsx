import { useState } from 'react';
import { Logo } from '../components/Logo';
import { Book, Code, Server, Wallet, ArrowRight, Github, ChevronRight, Copy, Check, Zap, Menu, X } from 'lucide-react';

export default function Docs() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { id: 'api-reference', label: 'API Reference', icon: Code },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-[#14F195]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />

          <nav className="hidden lg:flex items-center gap-8">
            <a href="/" className="text-gray-400 hover:text-[#14F195] transition-colors text-sm">Home</a>
            <a href="/docs" className="text-[#14F195] transition-colors text-sm font-medium">Docs</a>
            <a
              href="https://github.com/astrohackerx/spl402"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-[#9945FF] hover:bg-[#9945FF]/80 rounded-lg transition-colors text-sm font-medium"
            >
              <Github size={16} />
              GitHub
            </a>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl">
            <nav className="flex flex-col px-4 py-4 space-y-3">
              <a href="/" className="text-gray-400 hover:text-[#14F195] transition-colors text-sm py-2" onClick={() => setMobileMenuOpen(false)}>Home</a>
              <a href="/docs" className="text-[#14F195] transition-colors text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Docs</a>
              <a
                href="https://github.com/astrohackerx/spl402"
                target="_blank"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#9945FF] hover:bg-[#9945FF]/80 rounded-lg transition-colors text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Github size={16} />
                GitHub
              </a>
            </nav>
          </div>
        )}
      </header>

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
                    <span>Direct wallet-to-wallet transfers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={18} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span>Zero platform fees (only ~$0.00001 Solana network fee)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={18} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span>~500ms payment verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={18} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span>Works with standard HTTP/fetch APIs</span>
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

              <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-3">Performance Advantage</h3>
                <p className="text-gray-300 mb-4">
                  SPL-402 achieves 3-4x faster payment verification through architectural improvements and direct blockchain interaction.
                  Our average verification time is ~500ms compared to x402's ~2000ms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Feature Comparison</h2>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 bg-[#0D0D0D]">
                          <th className="text-left p-4 text-gray-400 font-semibold">Feature</th>
                          <th className="text-left p-4 text-[#14F195] font-semibold">SPL-402</th>
                          <th className="text-left p-4 text-gray-400 font-semibold">x402</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="p-4 text-gray-400">Latency</td>
                          <td className="p-4 text-[#14F195] font-bold">~500ms</td>
                          <td className="p-4 text-gray-400">~2000ms</td>
                        </tr>
                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="p-4 text-gray-400">Platform Fees</td>
                          <td className="p-4 text-[#14F195] font-bold">0%</td>
                          <td className="p-4 text-gray-400">Variable</td>
                        </tr>
                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="p-4 text-gray-400">Dependencies</td>
                          <td className="p-4 text-[#14F195] font-bold">0 (peer only)</td>
                          <td className="p-4 text-gray-400">Multiple</td>
                        </tr>
                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="p-4 text-gray-400">Transaction Cost</td>
                          <td className="p-4 text-[#14F195] font-bold">~$0.00001</td>
                          <td className="p-4 text-gray-400">Higher</td>
                        </tr>
                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="p-4 text-gray-400">Speed</td>
                          <td className="p-4 text-[#14F195] font-bold">3-4x faster</td>
                          <td className="p-4 text-gray-400">Baseline</td>
                        </tr>
                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="p-4 text-gray-400">Middleman</td>
                          <td className="p-4 text-[#14F195] font-bold">None</td>
                          <td className="p-4 text-gray-400">Yes</td>
                        </tr>
                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="p-4 text-gray-400">API Keys</td>
                          <td className="p-4 text-[#14F195] font-bold">Not required</td>
                          <td className="p-4 text-gray-400">Required</td>
                        </tr>
                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="p-4 text-gray-400">Setup Time</td>
                          <td className="p-4 text-[#14F195] font-bold">&lt; 5 minutes</td>
                          <td className="p-4 text-gray-400">Longer</td>
                        </tr>
                        <tr className="hover:bg-white/5">
                          <td className="p-4 text-gray-400">Bundle Size</td>
                          <td className="p-4 text-[#14F195] font-bold">Minimal</td>
                          <td className="p-4 text-gray-400">Larger</td>
                        </tr>
                      </tbody>
                    </table>
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
                <h2 className="text-2xl font-bold mb-4">Using npm</h2>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-mono">Terminal</span>
                    <button
                      onClick={() => handleCopy('npm install spl402 @solana/web3.js', 'npm')}
                      className="flex items-center gap-2 text-xs text-[#14F195] hover:text-[#14F195]/80"
                    >
                      {copiedCode === 'npm' ? <Check size={14} /> : <Copy size={14} />}
                      {copiedCode === 'npm' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="p-6 text-sm overflow-x-auto">
                    <code className="font-mono text-[#14F195]">npm install spl402 @solana/web3.js</code>
                  </pre>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Using yarn</h2>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-mono">Terminal</span>
                    <button
                      onClick={() => handleCopy('yarn add spl402 @solana/web3.js', 'yarn')}
                      className="flex items-center gap-2 text-xs text-[#14F195] hover:text-[#14F195]/80"
                    >
                      {copiedCode === 'yarn' ? <Check size={14} /> : <Copy size={14} />}
                      {copiedCode === 'yarn' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="p-6 text-sm overflow-x-auto">
                    <code className="font-mono text-[#14F195]">yarn add spl402 @solana/web3.js</code>
                  </pre>
                </div>
              </div>

              <div className="bg-[#9945FF]/5 border border-[#9945FF]/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3 text-[#9945FF]">Note on Dependencies</h3>
                <p className="text-gray-300 text-sm">
                  SPL-402 has zero direct dependencies. <code className="px-2 py-1 bg-black/50 rounded text-[#14F195]">@solana/web3.js</code> is
                  a peer dependency, meaning you need to install it separately. This keeps the bundle size minimal.
                </p>
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
                  <table className="w-full">
                    <thead className="bg-[#0A0A0A]">
                      <tr className="border-b border-white/10">
                        <th className="text-left p-4 text-sm font-semibold">Option</th>
                        <th className="text-left p-4 text-sm font-semibold">Type</th>
                        <th className="text-left p-4 text-sm font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b border-white/10">
                        <td className="p-4 font-mono text-[#14F195]">network</td>
                        <td className="p-4 text-gray-400">string</td>
                        <td className="p-4 text-gray-400">Solana network (mainnet-beta, devnet, testnet)</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="p-4 font-mono text-[#14F195]">recipientAddress</td>
                        <td className="p-4 text-gray-400">string</td>
                        <td className="p-4 text-gray-400">Your Solana wallet address to receive payments</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="p-4 font-mono text-[#14F195]">rpcUrl</td>
                        <td className="p-4 text-gray-400">string</td>
                        <td className="p-4 text-gray-400">Solana RPC endpoint URL</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-mono text-[#14F195]">routes</td>
                        <td className="p-4 text-gray-400">array</td>
                        <td className="p-4 text-gray-400">Array of route configs (path and price in SOL)</td>
                      </tr>
                    </tbody>
                  </table>
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
                  <div className="text-gray-400">SOLANA_RPC_URL=https://api.mainnet-beta.solana.com</div>
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
    rpcUrl: process.env.REACT_APP_SOLANA_RPC_URL,
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
    rpcUrl: process.env.REACT_APP_SOLANA_RPC_URL,
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
const endpoint = 'https://api.mainnet-beta.solana.com';

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
const endpoint = 'https://api.mainnet-beta.solana.com';

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
                  <div className="text-gray-400">VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com</div>
                </div>
                <p className="text-gray-300 text-sm mt-3">
                  <strong className="text-white">Note:</strong> For Vite projects, environment variables must be prefixed with <code className="px-2 py-1 bg-black/50 rounded text-[#14F195]">VITE_</code>
                </p>
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
  rpcUrl: 'https://api.mainnet-beta.solana.com',
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
  rpcUrl: process.env.REACT_APP_SOLANA_RPC_URL,
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
    </div>
  );
}
