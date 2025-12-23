import { useState } from 'react';
import { Rocket, Sparkles, Globe, Zap, Code, Server, Github, ArrowRight, Search, Filter } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface Template {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  category: string[];
  icon: any;
  iconColor: string;
  githubUrl: string;
  features: string[];
}

const templates: Template[] = [
  {
    id: 'starter-kit',
    name: 'Starter Kit',
    description: 'Full-stack template ready to deploy',
    fullDescription: 'Complete full-stack SPL-402 implementation with client and server. Perfect starting point for building your own payment-gated APIs. Includes React frontend with Solana wallet integration and Express backend with SPL-402 middleware.',
    category: ['Infrastructure', 'Template'],
    icon: Rocket,
    iconColor: 'from-[#9945FF] to-[#14F195]',
    githubUrl: 'https://github.com/astrohackerx/spl402-starter-kit',
    features: [
      'React + Vite frontend',
      'Express backend',
      'SPL-402 middleware',
      'Wallet adapter integration',
      'TypeScript support'
    ]
  },
  {
    id: 'gpt402',
    name: 'GPT402',
    description: 'Pay-per-use AI chat interface',
    fullDescription: 'Pay-per-prompt AI chat powered by SPL-402. No signups, no subscriptions - just pay $0.01 per message with instant payment clearing in 1 second. The first real "AI Agent Economy" working app demonstrating software paying software.',
    category: ['AI', 'Agent Economy'],
    icon: Sparkles,
    iconColor: 'from-[#9945FF] to-[#9945FF]',
    githubUrl: 'https://github.com/astrohackerx/gpt-402',
    features: [
      'Pay-per-prompt model',
      'No subscriptions needed',
      '1 second payment clearing',
      'Instant AI responses',
      'Pure on-chain SaaS'
    ]
  },
  {
    id: 'chess402',
    name: 'Chess402',
    description: 'Blockchain-powered chess platform',
    fullDescription: 'Decentralized multiplayer chess game where players use Solana wallets to authenticate and make micropayments for each move. Showcases SPL-402 pay-per-action mechanics in gaming without traditional payment processors.',
    category: ['Gaming', 'Multiplayer'],
    icon: Sparkles,
    iconColor: 'from-[#14F195] to-[#14F195]',
    githubUrl: 'https://github.com/astrohackerx/chess402',
    features: [
      'Pay-per-move gameplay',
      'Real-time multiplayer',
      'Wallet authentication',
      'WebSocket integration',
      'Game history & stats'
    ]
  },
  {
    id: 'ai-marketplace',
    name: 'AI Agent Marketplace',
    description: 'Decentralized AI service platform',
    fullDescription: 'Marketplace for AI agents with tiered pricing (Free, Premium, Ultra, Enterprise). Demonstrates multi-tier payment models using SPL-402. Get the template running locally in 5 minutes with comprehensive testing endpoints.',
    category: ['AI', 'Marketplace', 'Agent Economy'],
    icon: Globe,
    iconColor: 'from-[#9945FF] to-[#9945FF]',
    githubUrl: 'https://github.com/astrohackerx/AiMarketplace',
    features: [
      'Multi-tier pricing',
      'Free tier support',
      '500ms payment flow',
      'Agent marketplace',
      'Quick local setup'
    ]
  },
  {
    id: 'decider-agent',
    name: 'Decider Agent',
    description: 'Autonomous AI decision making',
    fullDescription: 'First autonomous AI agent that can make its own decisions and pay for services using SPL-402 tokens. Demonstrates autonomous decision-making, service discovery, automatic payments, and multi-service orchestration.',
    category: ['AI', 'Agent Economy', 'Autonomous'],
    icon: Zap,
    iconColor: 'from-[#9945FF] to-[#9945FF]',
    githubUrl: 'https://github.com/astrohackerx/agent402',
    features: [
      'Autonomous payments',
      'Self-service discovery',
      'Decision-making AI',
      'Multi-service orchestration',
      'Standalone deployment'
    ]
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Unified AI model routing',
    fullDescription: 'Payment-gated AI API integrating SPL-402 with OpenRouter\'s unified gateway for 400+ AI models. Features tiered access (Free, Premium, Ultra, Enterprise) with capabilities from chat to vision analysis.',
    category: ['AI', 'Infrastructure'],
    icon: Code,
    iconColor: 'from-[#9945FF] to-[#9945FF]',
    githubUrl: 'https://github.com/astrohackerx/spl402-OpenRouter',
    features: [
      '400+ AI models',
      'Tiered pricing model',
      'Chat, code, vision',
      'OpenRouter integration',
      'Multi-model support'
    ]
  },
];

const allCategories = ['All', 'AI', 'Agent Economy', 'Gaming', 'Infrastructure', 'Marketplace', 'Template', 'Multiplayer', 'Autonomous'];

export default function Templates() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'category'>('name');

  const filteredTemplates = templates
    .filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.fullDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || template.category.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return a.category[0].localeCompare(b.category[0]);
    });

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#14F195]/10 border border-[#14F195]/20 rounded-full mb-6">
              <Server size={14} className="text-[#14F195]" />
              <span className="text-xs sm:text-sm text-[#14F195] font-medium">Production-Ready Templates</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6">
              SPL-402{' '}
              <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">
                Templates
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Open-source templates for payment-gated APIs, data services, and AI agent applications. Deploy in minutes.
            </p>
          </div>

          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#0D0D0D] border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#14F195]/30"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'category')}
                    className="appearance-none px-4 py-3 pl-10 pr-10 bg-[#0D0D0D] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#14F195]/30 cursor-pointer"
                  >
                    <option value="name">Sort: A-Z</option>
                    <option value="category">Sort: Category</option>
                  </select>
                  <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {allCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white'
                      : 'bg-[#0D0D0D] border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No templates found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => {
                const Icon = template.icon;
                return (
                  <div
                    key={template.id}
                    className="group bg-gradient-to-br from-[#0D0D0D] to-[#1a1a1a] border border-white/10 hover:border-[#9945FF]/30 rounded-xl p-6 transition-all"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${template.iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon size={24} className={template.iconColor.includes('14F195') && !template.iconColor.includes('9945FF') ? 'text-black' : 'text-white'} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-1">{template.name}</h3>
                        <p className="text-sm text-gray-400">{template.description}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                      {template.fullDescription}
                    </p>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {template.category.map(cat => (
                          <span
                            key={cat}
                            className="px-2 py-1 bg-[#9945FF]/10 border border-[#9945FF]/20 rounded text-xs text-[#9945FF]"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                      <ul className="space-y-1.5">
                        {template.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                            <span className="text-[#14F195] mt-0.5">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <a
                        href={template.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-opacity"
                      >
                        <Github size={16} />
                        View Code
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-3">Want to contribute?</h2>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Built something with SPL-402? Share your payment-gated API, data service, or AI agent template with the community and help builders get started faster.
              </p>
              <a
                href="https://github.com/astrohackerx/spl402"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#14F195]/30 rounded-xl font-semibold transition-all"
              >
                <Github size={18} />
                Contribute on GitHub
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
