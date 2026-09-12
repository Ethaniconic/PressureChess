import React from 'react';
import { ChessPiece } from '../../utils/chessPieces';

const PIECE_VALUES = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

export const CapturedPieces = ({ capturedPieces = [], color = 'w', advantage = 0 }) => {
  // Group pieces: e.g. { p: 2, n: 1 }
  const counts = capturedPieces.reduce((acc, p) => {
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});

  const order = ['q', 'r', 'b', 'n', 'p'];

  return (
    <div className="flex items-center gap-1.5 min-h-[28px] px-2 py-1 rounded-xl bg-dark-900/40 border border-white/[0.04]">
      <div className="flex items-center -space-x-1">
        {order.map((type) => {
          const count = counts[type];
          if (!count) return null;
          return (
            <div key={type} className="flex items-center relative">
              <div className="w-5 h-5 flex items-center justify-center opacity-85">
                <ChessPiece type={type} color={color} className="w-4 h-4" />
              </div>
              {count > 1 && (
                <span className="text-[10px] font-bold text-slate-400 ml-0.5">
                  ×{count}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {advantage > 0 && (
        <span className="ml-1 text-[11px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded-md">
          +{advantage}
        </span>
      )}
    </div>
  );
};
