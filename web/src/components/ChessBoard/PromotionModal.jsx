import React from 'react';
import { ChessPiece } from '../../utils/chessPieces';

export const PromotionModal = ({ isOpen, color, onSelectPiece }) => {
  if (!isOpen) return null;

  const pieces = ['q', 'r', 'b', 'n'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-dark-900 border border-gold-500/40 rounded-3xl p-6 shadow-glow-gold max-w-sm w-full mx-4 text-center">
        <h3 className="text-xl font-bold text-white mb-1">Pawn Promotion</h3>
        <p className="text-xs text-slate-400 mb-6">Choose a piece to upgrade your pawn:</p>
        
        <div className="grid grid-cols-4 gap-3">
          {pieces.map((p) => (
            <button
              key={p}
              onClick={() => onSelectPiece(p)}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-dark-800 hover:bg-gold-500/20 border border-white/10 hover:border-gold-400 transition-all duration-200 group hover:scale-105"
            >
              <div className="w-14 h-14 flex items-center justify-center">
                <ChessPiece type={p} color={color} className="w-12 h-12" />
              </div>
              <span className="text-[11px] font-bold text-slate-300 group-hover:text-gold-300 uppercase mt-1">
                {p === 'q' ? 'Queen' : p === 'r' ? 'Rook' : p === 'b' ? 'Bishop' : 'Knight'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
