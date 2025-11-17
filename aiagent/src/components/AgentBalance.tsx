import { Wallet, ExternalLink, Copy, Check } from 'lucide-react';
import { AgentBalance } from '../../lib/aiagent';
import { useState } from 'react';

interface AgentBalanceProps {
  balance: AgentBalance | null;
  loading: boolean;
}

export function AgentBalanceDisplay({ balance, loading }: AgentBalanceProps) {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (balance?.walletAddress) {
      navigator.clipboard.writeText(balance.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isLowBalance = balance && balance.spl402 < 1;
  const isZeroBalance = balance && balance.spl402 === 0;

  return (
    <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/30 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Wallet className="text-[#14F195]" size={24} />
        <h2 className="text-xl font-bold">Agent Wallet</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#14F195]"></div>
        </div>
      ) : balance ? (
        <div className="space-y-4">
          <div className="bg-black/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Address</span>
              <button
                onClick={copyAddress}
                className="flex items-center gap-1 text-[#14F195] hover:text-[#14F195]/80 transition-colors text-xs"
              >
                {copied ? (
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
            <a
              href={`https://solscan.io/account/${balance.walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white hover:text-[#14F195] transition-colors group"
            >
              <span className="font-mono text-sm break-all">{balance.walletAddress}</span>
              <ExternalLink size={14} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">SOL Balance</p>
              <p className="text-2xl font-bold text-white">{balance.sol.toFixed(4)}</p>
            </div>

            <div className={`rounded-xl p-4 ${
              isZeroBalance
                ? 'bg-red-500/20 border border-red-500/30'
                : isLowBalance
                ? 'bg-yellow-500/20 border border-yellow-500/30'
                : 'bg-black/30'
            }`}>
              <p className="text-gray-400 text-sm mb-1">SPL402 Balance</p>
              <p className={`text-2xl font-bold ${
                isZeroBalance ? 'text-red-400' : isLowBalance ? 'text-yellow-400' : 'text-[#14F195]'
              }`}>
                {balance.spl402.toFixed(2)}
              </p>
            </div>
          </div>

          {(isLowBalance || isZeroBalance) && (
            <div className={`rounded-xl p-4 ${
              isZeroBalance ? 'bg-red-500/10 border border-red-500/30' : 'bg-yellow-500/10 border border-yellow-500/30'
            }`}>
              <p className={`font-medium mb-2 ${isZeroBalance ? 'text-red-400' : 'text-yellow-400'}`}>
                {isZeroBalance ? '⚠️ Out of Funds!' : '⚠️ Low Balance!'}
              </p>
              <p className="text-gray-300 text-sm">
                Send SPL402 tokens to keep me running, or ping AstrohackerX to top me up... he said he would lol 😂
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">No wallet configured</p>
        </div>
      )}
    </div>
  );
}
