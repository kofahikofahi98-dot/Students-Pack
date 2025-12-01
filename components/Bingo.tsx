


import React, { useState, useEffect } from 'react';
import { BingoCell, Language } from '../types';
import { BINGO_DATA, TRANSLATIONS } from '../constants';
import { Trophy, RefreshCw, LayoutGrid } from 'lucide-react';

interface BingoProps {
  lang: Language;
}

type BingoMode = 'general' | 'exams' | 'online';

const Bingo: React.FC<BingoProps> = ({ lang }) => {
  const [mode, setMode] = useState<BingoMode>('general');
  const [grid, setGrid] = useState<BingoCell[]>(BINGO_DATA.general);
  const [hasBingo, setHasBingo] = useState(false);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    // Reset grid when mode changes
    setGrid(BINGO_DATA[mode]);
    setHasBingo(false);
  }, [mode]);

  useEffect(() => {
    checkWin();
  }, [grid]);

  const toggleCell = (id: number) => {
    setGrid(grid.map(cell => cell.id === id ? { ...cell, checked: !cell.checked } : cell));
  };

  const resetBingo = () => {
      setGrid(BINGO_DATA[mode].map(c => c.id === 12 ? c : {...c, checked: false}));
      setHasBingo(false);
  };

  const checkWin = () => {
      // 5x5 grid logic
      const size = 5;
      const isChecked = (idx: number) => grid[idx].checked;

      let win = false;

      // Rows
      for(let i=0; i<size; i++) {
          if ([0,1,2,3,4].every(offset => isChecked(i*size + offset))) win = true;
      }
      // Cols
      for(let i=0; i<size; i++) {
          if ([0,1,2,3,4].every(offset => isChecked(i + offset*size))) win = true;
      }
      // Diagonals
      if ([0, 6, 12, 18, 24].every(idx => isChecked(idx))) win = true;
      if ([4, 8, 12, 16, 20].every(idx => isChecked(idx))) win = true;

      if (win && !hasBingo) {
          setHasBingo(true);
      } else if (!win) {
          setHasBingo(false);
      }
  };

  return (
    <div className="max-w-4xl mx-auto relative">
        {hasBingo && (
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="bg-yellow-400 text-black px-12 py-6 rounded-3xl transform rotate-[-5deg] shadow-2xl border-4 border-black animate-bounce">
                    <h1 className="text-6xl font-black">BINGO!</h1>
                    <p className="text-center font-bold">{lang === 'ar' ? 'مبروك التخرج!' : 'You Survived!'}</p>
                </div>
            </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
                <h2 className="text-3xl font-black text-gray-800">{t.playBingo}</h2>
                <p className="text-gray-500 text-sm">{lang === 'ar' ? 'جمع ٥ مربعات عشان تفوز' : 'Get 5 in a row to win!'}</p>
            </div>
            
            <div className="flex gap-2">
                 <select 
                    value={mode} 
                    onChange={(e) => setMode(e.target.value as BingoMode)}
                    className="bg-white border border-gray-200 px-4 py-2 rounded-full font-bold text-gray-700 shadow-sm outline-none focus:border-student-blue"
                 >
                    <option value="general">{t.modeGeneral}</option>
                    <option value="exams">{t.modeExams}</option>
                    <option value="online">{t.modeOnline}</option>
                 </select>

                <button 
                    onClick={resetBingo}
                    className="flex items-center gap-2 text-sm bg-white border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50 text-gray-600 font-bold shadow-sm transition"
                >
                    <RefreshCw size={14} /> Reset
                </button>
            </div>
        </div>
        
        <div className="grid grid-cols-5 gap-2 md:gap-3 bg-gray-900 p-3 md:p-4 rounded-3xl shadow-2xl ring-4 ring-gray-900/10">
            {grid.map((cell) => (
                <button
                    key={cell.id}
                    onClick={() => toggleCell(cell.id)}
                    className={`
                        aspect-square flex flex-col items-center justify-center p-1 md:p-2 text-center rounded-xl transition-all duration-200
                        ${cell.checked 
                            ? 'bg-yellow-400 text-black shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)] transform scale-95' 
                            : 'bg-white text-gray-800 hover:bg-blue-50 shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:-translate-y-1'}
                        ${cell.id === 12 ? 'bg-yellow-200 cursor-default' : ''}
                    `}
                >
                    {cell.checked && <Trophy size={16} className="mb-1 opacity-50" />}
                    <span className={`text-[9px] md:text-xs font-bold leading-tight select-none ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
                        {lang === 'ar' ? cell.textAr : cell.textEn}
                    </span>
                </button>
            ))}
        </div>
        
        <div className="mt-8 text-center bg-blue-50 p-4 rounded-xl border border-blue-100">
             <p className="text-blue-800 font-bold text-sm">
                {lang === 'ar' ? "📸 صور الشاشة لما تفوز وشاركها ستوري!" : "📸 Screenshot when you win and share to your story!"}
             </p>
        </div>
    </div>
  );
};

export default Bingo;
