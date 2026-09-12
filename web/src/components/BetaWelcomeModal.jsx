import React from 'react';
import { useBeta } from '../context/BetaContext';
import { 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Zap, 
  Bot, 
  Swords, 
  GraduationCap, 
  X, 
  ArrowRight,
  MessageSquareHeart
} from 'lucide-react';

export const BetaWelcomeModal = ({ onNavigate }) => {
  const { showWelcomeModal, closeWelcomeModal, betaConfig } = useBeta();

  if (!showWelcomeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-dark-900 via-dark-850 to-dark-950 border border-cyan-400/50 shadow-2xl shadow-cyan-950/60 overflow-hidden text-center">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Icon Button */}
        <button
          onClick={closeWelcomeModal}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 space-y-5">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-amber-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Public Beta Launch • Free For All</span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">PressureChess</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              You are among the first to experience tactical mastery under time pressure.
            </p>
          </div>

          {/* Founding Player Badge Card Showcase */}
          <div className="p-4 rounded-2xl bg-dark-950/80 border border-white/10 shadow-inner flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-amber-500 p-0.5 shrink-0 shadow-glow-cyan">
              <div className="w-full h-full bg-dark-900 rounded-[14px] flex items-center justify-center text-2xl">
                🌟
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">Founding Beta Player</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Lifetime Badge
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Your account is granted Founding Player status, an exclusive cyan-gold profile frame, and permanent Pioneer recognition!
              </p>
            </div>
          </div>

          {/* 4 Pillars of the 100% Free Beta */}
          <div className="grid grid-cols-2 gap-2.5 text-left text-xs">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="font-bold text-white text-[11px]">All 17 Units Unlocked</div>
                <div className="text-[10px] text-slate-400">Complete curriculum</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="font-bold text-white text-[11px]">Unlimited Tactics</div>
                <div className="text-[10px] text-slate-400">10s–30s countdown rush</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2.5">
              <Bot className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="font-bold text-white text-[11px]">Unlimited AI Coach</div>
                <div className="text-[10px] text-slate-400">Coach Orion & Stockfish</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2.5">
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
              className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-cyan hover:scale-[1.02] transition-all"
            >
              <span>Claim Founding Badge & Enter</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                closeWelcomeModal();
                if (onNavigate) onNavigate('changelog');
              }}
              className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-colors"
            >
              View Changelog
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
