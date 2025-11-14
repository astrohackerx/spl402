// import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* <Logo size="sm" /> */}<p></p>
        <div className="flex items-center gap-8">
          <a href="/docs" className="text-gray-400 hover:text-[#14F195] text-sm transition-colors">Docs</a>
          <a href="/verify" className="text-gray-400 hover:text-[#14F195] text-sm transition-colors">Verify</a>
          <a href="/explorer" className="text-gray-400 hover:text-[#14F195] text-sm transition-colors">Explorer</a>
          <a href="https://github.com/astrohackerx/spl402" target="_blank" className="text-gray-400 hover:text-[#14F195] text-sm transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
