import { useState } from 'react';
import { Terminal, Server, Zap, Lock, Globe, Copy, Check, ChevronRight, Code, ArrowRight, Download, Github, Shield, Layers, Box } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function Proxy() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <section className="pt-32 pb-20 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#9945FF]/10 border border-[#9945FF]/20 rounded-full mb-8">
              <Box size={14} className="text-[#9945FF]" />
              <span className="text-sm text-[#9945FF] font-medium">Payment Middleware</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6">
              SPL-402{' '}
              <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">
                Proxy
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed">
              Monetize your APIs with Solana payments in minutes. Zero code changes required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a
                href="https://github.com/astrohackerx/spl402-proxy"
                target="_blank"
                className="group px-8 py-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 rounded-xl font-semibold transition-opacity flex items-center gap-2"
              >
                <Github size={18} />
                View on GitHub
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://www.npmjs.com/package/spl402-proxy"
                target="_blank"
                className="group px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#14F195]/30 rounded-xl font-semibold transition-all flex items-center gap-2"
              >
                <Download size={18} />
                npm Package
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6 max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Quick Install</span>
                <button
                  onClick={() => handleCopy('npm install -g spl402-proxy', 'install')}
                  className="flex items-center gap-1 text-xs text-[#14F195] hover:text-[#14F195]/80 transition-colors"
                >
                  {copiedCode === 'install' ? (
                    <>
                      <Check size={14} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <code className="text-sm font-mono text-[#14F195]">
                npm install -g spl402-proxy
              </code>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/20 blur-3xl -z-10" />
      </section>

      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-black to-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">What is SPL-402 Proxy?</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A powerful payment middleware that sits between your clients and your existing API,
              handling payment verification automatically
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#0D0D0D] border border-[#9945FF]/20 rounded-xl p-6">
              <div className="w-12 h-12 bg-[#9945FF]/10 rounded-lg flex items-center justify-center mb-4">
                <Code size={24} className="text-[#9945FF]" />
              </div>
              <h3 className="text-lg font-bold mb-2">Zero API Changes</h3>
              <p className="text-gray-400 text-sm">
                Works with any existing HTTP API. No code modifications required.
              </p>
            </div>

            <div className="bg-[#0D0D0D] border border-[#14F195]/20 rounded-xl p-6">
              <div className="w-12 h-12 bg-[#14F195]/10 rounded-lg flex items-center justify-center mb-4">
                <Terminal size={24} className="text-[#14F195]" />
              </div>
              <h3 className="text-lg font-bold mb-2">Config-Based Setup</h3>
              <p className="text-gray-400 text-sm">
                Simple JSON configuration with interactive wizard.
              </p>
            </div>

            <div className="bg-[#0D0D0D] border border-[#9945FF]/20 rounded-xl p-6">
              <div className="w-12 h-12 bg-[#9945FF]/10 rounded-lg flex items-center justify-center mb-4">
                <Lock size={24} className="text-[#9945FF]" />
              </div>
              <h3 className="text-lg font-bold mb-2">No Private Keys</h3>
              <p className="text-gray-400 text-sm">
                Only needs your public wallet address for receiving payments.
              </p>
            </div>

            <div className="bg-[#0D0D0D] border border-[#14F195]/20 rounded-xl p-6">
              <div className="w-12 h-12 bg-[#14F195]/10 rounded-lg flex items-center justify-center mb-4">
                <Server size={24} className="text-[#14F195]" />
              </div>
              <h3 className="text-lg font-bold mb-2">Multiple Routes</h3>
              <p className="text-gray-400 text-sm">
                Different prices for different endpoints. Mix free and paid routes.
              </p>
            </div>

            <div className="bg-[#0D0D0D] border border-[#9945FF]/20 rounded-xl p-6">
              <div className="w-12 h-12 bg-[#9945FF]/10 rounded-lg flex items-center justify-center mb-4">
                <Zap size={24} className="text-[#9945FF]" />
              </div>
              <h3 className="text-lg font-bold mb-2">Flexible Payments</h3>
              <p className="text-gray-400 text-sm">
                Accept native SOL or any SPL token (USDC, USDT, SPL402).
              </p>
            </div>

            <div className="bg-[#0D0D0D] border border-[#14F195]/20 rounded-xl p-6">
              <div className="w-12 h-12 bg-[#14F195]/10 rounded-lg flex items-center justify-center mb-4">
                <Globe size={24} className="text-[#14F195]" />
              </div>
              <h3 className="text-lg font-bold mb-2">Discovery & Analytics</h3>
              <p className="text-gray-400 text-sm">
                Built-in balance and payment history tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Simple architecture, powerful results</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-8">
                <pre className="text-xs text-gray-400 font-mono overflow-x-auto">
{`┌──────────┐    Request + Payment    ┌──────────────┐
│  Client  │ ────────────────────────> │  SPL-402     │
│          │                            │  Proxy       │
│          │ <────────────────────────  │  (port 3000) │
└──────────┘         Response           └──────┬───────┘
                                               │
                                       Verifies payment
                                       on blockchain
                                               │
                                               ▼
                                        ┌──────────────┐
                                        │   Solana     │
                                        │   Network    │
                                        └──────────────┘
                                               │
                                    Verified request only
                                               │
                                               ▼
                                        ┌──────────────┐
                                        │   Your API   │
                                        │  (port 8080) │
                                        └──────────────┘`}
                </pre>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#9945FF]/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[#9945FF]">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Client Requests</h3>
                    <p className="text-sm text-gray-400">Client makes request to proxy (port 3000)</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#14F195]/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[#14F195]">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Payment Required</h3>
                    <p className="text-sm text-gray-400">Proxy requires payment (402 Payment Required)</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#9945FF]/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[#9945FF]">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Client Pays</h3>
                    <p className="text-sm text-gray-400">Client pays on Solana and includes payment proof</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#14F195]/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[#14F195]">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Verify & Forward</h3>
                    <p className="text-sm text-gray-400">Proxy verifies payment and forwards to your API (port 8080)</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#9945FF]/20 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[#9945FF]">
                    5
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">API Responds</h3>
                    <p className="text-sm text-gray-400">Your API responds normally, proxy returns to client</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Quick Start</h2>
            <p className="text-gray-400 text-lg">Get started in 3 simple steps</p>
          </div>

          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#9945FF] to-[#14F195] rounded-lg flex items-center justify-center font-bold text-white">
                  1
                </div>
                <h3 className="text-2xl font-bold">Initialize Configuration</h3>
              </div>
              <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono">Terminal</span>
                  <button
                    onClick={() => handleCopy('spl402-proxy init', 'init')}
                    className="flex items-center gap-1 text-xs text-[#14F195] hover:text-[#14F195]/80"
                  >
                    {copiedCode === 'init' ? (
                      <>
                        <Check size={14} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-6 text-sm overflow-x-auto">
                  <code className="font-mono text-[#14F195]">spl402-proxy init</code>
                </pre>
              </div>
              <p className="text-gray-400 mt-4">
                This creates a config file at <code className="px-2 py-1 bg-white/5 rounded text-[#14F195]">~/.spl402/proxy.config.json</code>.
                Use the interactive wizard or skip it with <code className="px-2 py-1 bg-white/5 rounded text-[#14F195]">--quick</code> flag.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#9945FF] to-[#14F195] rounded-lg flex items-center justify-center font-bold text-white">
                  2
                </div>
                <h3 className="text-2xl font-bold">Configure Your Routes</h3>
              </div>
              <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono">proxy.config.json</span>
                  <button
                    onClick={() => handleCopy(`{
  "server": {
    "port": 3000,
    "recipientWallet": "Your-Solana-Wallet-Address",
    "network": "mainnet-beta",
    "rpcUrl": "https://api.mainnet-beta.solana.com"
  },
  "payment": {
    "scheme": "transfer",
    "mint": null,
    "decimals": null
  },
  "proxy": {
    "target": "http://localhost:8080"
  },
  "routes": [
    { "path": "/api/free", "price": 0, "method": "GET" },
    { "path": "/api/premium", "price": 0.001, "method": "GET" }
  ]
}`, 'config')}
                    className="flex items-center gap-1 text-xs text-[#9945FF] hover:text-[#9945FF]/80"
                  >
                    {copiedCode === 'config' ? (
                      <>
                        <Check size={14} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-6 text-sm overflow-x-auto">
                  <code className="font-mono text-gray-300">{`{
  "server": {
    "port": 3000,
    "recipientWallet": "Your-Solana-Wallet-Address",
    "network": "mainnet-beta",
    "rpcUrl": "https://api.mainnet-beta.solana.com"
  },
  "payment": {
    "scheme": "transfer",
    "mint": null,
    "decimals": null
  },
  "proxy": {
    "target": "http://localhost:8080"
  },
  "routes": [
    { "path": "/api/free", "price": 0, "method": "GET" },
    { "path": "/api/premium", "price": 0.001, "method": "GET" }
  ]
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#9945FF] to-[#14F195] rounded-lg flex items-center justify-center font-bold text-white">
                  3
                </div>
                <h3 className="text-2xl font-bold">Start the Proxy</h3>
              </div>
              <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono">Terminal</span>
                  <button
                    onClick={() => handleCopy('spl402-proxy serve', 'serve')}
                    className="flex items-center gap-1 text-xs text-[#14F195] hover:text-[#14F195]/80"
                  >
                    {copiedCode === 'serve' ? (
                      <>
                        <Check size={14} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-6 text-sm overflow-x-auto">
                  <code className="font-mono text-[#14F195]">spl402-proxy serve</code>
                </pre>
              </div>
              <p className="text-gray-400 mt-4">
                That's it! Your API is now protected with Solana payments.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Available Commands</h2>
            <p className="text-gray-400 text-lg">Powerful CLI tools for proxy management</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Terminal size={20} className="text-[#9945FF]" />
                <code className="font-mono text-[#14F195]">spl402-proxy init</code>
              </div>
              <p className="text-gray-400 text-sm mb-3">
                Create a new configuration file with interactive wizard.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <code className="text-gray-300">--quick</code> - Quick setup with defaults
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <code className="text-gray-300">--force</code> - Force overwrite existing config
                </div>
              </div>
            </div>

            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Server size={20} className="text-[#14F195]" />
                <code className="font-mono text-[#14F195]">spl402-proxy serve</code>
              </div>
              <p className="text-gray-400 text-sm mb-3">
                Start the payment proxy server.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <code className="text-gray-300">--config &lt;path&gt;</code> - Custom config file
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <code className="text-gray-300">--port &lt;number&gt;</code> - Override port
                </div>
              </div>
            </div>

            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe size={20} className="text-[#9945FF]" />
                <code className="font-mono text-[#14F195]">spl402-proxy discover</code>
              </div>
              <p className="text-gray-400 text-sm mb-3">
                Discover SPL-402 enabled services on the network.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <code className="text-gray-300">--search &lt;term&gt;</code> - Search for services
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <code className="text-gray-300">--wallet &lt;address&gt;</code> - Get info about wallet
                </div>
              </div>
            </div>

            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap size={20} className="text-[#14F195]" />
                <code className="font-mono text-[#14F195]">spl402-proxy balance</code>
              </div>
              <p className="text-gray-400 text-sm mb-3">
                Check wallet balance (SOL and configured token).
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Shows SOL and token balance from config</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Layers size={20} className="text-[#9945FF]" />
                <code className="font-mono text-[#14F195]">spl402-proxy history</code>
              </div>
              <p className="text-gray-400 text-sm mb-3">
                View payment history and transaction details.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <code className="text-gray-300">--limit &lt;n&gt;</code> - Limit results
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <code className="text-gray-300">--json</code> - JSON output
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Use Cases</h2>
            <p className="text-gray-400 text-lg">Perfect for various scenarios</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-xl p-8">
              <Shield size={32} className="text-[#9945FF] mb-4" />
              <h3 className="text-xl font-bold mb-3">Legacy API Monetization</h3>
              <p className="text-gray-400 mb-4">
                Add payments to existing APIs without touching your codebase. Perfect for APIs
                you don't want to modify or can't access source code.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <span>Third-party APIs</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <span>Production APIs in maintenance mode</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <span>APIs with existing authentication</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#14F195]/10 to-[#9945FF]/10 border border-[#9945FF]/20 rounded-xl p-8">
              <Layers size={32} className="text-[#14F195] mb-4" />
              <h3 className="text-xl font-bold mb-3">Two-Layer Security</h3>
              <p className="text-gray-400 mb-4">
                Combine payment verification with your existing authentication. Clients must
                provide both payment proof and valid API credentials.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <span>Payment layer + API key validation</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <span>Keep existing authentication system</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <span>No migration required</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-xl p-8">
              <Zap size={32} className="text-[#9945FF] mb-4" />
              <h3 className="text-xl font-bold mb-3">Rapid Prototyping</h3>
              <p className="text-gray-400 mb-4">
                Test payment monetization without committing to code changes. Perfect for
                validating business models and pricing strategies.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <span>Quick payment integration testing</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <span>A/B test different pricing models</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <span>No deployment risk</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#14F195]/10 to-[#9945FF]/10 border border-[#9945FF]/20 rounded-xl p-8">
              <Globe size={32} className="text-[#14F195] mb-4" />
              <h3 className="text-xl font-bold mb-3">Multi-Tier Pricing</h3>
              <p className="text-gray-400 mb-4">
                Create different pricing tiers for different endpoints. Mix free, basic,
                and premium access levels.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <span>Free tier for onboarding</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <span>Basic and premium endpoints</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <span>Per-request or subscription-like pricing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-[#0D0D0D]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6">
            Ready to monetize your API?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Add Solana payments to any API in minutes. No code changes required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com/astrohackerx/spl402-proxy"
              target="_blank"
              className="group px-8 py-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 rounded-xl font-semibold transition-opacity flex items-center gap-2"
            >
              <Github size={18} />
              View on GitHub
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/docs"
              className="group px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#14F195]/30 rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              Read Documentation
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
