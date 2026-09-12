import React from 'react';

export const GlassCard = ({ children, className = '', glow = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-[5px] bg-[#101114]/90 backdrop-blur-xl border border-[#24262D]
        border-t-white/20 overflow-hidden shadow-lg shadow-black/60
        transition-all duration-200 ease-out
        ${glow ? 'shadow-[0_0_16px_rgba(229,169,60,0.22)] border-[#E5A93C]/60 border-t-[#F5C768]' : 'hover:border-[#383B45] hover:border-t-white/35'}
        ${onClick ? 'cursor-pointer hover:-translate-y-0.5 active:scale-[0.99]' : ''}
        ${className}
      `}
    >
      {/* Subtle Specular Top Reflection / Light Sheen */}
      <div 
        className="pointer-events-none absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-white/[0.04] via-transparent to-transparent rounded-t-[5px]" 
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};


