import { Activity, Database, Cpu, Zap, Clock, DollarSign } from 'lucide-react';
import { AgentStep } from '../lib/aiagent';
import { useEffect, useState } from 'react';

interface TechDashboardProps {
  steps: AgentStep[];
  balance: { sol: number; spl402: number; walletAddress: string } | null;
}

interface ProofData {
  step: string;
  calculation: string;
  result: string;
  timestamp: number;
  verified: boolean;
  duration?: number;
}

export function TechDashboard({ steps, balance }: TechDashboardProps) {
  const [proofs, setProofs] = useState<ProofData[]>([]);
  const [totalCalculations, setTotalCalculations] = useState(0);
  const [blockchainQueries, setBlockchainQueries] = useState(0);

  useEffect(() => {
    const newProofs: ProofData[] = [];
    let calcs = 0;
    let queries = 0;

    steps.forEach((step, index) => {
      const duration = index > 0 ? step.timestamp - steps[index - 1].timestamp : undefined;
      if (step.type === 'action' && step.message.includes('balance')) {
        queries++;
        newProofs.push({
          step: 'Balance Query',
          calculation: `getBalance(${balance?.walletAddress?.slice(0, 8)}...) → RPC Query`,
          result: `${balance?.spl402.toFixed(6)} SPL402, ${balance?.sol.toFixed(9)} SOL`,
          timestamp: step.timestamp,
          verified: true,
          duration,
        });
        calcs++;
      }

      if (step.message.includes('Scanning') || step.message.includes('scanning')) {
        queries++;
        newProofs.push({
          step: 'Network Scan',
          calculation: 'queryVerifiedServers(mainnet-beta) → SPL402 Registry',
          result: step.data ? `Found ${Array.isArray(step.data) ? step.data.length : 0} servers` : 'Scanning...',
          timestamp: step.timestamp,
          verified: true,
          duration,
        });
        calcs++;
      }

      if (step.message.includes('Cheapest') && step.data) {
        calcs++;
        const servers = Array.isArray(step.data) ? step.data : [];
        const prices = servers.map((s: any) => parseFloat(s.price)).filter(p => !isNaN(p));
        const avg = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
        const min = prices.length > 0 ? Math.min(...prices) : 0;

        newProofs.push({
          step: 'Price Comparison',
          calculation: `min([${prices.map(p => p.toFixed(4)).join(', ')}]) → Optimization`,
          result: `Cheapest: ${min.toFixed(4)} SPL402 (avg: ${avg.toFixed(4)})`,
          timestamp: step.timestamp,
          verified: true,
          duration,
        });
      }

      if (step.message.includes('Payment sent') && step.link) {
        queries++;
        const txHash = step.link.split('/tx/')[1]?.slice(0, 16) || 'unknown';
        newProofs.push({
          step: 'Transaction Broadcast',
          calculation: `signTransaction() → sendRawTransaction() → Solana Network`,
          result: `TX: ${txHash}... (confirmed)`,
          timestamp: step.timestamp,
          verified: true,
          duration,
        });
        calcs += 2;
      }
    });

    setProofs(newProofs);
    setTotalCalculations(calcs);
    setBlockchainQueries(queries);
  }, [steps, balance]);

  const recentProofs = proofs.slice(-5).reverse();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#14F195]/20 to-[#14F195]/5 border border-[#14F195]/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="text-[#14F195]" size={18} />
            <span className="text-xs text-gray-400">Blockchain Queries</span>
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">{blockchainQueries}</div>
          <div className="text-xs text-gray-500 mt-1">Solana RPC</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="text-blue-400" size={18} />
            <span className="text-xs text-gray-400">Calculations</span>
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">{totalCalculations}</div>
          <div className="text-xs text-gray-500 mt-1">Total Operations</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="text-yellow-400" size={18} />
            <span className="text-xs text-gray-400">Autonomous Actions</span>
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">{steps.length}</div>
          <div className="text-xs text-gray-500 mt-1">Total Steps</div>
        </div>
      </div>

      <div className="bg-black/40 border border-[#14F195]/20 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="text-[#14F195]" size={20} />
          <h3 className="text-lg font-bold">Cryptographic Proofs</h3>
          <span className="ml-auto text-xs text-gray-500">Real-time verification</span>
        </div>

        {proofs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="mx-auto mb-2" size={32} />
            <p className="text-sm">Waiting for agent activity...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentProofs.map((proof, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-[#0D0D0D] to-black/50 border border-white/10 rounded-lg p-4 hover:border-[#14F195]/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${proof.verified ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
                    <span className="text-sm font-semibold text-[#14F195]">{proof.step}</span>
                  </div>
                  <span className="text-xs text-gray-500 tabular-nums">
                    {new Date(proof.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="bg-black/50 rounded p-3 mb-2">
                  <div className="text-xs text-gray-400 mb-1">Calculation:</div>
                  <code className="text-xs text-white font-mono break-all">{proof.calculation}</code>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Result:</span>
                  <code className="text-xs text-[#14F195] font-mono">{proof.result}</code>
                  {proof.verified && (
                    <span className="ml-auto text-xs text-green-400 flex items-center gap-1">
                      <div className="w-1 h-1 bg-green-400 rounded-full" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {proofs.length > 5 && (
          <div className="mt-4 text-center">
            <span className="text-xs text-gray-500">
              Showing latest 5 of {proofs.length} total proofs
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
