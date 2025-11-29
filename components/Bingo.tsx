import React, { useState } from 'react';
import { BingoCell, Language } from '../types';
import { INITIAL_BINGO, TRANSLATIONS } from '../constants';

interface BingoProps {
  lang: Language;
}

const Bingo: React.FC<BingoProps> = ({ lang }) => {
  const [grid, setGrid] = useState<BingoCell[]>(INITIAL_BINGO);
  const t = TRANSLATIONS[lang];

  const toggleCell = (id: number) => {
    setGrid(grid.map(cell => cell.id === id ? { ...cell, checked: !cell.checked } : cell));
  };

  const resetBingo = () => {
      setGrid(INITIAL_BINGO.map(c => c.id === 12 ? c : {...c, checked: false}));
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-jordan-red drop-shadow-sm">{t.playBingo}</h2>
            <button 
                onClick={resetBingo}
                className="text-sm bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-600"
            >
                Reset
            </button>
        </div>
        
        <div className="grid grid-cols-5 gap-2 md:gap-4 bg-gray-800 p-2 md:p-4 rounded-xl shadow-2xl">
            {grid.map((cell) => (
                <button
                    key={cell.id}
                    onClick={() => toggleCell(cell.id)}
                    className={`
                        aspect-square flex items-center justify-center p-1 md:p-2 text-center rounded-md transition-all transform hover:scale-105
                        ${cell.checked 
                            ? 'bg-highlight-yellow text-black font-bold ring-4 ring-yellow-500/50' 
                            : 'bg-white text-gray-800 hover:bg-gray-100'}
                        ${cell.id === 12 ? 'bg-yellow-200 cursor-default' : ''}
                    `}
                >
                    <span className="text-[10px] md:text-sm leading-tight select-none">
                        {lang === 'ar' ? cell.textAr : cell.textEn}
                    </span>
                </button>
            ))}
        </div>
        
        <div className="mt-8 text-center">
             <p className="text-gray-500 italic text-sm">
                {lang === 'ar' ? "صور الشاشة وشاركها مع أصحابك!" : "Screenshot this and share with your friends!"}
             </p>
        </div>
    </div>
  );
};

export default Bingo;