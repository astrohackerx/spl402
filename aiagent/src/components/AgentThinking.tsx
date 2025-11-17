import { Brain, CheckCircle, XCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { AgentStep } from '../../lib/aiagent';
import { useState } from 'react';

interface AgentThinkingProps {
  steps: AgentStep[];
}

export function AgentThinking({ steps }: AgentThinkingProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSteps(newExpanded);
  };

  const getTimeSincePrevious = (index: number): number | null => {
    if (index === 0) return null;
    return steps[index].timestamp - steps[index - 1].timestamp;
  };

  if (steps.length === 0) return null;

  return (
    <div className="bg-black/30 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="text-[#9945FF]" size={24} />
        <h3 className="text-xl font-bold">Agent Thinking Process</h3>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`rounded-xl p-4 ${
              step.type === 'error'
                ? 'bg-red-500/10 border border-red-500/30'
                : step.type === 'success'
                ? 'bg-green-500/10 border border-green-500/30'
                : step.type === 'proof'
                ? 'bg-[#14F195]/10 border border-[#14F195]/30'
                : 'bg-[#9945FF]/10 border border-[#9945FF]/30'
            }`}
          >
            <div className="flex items-start gap-3">
              {step.type === 'error' ? (
                <XCircle className="text-red-400 flex-shrink-0 mt-1" size={18} />
              ) : step.type === 'success' ? (
                <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={18} />
              ) : (
                <div className="w-2 h-2 bg-[#9945FF] rounded-full flex-shrink-0 mt-2 animate-pulse" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm font-medium ${
                    step.type === 'error' ? 'text-red-400' : 'text-white'
                  }`}>
                    {step.message}
                  </p>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {new Date(step.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                {step.link && (
                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#14F195] hover:text-[#14F195]/80 transition-colors text-xs mt-2"
                  >
                    View on Solscan
                    <ExternalLink size={12} />
                  </a>
                )}

                {step.data && (
                  <div className="mt-2">
                    <button
                      onClick={() => toggleStep(index)}
                      className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-xs"
                    >
                      {expandedSteps.has(index) ? (
                        <>
                          <ChevronUp size={14} />
                          Hide details
                        </>
                      ) : (
                        <>
                          <ChevronDown size={14} />
                          Show details
                        </>
                      )}
                    </button>
                    {expandedSteps.has(index) && (
                      <pre className="mt-2 bg-black/50 rounded-lg p-3 text-xs text-gray-300 overflow-x-auto">
                        {JSON.stringify(step.data, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
