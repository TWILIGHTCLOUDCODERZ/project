import { Zap } from 'lucide-react';

interface Props {
  onClick: () => void;
}

export default function AriesLauncher({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-5 z-[150] group flex items-center gap-2.5 pl-3 pr-4 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 border border-blue-400/30"
      aria-label="Open Aries AI Chatbot"
    >
      <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ring-1 ring-white/20">
        <Zap className="w-4 h-4 text-white fill-white" />
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-blue-700" />
      </div>
      <span className="text-sm font-bold tracking-wide">Aries</span>
      <span className="hidden sm:inline text-[10px] font-medium text-blue-200 tracking-wider uppercase">AI Assistant</span>
    </button>
  );
}
