import React from 'react';

export const GlassCard = ({ children, className = '', glow = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-3xl bg-[#1a243e]/80 backdrop-blur-2xl border border-white/[0.12]
        border-t-white/35 overflow-hidden shadow-xl shadow-black/25
        transition-all duration-300
        ${glow ? 'shadow-glow-cyan border-cyan-400/40 border-t-white/60' : 'hover:border-white/25 hover:border-t-white/50'}
        ${onClick ? 'cursor-pointer hover:-translate-y-0.5 active:scale-[0.99]' : ''}
        ${className}
      `}
    >
      {/* iOS Specular Top Reflection / Light Sheen */}
      <div 
        className="pointer-events-none absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/[0.09] via-white/[0.02] to-transparent rounded-t-3xl" 
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

