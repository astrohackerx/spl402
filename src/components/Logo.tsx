export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { container: 'h-8', icon: 'h-8 w-8', text: 'text-xl' },
    md: { container: 'h-10', icon: 'h-10 w-10', text: 'text-2xl' },
    lg: { container: 'h-16', icon: 'h-16 w-16', text: 'text-5xl' }
  };

  const { container, icon, text } = sizes[size];

  return (
    <div className={`${container} flex items-center gap-3`}>
      {/* <img src="/logo-icon.svg" alt="SPL-402" className={icon} /> */}
      <div className={`font-mono font-black tracking-tighter ${text}`}>
        <span className="text-[#14F195]">spl</span>
        <span className="text-[#9945FF]">402</span>
      </div>
    </div>
  );
}

export function LogoIcon({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { container: 'w-12 h-12', text: 'text-xs' },
    md: { container: 'w-20 h-20', text: 'text-sm' },
    lg: { container: 'w-32 h-32', text: 'text-lg' }
  };

  const { container, text } = sizes[size];

  return (
    <div className={`${container} relative group cursor-pointer`}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF] to-[#14F195] rounded opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
      <div className="relative w-full h-full bg-black border-2 border-[#14F195]/40 rounded-lg flex flex-col items-center justify-center font-mono group-hover:border-[#14F195]/60 transition-colors">
        <div className={`${text} text-[#14F195] font-bold mb-1`}>&gt; spl</div>
        <div className={`${text} text-[#9945FF] font-bold`}>402_</div>
      </div>
    </div>
  );
}
