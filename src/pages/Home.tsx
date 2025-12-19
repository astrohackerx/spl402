import { Code, Zap, Lock, Globe, ArrowRight, Github, Check, ExternalLink, Download, Sparkles, Rocket, BookOpen, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [npmDownloads, setNpmDownloads] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://api.npmjs.org/downloads/point/last-month/spl402')
      .then(res => res.json())
      .then(data => {
        if (data.downloads) {
          setNpmDownloads(data.downloads);
        }
      })
      .catch(() => {
        // Silently fail if we can't fetch downloads
      });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText('npm install spl402');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <section className="pt-32 pb-20 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#14F195]/10 border border-[#14F195]/20 rounded-full mb-8 flex-wrap justify-center">
              <Zap size={14} className="text-[#14F195]" />
              <span className="text-xs sm:text-sm text-[#14F195] font-medium text-center">Solana Native &nbsp;|&nbsp; Built from scratch</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              HTTP 402 for{' '}
              <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">
                Solana
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
              Decentralized Solana Payment Layer for APIs & Autonomous agents. Instant micropayments. 3x faster than x402. SAS-backed verification.
            </p>

            {npmDownloads && (
              <div className="flex items-center justify-center gap-2 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                  <Download size={16} className="text-[#14F195]" />
                  <span className="text-sm text-gray-300">
                    <span className="font-bold text-white">{npmDownloads.toLocaleString()}</span> <a href="https://www.npmjs.com/package/spl402" className="text-[#14F195]" target="_blank">SDK downloads</a> last month
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col items-center gap-6 mb-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
                <div className="group bg-gradient-to-br from-[#0D0D0D] to-[#1a1a1a] border border-white/10 hover:border-[#9945FF]/30 rounded-xl p-5 transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#9945FF] to-[#14F195] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Rocket size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base mb-1">Starter Kit</h3>
                      <p className="text-xs text-gray-400">Full-stack template ready to deploy</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* <a href="https://live.spl402.org" target="_blank" className="flex-1 px-3 py-2 bg-[#14F195]/10 hover:bg-[#14F195]/20 border border-[#14F195]/30 rounded-lg text-xs font-medium text-[#14F195] flex items-center justify-center gap-1 transition-colors">
                      <Play size={12} />
                      Live Demo
                    </a> */}
                    <a href="https://github.com/astrohackerx/spl402-starter-kit" target="_blank" className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors">
                      <Github size={12} />
                      Code
                    </a>
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-[#0D0D0D] to-[#1a1a1a] border border-white/10 hover:border-[#9945FF]/30 rounded-xl p-5 transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#9945FF] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base mb-1">GPT402</h3>
                      <p className="text-xs text-gray-400">Pay-per-use AI chat interface</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* <a href="https://gpt.spl402.org" target="_blank" className="flex-1 px-3 py-2 bg-[#14F195]/10 hover:bg-[#14F195]/20 border border-[#14F195]/30 rounded-lg text-xs font-medium text-[#14F195] flex items-center justify-center gap-1 transition-colors">
                      <Play size={12} />
                      Live Demo
                    </a> */}
                    <a href="https://github.com/astrohackerx/gpt-402" target="_blank" className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors">
                      <Github size={12} />
                      Code
                    </a>
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-[#0D0D0D] to-[#1a1a1a] border border-white/10 hover:border-[#14F195]/30 rounded-xl p-5 transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#14F195] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles size={20} className="text-black" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base mb-1">Chess402</h3>
                      <p className="text-xs text-gray-400">Blockchain-powered chess platform</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* <a href="https://chess402.online" target="_blank" className="flex-1 px-3 py-2 bg-[#14F195]/10 hover:bg-[#14F195]/20 border border-[#14F195]/30 rounded-lg text-xs font-medium text-[#14F195] flex items-center justify-center gap-1 transition-colors">
                      <Play size={12} />
                      Live Demo
                    </a> */}
                    <a href="https://github.com/astrohackerx/chess402" target="_blank" className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors">
                      <Github size={12} />
                      Code
                    </a>
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-[#0D0D0D] to-[#1a1a1a] border border-white/10 hover:border-[#9945FF]/30 rounded-xl p-5 transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#9945FF] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base mb-1">AI Agent Marketplace</h3>
                      <p className="text-xs text-gray-400">Decentralized AI service platform</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* <a href="https://ai.spl402.org" target="_blank" className="flex-1 px-3 py-2 bg-[#14F195]/10 hover:bg-[#14F195]/20 border border-[#14F195]/30 rounded-lg text-xs font-medium text-[#14F195] flex items-center justify-center gap-1 transition-colors">
                      <Play size={12} />
                      Live Demo
                    </a> */}
                    <a href="https://github.com/astrohackerx/AiMarketplace" target="_blank" className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors">
                      <Github size={12} />
                      Code
                    </a>
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-[#0D0D0D] to-[#1a1a1a] border border-white/10 hover:border-[#9945FF]/30 rounded-xl p-5 transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#9945FF] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base mb-1">Decider Agent</h3>
                      <p className="text-xs text-gray-400">Autonomous AI decision making</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* <a href="https://aiagent.spl402.org" target="_blank" className="flex-1 px-3 py-2 bg-[#14F195]/10 hover:bg-[#14F195]/20 border border-[#14F195]/30 rounded-lg text-xs font-medium text-[#14F195] flex items-center justify-center gap-1 transition-colors">
                      <Play size={12} />
                      Live Demo
                    </a> */}
                    <a href="https://github.com/astrohackerx/agent402" target="_blank" className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors">
                      <Github size={12} />
                      Code
                    </a>
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-[#0D0D0D] to-[#1a1a1a] border border-white/10 hover:border-[#9945FF]/30 rounded-xl p-5 transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#9945FF] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Code size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base mb-1">OpenRouter</h3>
                      <p className="text-xs text-gray-400">Unified AI model routing</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* <a href="https://openrouter.spl402.org" target="_blank" className="flex-1 px-3 py-2 bg-[#14F195]/10 hover:bg-[#14F195]/20 border border-[#14F195]/30 rounded-lg text-xs font-medium text-[#14F195] flex items-center justify-center gap-1 transition-colors">
                      <Play size={12} />
                      Live Demo
                    </a> */}
                    <a href="https://github.com/astrohackerx/spl402-OpenRouter" target="_blank" className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors">
                      <Github size={12} />
                      Code
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-2xl mt-4">
                <a
                  href="https://pump.fun/coin/DXgxW5ESEpvTA194VJZRxwXADRuZKPoeadLoK7o5pump"
                  target='_blank'
                  className="group px-8 py-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 rounded-xl font-semibold transition-opacity flex items-center justify-center gap-2"
                >
                  <Rocket size={18} />
                  Trade SPL402
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/docs"
                  className="group px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#14F195]/30 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen size={18} />
                  Documentation
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            <div className="py-6">
              <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="flex flex-wrap items-center justify-center gap-6">
                    <a
                      href="https://x.com/spl402"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span className="text-base">Twitter</span>
                      <ExternalLink size={14} />
                    </a>
                    <a
                      href="https://github.com/astrohackerx/spl402"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                      <span className="text-base">GitHub</span>
                      <ExternalLink size={14} />
                    </a>
                    <a
                      href="https://www.npmjs.com/package/spl402"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
                      </svg>
                      <span className="text-base">npm</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 max-w-2xl mx-auto">
              <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">Quick Install</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-[#14F195] hover:text-[#14F195]/80 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={14} />
                        Copied!
                      </>
                    ) : (
                      'Copy'
                    )}
                  </button>
                </div>
                <code className="text-sm font-mono text-[#14F195]">
                  npm install spl402
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/20 blur-3xl -z-10" />
      </section>

      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-black to-[#0D0D0D]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">What is SPL-402?</h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Solana Payment Layer 402 brings the HTTP 402 Payment Required status code to life on Solana
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[#0D0D0D] border border-[#9945FF]/20 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#9945FF]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Zap size={16} className="text-[#9945FF]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Direct Payments</h3>
                  <p className="text-gray-400 text-sm">Wallet-to-wallet transfers with no intermediaries</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0D0D0D] border border-[#14F195]/20 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#14F195]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Lock size={16} className="text-[#14F195]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Zero Platform Fees</h3>
                  <p className="text-gray-400 text-sm">Only pay Solana network transaction fees (~$0.00001)</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0D0D0D] border border-[#9945FF]/20 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#9945FF]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Globe size={16} className="text-[#9945FF]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">HTTP-Native</h3>
                  <p className="text-gray-400 text-sm">Works with standard HTTP/fetch APIs</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0D0D0D] border border-[#14F195]/20 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#14F195]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Code size={16} className="text-[#14F195]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Token Flexibility</h3>
                  <p className="text-gray-400 text-sm">Accept SOL, USDC, USDT, or any SPL token</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg text-gray-400">
              Think of it as <span className="text-[#14F195] font-semibold">"pay-per-request"</span> for your APIs,
              without the overhead of traditional payment processors.
            </p>
          </div>
        </div>
      </section>

      <section id="compare" className="py-20 px-4 sm:px-6 bg-[#0D0D0D]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">SPL-402 vs x402</h2>
            <p className="text-gray-400 text-lg">Why we're 2-3x faster with zero platform fees</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-xl p-4 text-center">
              <div className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-semibold">Feature</div>
            </div>
            <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/30 rounded-xl p-4 text-center">
              <div className="text-xs uppercase tracking-wider text-[#14F195] mb-2 font-bold">SPL-402</div>
            </div>
            <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-xl p-4 text-center">
              <div className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-semibold">x402</div>
            </div>

            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-center">
              <span className="text-sm text-gray-400">Latency</span>
            </div>
            <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-4 flex items-center justify-center">
              <span className="text-lg font-bold text-[#14F195]">1s</span>
            </div>
            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-center justify-center">
              <span className="text-sm text-gray-400">2.5s+</span>
            </div>

            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-center">
              <span className="text-sm text-gray-400">Platform Fees</span>
            </div>
            <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-4 flex items-center justify-center">
              <span className="text-lg font-bold text-[#14F195]">0%</span>
            </div>
            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-center justify-center">
              <span className="text-sm text-gray-400">Variable</span>
            </div>

            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-center">
              <span className="text-sm text-gray-400">Transaction Cost</span>
            </div>
            <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-4 flex items-center justify-center">
              <span className="text-lg font-bold text-[#14F195]">~$0.00001</span>
            </div>
            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-center justify-center">
              <span className="text-sm text-gray-400">Higher</span>
            </div>

            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-center">
              <span className="text-sm text-gray-400">Dynamic Routes</span>
            </div>
            <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-4 flex items-center justify-center">
              <span className="text-lg font-bold text-[#14F195]">Yes</span>
            </div>
            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-center justify-center">
              <span className="text-sm text-gray-400">No</span>
            </div>

            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-center">
              <span className="text-sm text-gray-400">Smart Client</span>
            </div>
            <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-4 flex items-center justify-center">
              <span className="text-lg font-bold text-[#14F195]">Yes</span>
            </div>
            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-center justify-center">
              <span className="text-sm text-gray-400">No</span>
            </div>

            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-center">
              <span className="text-sm text-gray-400">System</span>
            </div>
            <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-4 flex items-center justify-center">
              <span className="text-lg font-bold text-[#14F195]">Decentralized</span>
            </div>
            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-center justify-center">
              <span className="text-sm text-gray-400">Centralized</span>
            </div>

            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-center">
              <span className="text-sm text-gray-400">Middleman</span>
            </div>
            <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-4 flex items-center justify-center">
              <span className="text-lg font-bold text-[#14F195]">None</span>
            </div>
            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-center justify-center">
              <span className="text-sm text-gray-400">Yes</span>
            </div>

            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-center">
              <span className="text-sm text-gray-400">API Keys</span>
            </div>
            <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-4 flex items-center justify-center">
              <span className="text-lg font-bold text-[#14F195]">Not required</span>
            </div>
            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-center justify-center">
              <span className="text-sm text-gray-400">Required</span>
            </div>

            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-center">
              <span className="text-sm text-gray-400">Setup Time</span>
            </div>
            <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-4 flex items-center justify-center">
              <span className="text-lg font-bold text-[#14F195]">&lt; 5 min</span>
            </div>
            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-center justify-center">
              <span className="text-sm text-gray-400">Longer</span>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="bg-[#9945FF]/5 border border-[#9945FF]/20 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 text-[#9945FF]">Why SPL-402 is faster:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm">
                  <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300"><strong>No facilitator:</strong> Payments go directly from payer to recipient</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300"><strong>Minimal verification:</strong> Only checks on-chain signature, no third-party APIs</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300"><strong>Optimized code:</strong> Zero external dependencies, pure Solana primitives</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Check size={16} className="text-[#14F195] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300"><strong>Local-first:</strong> Can verify payments without external RPC calls</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 text-[#14F195]">What this means for you:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm">
                  <Zap size={16} className="text-[#9945FF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Users pay ~$0.00001 per transaction instead of percentage fees</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Zap size={16} className="text-[#9945FF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Faster user experience with sub-second confirmations</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Zap size={16} className="text-[#9945FF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">No API keys or third-party accounts required</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Zap size={16} className="text-[#9945FF] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Instant settlement with no chargebacks</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="py-20 px-4 sm:px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Simple 6-step payment flow</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="order-2 lg:order-1">
              <div className="lg:sticky lg:top-24">
                <div className="bg-gradient-to-br from-[#0A0A0A] to-[#0D0D0D] border border-white/10 rounded-2xl p-4 sm:p-8 backdrop-blur-sm">
                  <div className="mb-4">
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Payment Flow Diagram</span>
                  </div>
                  <div className="overflow-x-auto">
                    <pre className="text-[9px] leading-relaxed sm:text-[10px] md:text-xs text-gray-400 font-mono min-w-max">
{`┌─────────┐       ┌─────────┐       ┌─────────┐
│ Client  │       │  Your   │       │ Solana  │
│         │       │  API    │       │ Network │
└────┬────┘       └────┬────┘       └────┬────┘
     │                 │                 │
     │ 1. GET request  │                 │
     ├────────────────>│                 │
     │                 │                 │
     │ 2. 402 Required │                 │
     │    + Details    │                 │
     │<────────────────┤                 │
     │                 │                 │
     │ 3. Create & Sign│                 │
     │─────────────────┼────────────────>│
     │                 │                 │
     │ 4. GET + Proof  │                 │
     ├────────────────>│                 │
     │                 │                 │
     │                 │ 5. Verify       │
     │                 │────────────────>│
     │                 │<────────────────┤
     │                 │                 │
     │ 6. 200 OK       │                 │
     │<────────────────┤                 │
     │                 │                 │`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur" />
                <div className="relative bg-[#0D0D0D] border border-white/10 group-hover:border-[#9945FF]/30 rounded-2xl p-6 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#9945FF] to-[#9945FF]/50 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-[#9945FF]/20">
                      1
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-white">Client Requests Resource</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">Client sends GET request to your protected API endpoint.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur" />
                <div className="relative bg-[#0D0D0D] border border-white/10 group-hover:border-[#14F195]/30 rounded-2xl p-6 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#14F195] to-[#14F195]/50 rounded-xl flex items-center justify-center font-bold text-black shadow-lg shadow-[#14F195]/20">
                      2
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-white">Server Responds 402</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">Server returns 402 Payment Required with payment details: amount, recipient address, and network.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur" />
                <div className="relative bg-[#0D0D0D] border border-white/10 group-hover:border-[#9945FF]/30 rounded-2xl p-6 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#9945FF] to-[#9945FF]/50 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-[#9945FF]/20">
                      3
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-white">Client Creates Transaction</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">Client creates Solana transaction, signs it with wallet, and submits to the network.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur" />
                <div className="relative bg-[#0D0D0D] border border-white/10 group-hover:border-[#14F195]/30 rounded-2xl p-6 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#14F195] to-[#14F195]/50 rounded-xl flex items-center justify-center font-bold text-black shadow-lg shadow-[#14F195]/20">
                      4
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-white">Client Retries with Proof</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">Client retries the original request, including the transaction signature as proof of payment.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur" />
                <div className="relative bg-[#0D0D0D] border border-white/10 group-hover:border-[#9945FF]/30 rounded-2xl p-6 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#9945FF] to-[#9945FF]/50 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-[#9945FF]/20">
                      5
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-white">Server Verifies Payment</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">Server checks the transaction signature on-chain to verify the payment is valid.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur" />
                <div className="relative bg-[#0D0D0D] border border-white/10 group-hover:border-[#14F195]/30 rounded-2xl p-6 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#14F195] to-[#14F195]/50 rounded-xl flex items-center justify-center font-bold text-black shadow-lg shadow-[#14F195]/20">
                      6
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-white">Server Returns Content</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">Payment verified! Server returns 200 OK with the requested protected content.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Features</h2>
            <p className="text-gray-400 text-lg">Everything you need for production</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="group relative bg-[#0D0D0D] border border-white/10 hover:border-[#14F195]/30 rounded-2xl p-8 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/0 to-[#14F195]/0 group-hover:from-[#9945FF]/5 group-hover:to-[#14F195]/5 rounded-2xl transition-all" />
              <div className="relative">
                <div className="w-12 h-12 bg-[#9945FF]/10 border border-[#9945FF]/20 rounded-xl flex items-center justify-center mb-4">
                  <Zap size={24} className="text-[#9945FF]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                <p className="text-gray-400">~500ms payment verification. 2-3x faster than alternatives. Zero middlemen.</p>
              </div>
            </div>

            <div className="group relative bg-[#0D0D0D] border border-white/10 hover:border-[#14F195]/30 rounded-2xl p-8 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/0 to-[#14F195]/0 group-hover:from-[#9945FF]/5 group-hover:to-[#14F195]/5 rounded-2xl transition-all" />
              <div className="relative">
                <div className="w-12 h-12 bg-[#14F195]/10 border border-[#14F195]/20 rounded-xl flex items-center justify-center mb-4">
                  <Lock size={24} className="text-[#14F195]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Zero Platform Fees</h3>
                <p className="text-gray-400">Direct wallet transfers. Only pay Solana network fees (~$0.00001 per transaction).</p>
              </div>
            </div>

            <div className="group relative bg-[#0D0D0D] border border-white/10 hover:border-[#14F195]/30 rounded-2xl p-8 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/0 to-[#14F195]/0 group-hover:from-[#9945FF]/5 group-hover:to-[#14F195]/5 rounded-2xl transition-all" />
              <div className="relative">
                <div className="w-12 h-12 bg-[#9945FF]/10 border border-[#9945FF]/20 rounded-xl flex items-center justify-center mb-4">
                  <Code size={24} className="text-[#9945FF]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Simple Integration</h3>
                <p className="text-gray-400">React hooks, TypeScript support, wallet adapter ready. 5 minutes to production.</p>
              </div>
            </div>

            <div className="group relative bg-[#0D0D0D] border border-white/10 hover:border-[#14F195]/30 rounded-2xl p-8 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/0 to-[#14F195]/0 group-hover:from-[#9945FF]/5 group-hover:to-[#14F195]/5 rounded-2xl transition-all" />
              <div className="relative">
                <div className="w-12 h-12 bg-[#14F195]/10 border border-[#14F195]/20 rounded-xl flex items-center justify-center mb-4">
                  <Globe size={24} className="text-[#14F195]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Edge Compatible</h3>
                <p className="text-gray-400">Works with Cloudflare Workers, Vercel Edge, Deno Deploy. Universal runtime support.</p>
              </div>
            </div>

            <div className="group relative bg-[#0D0D0D] border border-white/10 hover:border-[#14F195]/30 rounded-2xl p-8 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/0 to-[#14F195]/0 group-hover:from-[#9945FF]/5 group-hover:to-[#14F195]/5 rounded-2xl transition-all" />
              <div className="relative">
                <div className="w-12 h-12 bg-[#9945FF]/10 border border-[#9945FF]/20 rounded-xl flex items-center justify-center mb-4">
                  <Check size={24} className="text-[#9945FF]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Production Ready</h3>
                <p className="text-gray-400">Full TypeScript support. React hooks. Battle-tested with comprehensive examples.</p>
              </div>
            </div>

            <div className="group relative bg-[#0D0D0D] border border-white/10 hover:border-[#14F195]/30 rounded-2xl p-8 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/0 to-[#14F195]/0 group-hover:from-[#9945FF]/5 group-hover:to-[#14F195]/5 rounded-2xl transition-all" />
              <div className="relative">
                <div className="w-12 h-12 bg-[#14F195]/10 border border-[#14F195]/20 rounded-xl flex items-center justify-center mb-4">
                  <Lock size={24} className="text-[#14F195]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Secure by Default</h3>
                <p className="text-gray-400">Built-in replay attack prevention. On-chain verification. No trust required.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="docs" className="py-20 px-4 sm:px-6 bg-gradient-to-b from-black to-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Quick Start</h2>
            <p className="text-gray-400 text-lg">Production-ready in minutes</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="mb-4">
                <span className="text-sm text-[#14F195] font-semibold">Client (React)</span>
              </div>
              <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono">client.tsx</span>
                  <button className="text-xs text-[#14F195] hover:text-[#14F195]/80">Copy</button>
                </div>
                <pre className="p-6 text-sm overflow-x-auto">
                  <code className="font-mono text-gray-300">{`import { useSPL402 } from 'spl402';
import { useWallet } from '@solana/wallet-adapter-react';

function PremiumContent() {
  const { publicKey, signAndSendTransaction } = useWallet();

  const { makeRequest, loading } = useSPL402({
    network: 'mainnet-beta',
    rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL,
  });

  const fetchData = async () => {
    const res = await makeRequest('/api/premium', {
      publicKey,
      signAndSendTransaction,
    });
    const data = await res.json();
  };

  return (
    <button onClick={fetchData} disabled={loading}>
      Get Premium Data (0.001 SOL)
    </button>
  );
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <span className="text-sm text-[#9945FF] font-semibold">Server (Express)</span>
              </div>
              <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
                <div className="bg-[#0D0D0D] px-6 py-3 border-b border-white/10 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono">server.js</span>
                  <button className="text-xs text-[#9945FF] hover:text-[#9945FF]/80">Copy</button>
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
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-3xl p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text mb-2">
                  ~500ms
                </div>
                <div className="text-gray-400 text-sm sm:text-base">Payment Verification</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text mb-2">
                  0%
                </div>
                <div className="text-gray-400 text-sm sm:text-base">Platform Fees</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text mb-2">
                  $0.00001
                </div>
                <div className="text-gray-400 text-sm sm:text-base">Per Transaction</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text mb-2">
                  5min
                </div>
                <div className="text-gray-400 text-sm sm:text-base">To Production</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6">
            Ready to add payments?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Start accepting payments in minutes. No middlemen, no platform fees.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://github.com/astrohackerx/spl402"
              target="_blank"
              className="group px-8 py-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 rounded-xl font-semibold transition-opacity flex items-center gap-2"
            >
              <Github size={18} />
              View on GitHub
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
