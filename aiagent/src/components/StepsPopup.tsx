import { Brain, CheckCircle, XCircle, ExternalLink, ChevronDown, ChevronUp, X } from 'lucide-react';
import { AgentStep } from '../lib/aiagent';
import { useState, useEffect, useRef } from 'react';

interface StepsPopupProps {
  steps: AgentStep[];
  isOpen: boolean;
  onClose: () => void;
}

export function StepsPopup({ steps, isOpen, onClose }: StepsPopupProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current && steps.length > 0) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [steps.length]);

  const toggleStep = (index: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSteps(newExpanded);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className="fixed inset-4 md:inset-8 lg:inset-16 bg-gradient-to-br from-black via-[#0A0A0A] to-black border border-[#9945FF]/30 rounded-2xl shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Brain className="text-[#9945FF]" size={24} />
            <h3 className="text-xl font-bold">Agent Thinking Process</h3>
            <span className="text-sm text-gray-400">({steps.length} steps)</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {steps.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No steps yet...</p>
            </div>
          ) : (
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
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
