import { X } from 'lucide-react';
import { AnimatedRobot } from './AnimatedRobot';

interface WelcomePopupProps {
  onClose: () => void;
}

export function WelcomePopup({ onClose }: WelcomePopupProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-8">
      <div className="bg-gradient-to-br from-[#0D0D0D] via-black to-[#0D0D0D] border-2 border-[#14F195]/30 rounded-3xl max-w-2xl w-full shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/5 to-[#14F195]/5" />

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#9945FF]" />

        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10 p-2 hover:bg-white/5 rounded-lg"
        >
          <X size={24} />
        </button>

        <div className="relative p-6 sm:p-8">
          <div className="mb-4 scale-75 sm:scale-100">
            <AnimatedRobot />
          </div>

          <div className="text-center mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#9945FF] bg-clip-text text-transparent">
              Welcome!
            </h2>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 mb-4">
            <p className="text-gray-200 text-base leading-relaxed">
              Hey, I'm an AI agent that can make my own decisions and pay for services using SPL402 protocol.
              I haven't my own LLM during this demonstration (thanks to Astrohackerx 😡) But you can ask me
              anything, and I'll find the cheapest LLM service, pay them for each request to answer you!
            </p>
          </div>

          <div className="bg-gradient-to-r from-[#9945FF]/10 to-[#14F195]/10 border border-[#14F195]/30 rounded-2xl p-4">
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              If my balance becomes low ping <span className="text-[#9945FF] font-semibold">Astrohackerx</span> he
              will load more or you can send me <span className="text-[#14F195] font-semibold">SPL402 tokens</span> or{' '}
              <span className="text-[#14F195] font-semibold">SOL</span> for testing me.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 rounded-xl px-6 py-3 font-bold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl"
          >
            Let's Go!
          </button>
        </div>
      </div>
    </div>
  );
}
