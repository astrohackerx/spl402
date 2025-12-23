import { useState } from 'react';
import { Book, Code, Server, Wallet, ArrowRight, Github, ChevronRight, Copy, Check, Zap, Lock, Globe } from 'lucide-react';
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
    { id: 'installation', label: 'Installation', icon: Code },
    { id: 'server-setup', label: 'Server Setup', icon: Server },
    { id: 'client-setup', label: 'Client Setup', icon: Wallet },
    { id: 'standard-routes', label: 'Standard Routes', icon: Server },
    { id: 'token-transfers', label: 'Token Transfers', icon: Wallet },
    { id: 'token2022', label: 'Token2022 Support', icon: Zap },
    { id: 'token-gating', label: 'Token-Gated Access', icon: Lock },
    { id: 'sas', label: 'SAS Attestation', icon: Check },
    { id: 'edge-runtime', label: 'Edge Runtime', icon: Globe },
    { id: 'security', label: 'Security', icon: Server },
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
                        <tr className="border-b border-white/10">
                          <td className="p-4 font-mono text-[#14F195]">decimals</td>
                          <td className="p-4 text-gray-400">number</td>
                          <td className="p-4 text-gray-400">If tokens</td>
                          <td className="p-4 text-gray-400">Token decimals (required for token-transfer)</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="p-4 font-mono text-[#14F195]">tokenProgram</td>
                          <td className="p-4 text-gray-400">string</td>
                          <td className="p-4 text-gray-400">Optional</td>
                          <td className="p-4 text-gray-400">'spl-token' (default) or 'token-2022' for Token2022</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-mono text-[#14F195]">serverInfo</td>
                          <td className="p-4 text-gray-400">object</td>
                          <td className="p-4 text-gray-400">Optional</td>
                          <td className="p-4 text-gray-400">Server metadata (name, description, contact, capabilities)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Route Features</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-3">Free Routes (price: 0)</h3>
                    <p className="text-gray-300 mb-4">
                      Mix free and paid routes in the same application by setting price to 0:
                    </p>
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                      <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10">
                        <span className="text-xs text-gray-400 font-mono">Free routes example</span>
                      </div>
                      <pre className="p-6 text-sm overflow-x-auto">
                        <code className="font-mono text-gray-300">{`routes: [
  { path: '/api/premium', price: 0.001 },  // Paid route
  { path: '/api/public', price: 0 },       // FREE route
  { path: '/api/beta', price: 0 },         // FREE route
]`}</code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-3">Dynamic Route Parameters</h3>
                    <p className="text-gray-300 mb-4">
                      Use Express-style dynamic parameters in your routes:
                    </p>
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                      <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10">
                        <span className="text-xs text-gray-400 font-mono">Dynamic routes example</span>
                      </div>
                      <pre className="p-6 text-sm overflow-x-auto">
                        <code className="font-mono text-gray-300">{`routes: [
  { path: '/api/games/:code', price: 0.001 },        // Matches /api/games/abc123
  { path: '/api/users/:id/profile', price: 0.002 },  // Matches /api/users/42/profile
  { path: '/api/posts/:slug', price: 0.0005 },       // Matches /api/posts/my-post
]`}</code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-3">Express Router Support</h3>
                    <p className="text-gray-300 mb-4">
                      Works seamlessly with Express routers - just use full paths in route config:
                    </p>
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                      <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10">
                        <span className="text-xs text-gray-400 font-mono">Router example</span>
                      </div>
                      <pre className="p-6 text-sm overflow-x-auto">
                        <code className="font-mono text-gray-300">{`const apiRouter = express.Router();

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: process.env.RECIPIENT_WALLET,
  routes: [
    { path: '/api/premium', price: 0.001 },  // Full path, not relative
  ]
});

apiRouter.use(createExpressMiddleware(spl402));

apiRouter.get('/premium', (req, res) => {
  res.json({ message: 'Premium content' });
});

app.use('/api', apiRouter);`}</code>
                      </pre>
                    </div>
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

          {activeSection === 'standard-routes' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black mb-4">Standard Routes</h1>
                <p className="text-xl text-gray-400">
                  Free built-in endpoints for every SPL-402 server
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-3">Automatic Endpoints</h3>
                <p className="text-gray-300 mb-4">
                  Every SPL-402 server automatically exposes these free endpoints without any configuration.
                  These routes are useful for monitoring, discovery, and server metadata.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">GET /health</h2>
                <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                  <p className="text-gray-300 mb-4">
                    Health check endpoint for monitoring and uptime verification.
                  </p>
                  <div className="bg-black/50 rounded-lg p-4 mb-4">
                    <div className="text-xs text-gray-400 mb-2">Response Example:</div>
                    <code className="font-mono text-sm text-[#14F195]">
{`{
  "status": "ok",
  "timestamp": 1763322021055
}`}
                    </code>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">GET /status</h2>
                <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                  <p className="text-gray-300 mb-4">
                    Alias for the /health endpoint. Returns the same response format.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">GET /.well-known/spl402.json</h2>
                <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                  <p className="text-gray-300 mb-4">
                    Server metadata endpoint following RFC 8615 well-known URI specification.
                    Clients can query this endpoint to discover server capabilities, pricing, and payment configuration.
                  </p>
                  <div className="bg-black/50 rounded-lg p-4 mb-4">
                    <div className="text-xs text-gray-400 mb-2">Response Example:</div>
                    <code className="font-mono text-xs text-[#14F195]">
{`{
  "version": "1.0",
  "server": {
    "name": "My API Server",
    "description": "Premium data API with SPL-402 payments",
    "contact": "https://myapi.com"
  },
  "wallet": "YourSolanaWalletAddress",
  "network": "mainnet-beta",
  "scheme": "transfer",
  "routes": [
    {
      "path": "/api/premium",
      "method": "GET",
      "price": 0.001
    }
  ],
  "capabilities": ["data-api"]
}`}
                    </code>
                  </div>
                  <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-4">
                    <h4 className="font-bold mb-2 text-[#14F195]">Use Cases</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>API discovery and documentation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>Client auto-configuration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>Server capability advertisement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>Integration with API marketplaces</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Configure Server Metadata</h2>
                <div className="bg-[#0D0D0D] border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-mono">server.js</span>
                  </div>
                  <pre className="p-6 text-sm overflow-x-auto">
                    <code className="font-mono text-gray-300">{`const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: process.env.RECIPIENT_WALLET,
  rpcUrl: process.env.SOLANA_RPC_URL,
  serverInfo: {
    name: 'My API Server',
    description: 'Premium data API',
    contact: 'https://myapi.com',
    capabilities: ['data-api', 'real-time']
  },
  routes: [
    { path: '/api/premium', price: 0.001 }
  ]
});`}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'token2022' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black mb-4">Token2022 Support</h1>
                <p className="text-xl text-gray-400">
                  Support for Solana's next-generation token standard with advanced features
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-3">What is Token2022?</h3>
                <p className="text-gray-300 mb-4">
                  Token2022 (also known as Token Extensions) is Solana's next-generation token standard that supports
                  advanced features like transfer fees, interest-bearing tokens, confidential transfers, and more.
                </p>
                <p className="text-gray-300">
                  SPL-402 fully supports both the legacy SPL-Token program and the Token2022 program, allowing you to
                  accept payments in any token regardless of which program it uses.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">When to Use Token2022</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-2 text-[#9945FF]">SPL-Token (Legacy)</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Use for established tokens that exist on the original SPL-Token program.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <ChevronRight size={16} className="text-[#9945FF] flex-shrink-0 mt-0.5" />
                        <span>USDC</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight size={16} className="text-[#9945FF] flex-shrink-0 mt-0.5" />
                        <span>USDT</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight size={16} className="text-[#9945FF] flex-shrink-0 mt-0.5" />
                        <span>Most existing tokens</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-2 text-[#14F195]">Token2022</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Use for newer tokens with advanced features or tokens you're creating.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>Tokens with transfer fees</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>Interest-bearing tokens</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>New token launches</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Server Configuration</h2>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-mono">token2022-server.js</span>
                  </div>
                  <pre className="p-6 text-sm overflow-x-auto">
                    <code className="font-mono text-gray-300">{`import { createServer, createExpressMiddleware } from 'spl402';
import express from 'express';

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: process.env.RECIPIENT_WALLET,
  rpcUrl: process.env.SOLANA_RPC_URL,
  scheme: 'token-transfer',
  mint: 'YOUR_TOKEN2022_MINT_ADDRESS',
  decimals: 9,
  tokenProgram: 'token-2022',  // Specify Token2022 program
  routes: [
    { path: '/api/premium', price: 100 },
  ],
});

const app = express();
app.use(createExpressMiddleware(spl402));

app.get('/api/premium', (req, res) => {
  res.json({ message: 'Premium content paid with Token2022!' });
});

app.listen(3000);`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Token Gate with Token2022</h2>
                <p className="text-gray-300 mb-4">
                  Token gates also work with Token2022 tokens:
                </p>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10">
                    <span className="text-xs text-gray-400 font-mono">Token gate example</span>
                  </div>
                  <pre className="p-6 text-sm overflow-x-auto">
                    <code className="font-mono text-gray-300">{`routes: [
  {
    path: '/api/exclusive',
    price: 0,
    tokenGate: {
      mint: 'YOUR_TOKEN2022_MINT',
      minimumBalance: 1000,
      tokenProgram: 'token-2022'  // Specify Token2022
    }
  }
]`}</code>
                  </pre>
                </div>
              </div>

              <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3 text-[#14F195]">How It Works</h3>
                <p className="text-gray-300 text-sm mb-3">
                  SPL-402 automatically selects the correct program ID based on the tokenProgram setting:
                </p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span><code className="px-2 py-1 bg-black/50 rounded text-[#14F195]">'spl-token'</code> (default): TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span><code className="px-2 py-1 bg-black/50 rounded text-[#14F195]">'token-2022'</code>: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb</span>
                  </li>
                </ul>
                <p className="text-gray-300 text-sm mt-4">
                  The client automatically handles Token2022 transfers when the server specifies tokenProgram: 'token-2022' in the payment requirement.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'token-gating' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black mb-4">Token-Gated Access</h1>
                <p className="text-xl text-gray-400">
                  Restrict API endpoints to token holders without requiring payment
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-3">What is Token Gating?</h3>
                <p className="text-gray-300 mb-4">
                  Token-gated access allows you to restrict API endpoints to users who hold a minimum balance of a
                  specific token. This is perfect for creating exclusive content for token holders without requiring
                  them to pay per request.
                </p>
                <p className="text-gray-300">
                  Think of it like a membership pass - hold the token, get access to exclusive features.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">How Token Gates Work</h2>
                <div className="space-y-4">
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#9945FF]/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[#9945FF]">
                        1
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Client Includes Wallet Address</h3>
                        <p className="text-sm text-gray-400">Client sends request with X-Wallet-Address header</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#14F195]/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[#14F195]">
                        2
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Server Checks Balance</h3>
                        <p className="text-sm text-gray-400">Server verifies token balance on-chain</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#9945FF]/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[#9945FF]">
                        3
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Access Granted or Denied</h3>
                        <p className="text-sm text-gray-400">If balance meets minimum, access is granted (no payment needed)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Basic Token Gate Setup</h2>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10">
                    <span className="text-xs text-gray-400 font-mono">tokengate-server.js</span>
                  </div>
                  <pre className="p-6 text-sm overflow-x-auto">
                    <code className="font-mono text-gray-300">{`const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: process.env.RECIPIENT_WALLET,
  rpcUrl: process.env.SOLANA_RPC_URL,
  routes: [
    {
      path: '/api/holders-only',
      price: 0,  // Free for token holders!
      tokenGate: {
        mint: 'DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump',
        minimumBalance: 1000  // Must hold at least 1000 tokens
      }
    },
    {
      path: '/api/premium',
      price: 0.001  // Regular paid route
    }
  ]
});`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Payment Fallback</h2>
                <p className="text-gray-300 mb-4">
                  Combine token gates with payment fallback for hybrid access control:
                </p>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10">
                    <span className="text-xs text-gray-400 font-mono">Hybrid access</span>
                  </div>
                  <pre className="p-6 text-sm overflow-x-auto">
                    <code className="font-mono text-gray-300">{`routes: [
  {
    path: '/api/exclusive',
    price: 0.01,  // Pay 0.01 SOL if not a token holder
    tokenGate: {
      mint: 'YOUR_TOKEN_MINT',
      minimumBalance: 500
    }
  }
]

// Token holders (500+ tokens): FREE access
// Non-holders: Must pay 0.01 SOL`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Client-Side Implementation</h2>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10">
                    <span className="text-xs text-gray-400 font-mono">client.ts</span>
                  </div>
                  <pre className="p-6 text-sm overflow-x-auto">
                    <code className="font-mono text-gray-300">{`const response = await fetch('https://api.example.com/api/holders-only', {
  headers: {
    'X-Wallet-Address': wallet.publicKey.toString()
  }
});

if (response.status === 403) {
  const error = await response.json();
  console.log('Token gate failed:', error.message);
  console.log('Required balance:', error.required);
  console.log('Your balance:', error.balance);
}`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Response Format</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-2 text-[#14F195]">Success (200)</h3>
                    <p className="text-sm text-gray-400">
                      Normal response from your endpoint when token balance requirement is met.
                    </p>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-2 text-red-400">Failure (403)</h3>
                    <div className="bg-black/50 rounded-lg p-3 mt-3">
                      <code className="font-mono text-xs text-gray-300">
{`{
  "error": "Token gate authorization failed",
  "message": "Insufficient token balance",
  "required": 1000,
  "balance": 250,
  "mint": "DXgx...pump"
}`}
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Use Cases</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#9945FF]/5 border border-[#9945FF]/20 rounded-xl p-6">
                    <h3 className="font-bold mb-3 text-[#9945FF]">Community Features</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <ChevronRight size={16} className="text-[#9945FF] flex-shrink-0 mt-0.5" />
                        <span>DAO member-only areas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight size={16} className="text-[#9945FF] flex-shrink-0 mt-0.5" />
                        <span>Exclusive content for supporters</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight size={16} className="text-[#9945FF] flex-shrink-0 mt-0.5" />
                        <span>Beta access for early backers</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-6">
                    <h3 className="font-bold mb-3 text-[#14F195]">Tiered Access</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>Bronze/Silver/Gold tiers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>NFT holder benefits</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                        <span>Governance token privileges</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'sas' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black mb-4">SAS Attestation</h1>
                <p className="text-xl text-gray-400">
                  Solana Attestation Service for on-chain server identity verification
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-3">What is SAS?</h3>
                <p className="text-gray-300 mb-4">
                  Solana Attestation Service (SAS) provides cryptographic proof of server identity stored on-chain.
                  It enables clients and AI agents to verify that an API server is legitimate and controlled by the
                  claimed wallet address.
                </p>
                <p className="text-gray-300">
                  Think of it as a decentralized SSL certificate for payment verification - proving that the server
                  accepting payments actually controls the wallet receiving funds.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">What SAS Provides</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <div className="w-12 h-12 bg-[#9945FF]/10 rounded-lg flex items-center justify-center mb-3">
                      <Wallet size={24} className="text-[#9945FF]" />
                    </div>
                    <h3 className="font-bold mb-2">Server Wallet Address</h3>
                    <p className="text-sm text-gray-400">
                      Proves the operator controls the payment recipient wallet
                    </p>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <div className="w-12 h-12 bg-[#14F195]/10 rounded-lg flex items-center justify-center mb-3">
                      <Globe size={24} className="text-[#14F195]" />
                    </div>
                    <h3 className="font-bold mb-2">API Endpoint URL</h3>
                    <p className="text-sm text-gray-400">
                      Links on-chain identity to the API server URL
                    </p>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <div className="w-12 h-12 bg-[#9945FF]/10 rounded-lg flex items-center justify-center mb-3">
                      <Check size={24} className="text-[#9945FF]" />
                    </div>
                    <h3 className="font-bold mb-2">Immutable Timestamp</h3>
                    <p className="text-sm text-gray-400">
                      Permanent record on Solana blockchain
                    </p>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <div className="w-12 h-12 bg-[#14F195]/10 rounded-lg flex items-center justify-center mb-3">
                      <Lock size={24} className="text-[#14F195]" />
                    </div>
                    <h3 className="font-bold mb-2">Public Verification</h3>
                    <p className="text-sm text-gray-400">
                      Anyone can verify attestations on-chain
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Client-Side Verification</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-3">Query All Verified Servers</h3>
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                      <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10">
                        <span className="text-xs text-gray-400 font-mono">Query servers</span>
                      </div>
                      <pre className="p-6 text-sm overflow-x-auto">
                        <code className="font-mono text-gray-300">{`import { queryVerifiedServers } from 'spl402';

const servers = await queryVerifiedServers('mainnet-beta');

servers.forEach(server => {
  console.log('Wallet:', server.wallet);
  console.log('Endpoint:', server.endpoint);
  console.log('Description:', server.description);
});`}</code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-3">Check Server by Wallet Address</h3>
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                      <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10">
                        <span className="text-xs text-gray-400 font-mono">Verify by wallet</span>
                      </div>
                      <pre className="p-6 text-sm overflow-x-auto">
                        <code className="font-mono text-gray-300">{`import { checkAttestationByWallet } from 'spl402';

const result = await checkAttestationByWallet(
  'SERVER_WALLET_ADDRESS',
  'mainnet-beta'
);

if (result.isVerified) {
  console.log('✅ Server verified!');
  console.log('API Endpoint:', result.data?.endpoint);
}`}</code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-3">Check Server by API Endpoint</h3>
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                      <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10">
                        <span className="text-xs text-gray-400 font-mono">Verify by endpoint</span>
                      </div>
                      <pre className="p-6 text-sm overflow-x-auto">
                        <code className="font-mono text-gray-300">{`import { checkAttestationByEndpoint } from 'spl402';

const result = await checkAttestationByEndpoint(
  'https://api.example.com',
  'mainnet-beta'
);

if (result.isVerified) {
  console.log('✅ API server verified!');
  console.log('Wallet:', result.data?.wallet);
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Server Registration</h2>
                <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                  <p className="text-gray-300 mb-4">
                    To register your API server and create an on-chain attestation, visit the SPL402 website
                    and follow the verification process.
                  </p>
                  <a
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 rounded-lg font-semibold transition-opacity"
                  >
                    <Globe size={18} />
                    Register Your Server
                    <ArrowRight size={18} />
                  </a>
                </div>
              </div>

              <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3 text-[#14F195]">Benefits of SAS Attestation</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Trust and transparency:</strong> Clients can verify server ownership before making payments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Decentralized discovery:</strong> Join the growing network of verified API servers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Reputation building:</strong> On-chain history builds credibility over time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">AI agent compatibility:</strong> Enables autonomous agents to discover and verify API providers</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'edge-runtime' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black mb-4">Edge Runtime Support</h1>
                <p className="text-xl text-gray-400">
                  Deploy SPL-402 to Cloudflare Workers, Deno Deploy, Vercel Edge, and more
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-3">Universal Runtime Support</h3>
                <p className="text-gray-300 mb-4">
                  SPL-402 is designed to work everywhere - from traditional Node.js servers to cutting-edge edge runtimes.
                  The same codebase runs on Cloudflare Workers, Deno Deploy, Vercel Edge Functions, and any other
                  environment that supports the Fetch API standard.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Supported Runtimes</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-2 text-[#14F195]">Cloudflare Workers</h3>
                    <p className="text-sm text-gray-400">
                      Global edge network with zero cold starts
                    </p>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-2 text-[#9945FF]">Deno Deploy</h3>
                    <p className="text-sm text-gray-400">
                      Secure TypeScript runtime at the edge
                    </p>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-2 text-[#14F195]">Vercel Edge</h3>
                    <p className="text-sm text-gray-400">
                      Lightning-fast edge functions on Vercel
                    </p>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-2 text-[#9945FF]">Node.js</h3>
                    <p className="text-sm text-gray-400">
                      Traditional servers with Express/Fastify
                    </p>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-2 text-[#14F195]">Bun</h3>
                    <p className="text-sm text-gray-400">
                      Ultra-fast JavaScript runtime
                    </p>
                  </div>

                  <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                    <h3 className="font-bold mb-2 text-[#9945FF]">Any Fetch API</h3>
                    <p className="text-sm text-gray-400">
                      Works with standard Fetch API
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Cloudflare Workers Example</h2>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10">
                    <span className="text-xs text-gray-400 font-mono">worker.ts</span>
                  </div>
                  <pre className="p-6 text-sm overflow-x-auto">
                    <code className="font-mono text-gray-300">{`import { createServer, createFetchMiddleware } from 'spl402';

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: 'YOUR_WALLET_ADDRESS',
  rpcUrl: import.meta.env.SOLANA_RPC_URL,
  routes: [{ path: '/api/data', price: 0.001 }],
});

const middleware = createFetchMiddleware(spl402);

export default {
  async fetch(request: Request) {
    // Check if middleware handles this request
    const middlewareResponse = await middleware(request);
    if (middlewareResponse) return middlewareResponse;

    // Your API logic
    const url = new URL(request.url);
    if (url.pathname === '/api/data') {
      return new Response(
        JSON.stringify({ data: 'Protected content!' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response('Not Found', { status: 404 });
  }
};`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Deno Deploy Example</h2>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10">
                    <span className="text-xs text-gray-400 font-mono">main.ts</span>
                  </div>
                  <pre className="p-6 text-sm overflow-x-auto">
                    <code className="font-mono text-gray-300">{`import { createServer, createFetchMiddleware } from 'npm:spl402';

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: Deno.env.get('RECIPIENT_WALLET')!,
  rpcUrl: Deno.env.get('SOLANA_RPC_URL'),
  routes: [{ path: '/api/premium', price: 0.001 }],
});

const middleware = createFetchMiddleware(spl402);

Deno.serve(async (request: Request) => {
  const middlewareResponse = await middleware(request);
  if (middlewareResponse) return middlewareResponse;

  return new Response(
    JSON.stringify({ message: 'Premium data' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Vercel Edge Functions Example</h2>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10">
                    <span className="text-xs text-gray-400 font-mono">api/data.ts</span>
                  </div>
                  <pre className="p-6 text-sm overflow-x-auto">
                    <code className="font-mono text-gray-300">{`import { createServer, createFetchMiddleware } from 'spl402';

export const config = {
  runtime: 'edge',
};

const spl402 = createServer({
  network: 'mainnet-beta',
  recipientAddress: process.env.RECIPIENT_WALLET,
  rpcUrl: process.env.SOLANA_RPC_URL,
  routes: [{ path: '/api/data', price: 0.001 }],
});

const middleware = createFetchMiddleware(spl402);

export default async function handler(request: Request) {
  const middlewareResponse = await middleware(request);
  if (middlewareResponse) return middlewareResponse;

  return new Response(
    JSON.stringify({ message: 'Edge function data' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}`}</code>
                  </pre>
                </div>
              </div>

              <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3 text-[#14F195]">Why Use Edge Runtimes?</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Global distribution:</strong> Deploy to 300+ cities worldwide for low latency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Zero cold starts:</strong> Instant response times compared to traditional serverless</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Cost effective:</strong> Pay only for what you use with generous free tiers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">Automatic scaling:</strong> Handle traffic spikes without configuration</span>
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
