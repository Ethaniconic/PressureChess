import React from 'react';

export const GlassCard = ({ children, className = '', glow = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-2xl bg-dark-900/60 backdrop-blur-xl border border-white/[0.08]
        transition-all duration-300
        ${glow ? 'shadow-glow-emerald border-emerald-500/30' : 'hover:border-white/20'}
        ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
