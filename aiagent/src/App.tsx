import { useState, useEffect } from 'react';
import { Connection } from '@solana/web3.js';
import { Send, Bot, Loader2, Github, ExternalLink } from 'lucide-react';
import { StepsPopup } from './components/StepsPopup';
import { AnimatedRobot } from './components/AnimatedRobot';
import { TechDashboard } from './components/TechDashboard';
import { ChatPopup } from './components/ChatPopup';
import { WelcomePopup } from './components/WelcomePopup';
import {
  getAgentKeypair,
  checkAgentBalance,
  scanForServers,
  makePaymentAndRequest,
  AgentBalance,
  AgentStep,
} from './lib/aiagent';
import { getRandomPhrase } from './lib/agentPersonality';

export default function App() {
  const [balance, setBalance] = useState<AgentBalance | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'agent'; content: string }>>([]);
  const [noWallet, setNoWallet] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [stepsOpen, setStepsOpen] = useState(false);

  const connection = new Connection(import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');

  useEffect(() => {
    loadBalance();
  }, []);

  async function loadBalance() {
    setBalanceLoading(true);
    try {
      const keypair = await getAgentKeypair();
      if (!keypair) {
        setNoWallet(true);
        setBalanceLoading(false);
        return;
      }

      const balanceData = await checkAgentBalance(connection, keypair);
      setBalance(balanceData);
    } catch (error) {
      console.error('Error loading balance:', error);
    } finally {
      setBalanceLoading(false);
    }
  }

  const addStep = (step: Omit<AgentStep, 'timestamp'>) => {
    setSteps(prev => [...prev, { ...step, timestamp: Date.now() }]);
  };

  async function handleSendMessage() {
    if (!message.trim() || isProcessing) return;

    const userMessage = message.trim();
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setSteps([]);
    setIsProcessing(true);

    try {
      const keypair = await getAgentKeypair();
      if (!keypair) {
        addStep({
          type: 'error',
          message: 'No wallet configured. Add VITE_AGENT_PRIVATE_KEY to .env',
        });
        setIsProcessing(false);
        return;
      }

      addStep({
        type: 'info',
        message: getRandomPhrase('intro'),
      });

      await new Promise(resolve => setTimeout(resolve, 800));

      addStep({
        type: 'info',
        message: getRandomPhrase('noAccess'),
      });

      await new Promise(resolve => setTimeout(resolve, 800));

      addStep({
        type: 'info',
        message: getRandomPhrase('gratitude'),
      });

      await new Promise(resolve => setTimeout(resolve, 800));

      addStep({
        type: 'action',
        message: 'Checking my balance...',
      });

      const balanceData = await checkAgentBalance(connection, keypair);
      setBalance(balanceData);

      addStep({
        type: 'success',
        message: `Balance: ${balanceData.spl402.toFixed(2)} SPL402, ${balanceData.sol.toFixed(4)} SOL`,
        link: `https://solscan.io/account/${balanceData.walletAddress}`,
      });

      if (balanceData.spl402 < 0.1) {
        addStep({
          type: 'error',
          message: balanceData.spl402 === 0 ? getRandomPhrase('noBalance') : getRandomPhrase('lowBalance'),
        });

        addStep({
          type: 'info',
          message: getRandomPhrase('fundingRequest', { wallet: balanceData.walletAddress }),
        });

        addStep({
          type: 'info',
          message: getRandomPhrase('pingCreator'),
        });

        setChatHistory(prev => [
          ...prev,
          {
            role: 'agent',
            content: `Sorry, I need more funds to answer! Send SPL402 tokens to ${balanceData.walletAddress}`,
          },
        ]);
        setIsProcessing(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      addStep({
        type: 'action',
        message: getRandomPhrase('scanning'),
      });

      const servers = await scanForServers();

      if (servers.length === 0) {
        addStep({
          type: 'error',
          message: 'No servers found with /api/chat endpoint accepting SPL402 😢',
        });
        setChatHistory(prev => [
          ...prev,
          { role: 'agent', content: 'No available LLM services found on the network right now.' },
        ]);
        setIsProcessing(false);
        return;
      }

      addStep({
        type: 'success',
        message: `Found ${servers.length} server(s) with chat API!`,
        data: servers,
      });

      await new Promise(resolve => setTimeout(resolve, 800));

      addStep({
        type: 'action',
        message: getRandomPhrase('comparing'),
      });

      const cheapest = servers[0];

      addStep({
        type: 'success',
        message: `Cheapest option: ${cheapest.name} at ${cheapest.price.toFixed(4)} SPL402`,
        data: servers.map(s => ({
          name: s.name,
          price: s.price.toFixed(4),
          endpoint: s.endpoint,
        })),
      });

      await new Promise(resolve => setTimeout(resolve, 800));

      addStep({
        type: 'action',
        message: getRandomPhrase('paying'),
      });

      const result = await makePaymentAndRequest(
        cheapest.endpoint,
        userMessage,
        keypair,
        connection,
        cheapest.price,
        cheapest.attestation_address
      );

      addStep({
        type: 'success',
        message: 'Payment sent! Transaction confirmed ✅',
        link: `https://solscan.io/tx/${result.signature}`,
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      addStep({
        type: 'success',
        message: getRandomPhrase('success'),
      });

      let displayResponse = result.response;
      try {
        const parsed = JSON.parse(result.response);
        if (parsed.reply) {
          displayResponse = parsed.reply;
        }
      } catch {
        // Not JSON, use as-is
      }

      setChatHistory(prev => [...prev, { role: 'agent', content: displayResponse }]);

      await loadBalance();
    } catch (error) {
      console.error('Error processing request:', error);
      addStep({
        type: 'error',
        message: `${getRandomPhrase('error')} ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      setChatHistory(prev => [
        ...prev,
        { role: 'agent', content: 'Sorry, something went wrong processing your request.' },
      ]);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {showWelcome && <WelcomePopup onClose={() => setShowWelcome(false)} />}

      <header className="border-b border-[#14F195]/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#9945FF] to-[#14F195] rounded-lg flex items-center justify-center">
              <Bot size={24} className="text-black" />
            </div>
            <div>
              <h1 className="text-lg font-bold">SPL402 Agent</h1>
              <p className="text-xs text-gray-400">Autonomous AI</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://spl402.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#14F195] transition-colors text-sm flex items-center gap-1"
            >
              SPL402 Docs
              <ExternalLink size={14} />
            </a>
            <a
              href="https://github.com/astrohackerx/spl402/aiagent"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#9945FF] hover:bg-[#9945FF]/80 rounded-lg transition-colors text-sm font-medium"
            >
              <Github size={16} />
              GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <AnimatedRobot />
            <h1 className="text-4xl sm:text-6xl font-bold mb-2 bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#9945FF] bg-clip-text text-transparent">
              First Autonomous AI Agent Who Did It
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-4">
              I'm an AI agent that can make my own decisions and pay for services using SPL402 tokens.
              Ask me anything, and I'll find the cheapest LLM service to answer you!
            </p>
          </div>

          {noWallet && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8">
              <p className="text-red-400 font-medium">
                ⚠️ No wallet configured! Add VITE_AGENT_PRIVATE_KEY to your .env file.
              </p>
            </div>
          )}

          <div className="mb-8">
            {balance && (
              <div className="bg-gradient-to-r from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/30 rounded-2xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Agent Balance</p>
                      <p className="text-3xl font-bold text-[#14F195]">{balance.spl402.toFixed(2)} SPL402</p>
                    </div>
                    <div className="h-12 w-px bg-white/10" />
                    <div>
                      <p className="text-gray-400 text-sm mb-1">SOL</p>
                      <p className="text-2xl font-bold text-white">{balance.sol.toFixed(4)}</p>
                    </div>
                  </div>
                  <a
                    href={`https://solscan.io/account/${balance.walletAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#14F195] hover:text-[#14F195]/80 transition-colors group"
                  >
                    <span className="font-mono text-sm">{balance.walletAddress.slice(0, 4)}...{balance.walletAddress.slice(-4)}</span>
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            )}
          </div>

          <TechDashboard steps={steps} balance={balance} />

          {steps.length > 0 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setStepsOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 rounded-xl font-semibold transition-all"
              >
                View Agent Steps ({steps.length})
              </button>
            </div>
          )}
        </div>
      </main>

      <ChatPopup
        chatHistory={chatHistory}
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
        isProcessing={isProcessing}
        noWallet={noWallet}
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
      />

      <StepsPopup
        steps={steps}
        isOpen={stepsOpen}
        onClose={() => setStepsOpen(false)}
      />

      <footer className="border-t border-white/10 py-8 px-4 sm:px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            Powered by{' '}
            <a href="https://spl402.org" target="_blank" rel="noopener noreferrer" className="text-[#14F195] hover:underline">
              SPL402
            </a>
            {' '}• Built by{' '}
            <a href="https://github.com/astrohackerx" target="_blank" rel="noopener noreferrer" className="text-[#9945FF] hover:underline">
              AstrohackerX
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
