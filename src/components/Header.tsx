import { useState } from 'react';
import { Menu, X, Github } from 'lucide-react';
import { Logo } from './Logo';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-[#14F195]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Logo size="sm" />

        <nav className="hidden lg:flex items-center gap-8">
          <a href="/" className="text-gray-400 hover:text-[#14F195] transition-colors text-sm">Home</a>

          {/* <a href="/verify" className="text-gray-400 hover:text-[#14F195] transition-colors text-sm">Verify</a>
          <a href="/explorer" className="text-gray-400 hover:text-[#14F195] transition-colors text-sm">Explorer</a> */}
          
           
           <a href="/templates" className="text-gray-400 hover:text-[#14F195] transition-colors text-sm">Templates</a>
           <a href="/proxy" className="text-gray-400 hover:text-[#14F195] transition-colors text-sm">Proxy</a>
            <a href="/docs" className="text-gray-400 hover:text-[#14F195] transition-colors text-sm">Docs</a>
          <a
            href="https://github.com/astrohackerx/spl402"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-[#9945FF] hover:bg-[#9945FF]/80 rounded-lg transition-colors text-sm font-medium"
          >
            <Github size={16} />
            GitHub
          </a>
        </nav>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl">
          <nav className="flex flex-col px-4 py-4 space-y-3">
            <a href="/" className="text-gray-400 hover:text-[#14F195] transition-colors text-sm py-2" onClick={() => setMobileMenuOpen(false)}>Home</a>
            {/* <a href="/verify" className="text-gray-400 hover:text-[#14F195] transition-colors text-sm py-2" onClick={() => setMobileMenuOpen(false)}>Verify</a>
            <a href="/explorer" className="text-gray-400 hover:text-[#14F195] transition-colors text-sm py-2" onClick={() => setMobileMenuOpen(false)}>Explorer</a> */}
            
           
            <a href="/templates" className="text-gray-400 hover:text-[#14F195] transition-colors text-sm py-2" onClick={() => setMobileMenuOpen(false)}>Templates</a>
             <a href="/proxy" className="text-gray-400 hover:text-[#14F195] transition-colors text-sm py-2" onClick={() => setMobileMenuOpen(false)}>Proxy</a>
<a href="/docs" className="text-gray-400 hover:text-[#14F195] transition-colors text-sm py-2" onClick={() => setMobileMenuOpen(false)}>Docs</a>
            <a
              href="https://github.com/astrohackerx/spl402"
              target="_blank"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#9945FF] hover:bg-[#9945FF]/80 rounded-lg transition-colors text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Github size={16} />
              GitHub
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
