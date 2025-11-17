import { useEffect, useState } from 'react';

export function AnimatedRobot() {
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsThinking(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-32 h-32 mx-auto mb-6">
      <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF] to-[#14F195] rounded-3xl animate-pulse"
           style={{ animationDuration: '3s' }} />

      <svg
        viewBox="0 0 200 200"
        className="relative w-full h-full drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9945FF" />
            <stop offset="100%" stopColor="#14F195" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <rect x="50" y="60" width="100" height="90" rx="15" fill="#0D0D0D" stroke="url(#robotGradient)" strokeWidth="3" filter="url(#glow)" />

        <circle cx="80" cy="90" r="12" fill="url(#robotGradient)">
          <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="120" cy="90" r="12" fill="url(#robotGradient)">
          <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" begin="0.1s" />
        </circle>

        <rect x="85" y="110" width="30" height="3" rx="1.5" fill="url(#robotGradient)">
          <animate attributeName="width" values="30;20;30" dur="2s" repeatCount="indefinite" />
        </rect>

        <rect x="30" y="85" width="20" height="40" rx="5" fill="#0D0D0D" stroke="url(#robotGradient)" strokeWidth="2">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 40 105"
            to={isThinking ? "20 40 105" : "-20 40 105"}
            dur="1s"
            repeatCount="indefinite"
            additive="sum"
          />
        </rect>

        <rect x="150" y="85" width="20" height="40" rx="5" fill="#0D0D0D" stroke="url(#robotGradient)" strokeWidth="2">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 160 105"
            to={isThinking ? "-20 160 105" : "20 160 105"}
            dur="1s"
            repeatCount="indefinite"
            additive="sum"
          />
        </rect>

        <circle cx="70" cy="40" r="8" fill="url(#robotGradient)" opacity="0.8">
          <animate attributeName="cy" values="40;35;40" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="35" r="6" fill="url(#robotGradient)" opacity="0.6">
          <animate attributeName="cy" values="35;30;35" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="130" cy="40" r="8" fill="url(#robotGradient)" opacity="0.8">
          <animate attributeName="cy" values="40;35;40" dur="1.8s" repeatCount="indefinite" />
        </circle>

        <rect x="75" y="150" width="20" height="35" rx="5" fill="#0D0D0D" stroke="url(#robotGradient)" strokeWidth="2" />
        <rect x="105" y="150" width="20" height="35" rx="5" fill="#0D0D0D" stroke="url(#robotGradient)" strokeWidth="2" />
      </svg>

      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <div className="flex items-center gap-1 text-[#14F195] text-xs font-mono">
          <span className="animate-pulse">●</span>
          <span>ONLINE</span>
        </div>
      </div>
    </div>
  );
}
