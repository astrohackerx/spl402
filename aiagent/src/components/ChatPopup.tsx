import { useState } from 'react';
import { Send, Loader2, MessageSquare, X, Minimize2 } from 'lucide-react';

interface ChatPopupProps {
  chatHistory: Array<{ role: 'user' | 'agent'; content: string }>;
  message: string;
  setMessage: (msg: string) => void;
  handleSendMessage: () => void;
  isProcessing: boolean;
  noWallet: boolean;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
}

export function ChatPopup({
  chatHistory,
  message,
  setMessage,
  handleSendMessage,
  isProcessing,
  noWallet,
  chatOpen,
  setChatOpen,
}: ChatPopupProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  if (!chatOpen) {
    return (
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-[#9945FF] to-[#14F195] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        <MessageSquare size={28} className="text-white" />
        {chatHistory.length > 0 && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-black">
            {chatHistory.length}
          </div>
        )}
      </button>
    );
  }

  return (
    <div
      className={`fixed right-6 bg-black/95 backdrop-blur-xl border border-[#14F195]/30 rounded-2xl shadow-2xl z-50 transition-all ${
        isMinimized
          ? 'bottom-6 w-80'
          : 'bottom-6 w-96 h-[600px]'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <h3 className="font-bold text-white">Chat with Agent</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <Minimize2 size={18} />
          </button>
          <button
            onClick={() => setChatOpen(false)}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="h-[460px] overflow-y-auto p-4 space-y-3">
            {chatHistory.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare size={48} className="mx-auto mb-3 text-gray-600" />
                  <p className="text-gray-500 text-sm">Ask me anything to get started!</p>
                </div>
              </div>
            ) : (
              chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-3 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white'
                        : 'bg-white/10 text-gray-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            )}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-xl p-3 flex items-center gap-2">
                  <Loader2 className="animate-spin text-[#14F195]" size={16} />
                  <p className="text-sm text-gray-300">Thinking...</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                disabled={isProcessing || noWallet}
                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#14F195]/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={isProcessing || !message.trim() || noWallet}
                className="bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-4 py-2 font-semibold transition-all flex items-center gap-2"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {isMinimized && (
        <div className="p-4">
          <p className="text-gray-400 text-sm">
            {chatHistory.length > 0
              ? `${chatHistory.length} message${chatHistory.length !== 1 ? 's' : ''}`
              : 'No messages yet'}
          </p>
        </div>
      )}
    </div>
  );
}
