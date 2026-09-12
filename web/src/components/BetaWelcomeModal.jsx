import React from 'react';
import { useBeta } from '../context/BetaContext';
import { 
  Sparkles, 
  GraduationCap, 
  Zap, 
  Bot, 
  Swords, 
  X, 
  ArrowRight,
  MessageSquareHeart
} from 'lucide-react';

export const BetaWelcomeModal = ({ onNavigate }) => {
  const { showWelcomeModal, closeWelcomeModal } = useBeta();

  if (!showWelcomeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl p-6 sm:p-8 rounded-[5px] bg-[#0D0E11] border border-[#272932] border-t-white/20 shadow-2xl shadow-black/90 overflow-hidden text-center">
        
        {/* Subtle royal sheen */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#E5A93C]/[0.05] via-transparent to-transparent pointer-events-none" />

        {/* Close Icon Button */}
        <button
          onClick={closeWelcomeModal}
          className="absolute top-4 right-4 p-2 rounded-[4px] text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 space-y-5">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] bg-[#E5A93C]/15 border border-[#E5A93C]/40 border-t-white/30 text-[#E5A93C] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#E5A93C] animate-pulse" />
            <span>Public Beta Launch • Free For All</span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5A93C] to-[#F5C768]">PressureChess</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              You are among the first to experience tactical mastery under intense time pressure.
            </p>
          </div>

          {/* Founding Player Badge Card Showcase */}
          <div className="p-4 rounded-[5px] bg-[#121317] border border-[#252830] border-t-white/20 shadow-inner flex items-center gap-4 text-left">
            <div className="w-13 h-13 rounded-[4px] bg-[#1A1C22] border border-[#E5A93C]/50 p-0.5 shrink-0 flex items-center justify-center text-2xl shadow-[0_0_12px_rgba(229,169,60,0.2)]">
              🌟
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">Founding Beta Player</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-[3px] bg-[#E5A93C]/20 text-[#F5C768] border border-[#E5A93C]/35">
                  Lifetime Badge
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Your account is granted Founding Player status, an exclusive royal black & gold profile frame, and permanent Pioneer recognition!
              </p>
            </div>
          </div>

          {/* 4 Pillars of the 100% Free Beta */}
          <div className="grid grid-cols-2 gap-2.5 text-left text-xs">
            <div className="p-3 rounded-[5px] bg-[#121317] border border-[#252830] flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-[#E5A93C] shrink-0" />
              <div>
                <div className="font-bold text-white text-[11px]">All 17 Units Unlocked</div>
                <div className="text-[10px] text-slate-400">Complete curriculum</div>
              </div>
            </div>

            <div className="p-3 rounded-[5px] bg-[#121317] border border-[#252830] flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-[#E5A93C] shrink-0" />
              <div>
                <div className="font-bold text-white text-[11px]">Unlimited Tactics</div>
                <div className="text-[10px] text-slate-400">10s–30s countdown rush</div>
              </div>
            </div>

            <div className="p-3 rounded-[5px] bg-[#121317] border border-[#252830] flex items-center gap-2.5">
              <Bot className="w-4 h-4 text-slate-300 shrink-0" />
              <div>
                <div className="font-bold text-white text-[11px]">Unlimited AI Coach</div>
                <div className="text-[10px] text-slate-400">Coach Orion & Stockfish</div>
              </div>
            </div>

            <div className="p-3 rounded-[5px] bg-[#121317] border border-[#252830] flex items-center gap-2.5">
              <Swords className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-white text-[11px]">Free Multiplayer</div>
                <div className="text-[10px] text-slate-400">Ranked Bullet, Blitz, Rapid</div>
              </div>
            </div>
          </div>

          {/* Feedback Invitation Notice */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
            <MessageSquareHeart className="w-4 h-4 text-rose-400" />
            <span>Help us shape the app: Send bugs and ideas anytime via the Feedback button.</span>
          </div>

          {/* Launch Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={closeWelcomeModal}
              className="flex-1 py-3.5 px-6 rounded-[5px] bg-[#E5A93C] hover:bg-[#F3BA54] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(229,169,60,0.3)] hover:scale-[1.01] transition-all"
            >
              <span>Claim Founding Badge & Enter</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                closeWelcomeModal();
                if (onNavigate) onNavigate('changelog');
              }}
              className="py-3 px-4 rounded-[5px] bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-[#262830] text-xs font-bold transition-colors"
            >
              View Changelog
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
