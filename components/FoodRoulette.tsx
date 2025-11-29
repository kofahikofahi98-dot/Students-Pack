import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, FOOD_ITEMS } from '../constants';
import { Utensils, RotateCcw } from 'lucide-react';

interface FoodRouletteProps {
    lang: Language;
}

const FoodRoulette: React.FC<FoodRouletteProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [spinning, setSpinning] = useState(false);
    const [selectedFood, setSelectedFood] = useState<string | null>(null);

    const spin = () => {
        if (spinning) return;
        setSpinning(true);
        setSelectedFood(null);

        let counter = 0;
        const interval = setInterval(() => {
            counter++;
            const randomIdx = Math.floor(Math.random() * FOOD_ITEMS.length);
            setSelectedFood(FOOD_ITEMS[randomIdx].id);
            
            if (counter > 15) {
                clearInterval(interval);
                setSpinning(false);
            }
        }, 150);
    };

    const currentItem = FOOD_ITEMS.find(f => f.id === selectedFood);

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border-4 border-highlight-yellow text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
                <Utensils className="text-orange-500" />
                {t.foodRoulette}
            </h3>

            <div className="h-40 flex items-center justify-center mb-8">
                {currentItem ? (
                    <div className={`transform transition-all duration-200 ${spinning ? 'scale-110' : 'scale-100'}`}>
                        <div className="text-8xl mb-2 filter drop-shadow-md">{currentItem.icon}</div>
                        {!spinning && (
                            <div className="animate-bounce-in">
                                <p className="text-sm text-gray-400 font-bold uppercase">{t.eatThis}</p>
                                <h4 className="text-2xl font-black text-gray-800 mt-1">
                                    {lang === 'ar' ? currentItem.nameAr : currentItem.nameEn}
                                </h4>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-6xl opacity-20">❓</div>
                )}
            </div>

            <button 
                onClick={spin}
                disabled={spinning}
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-xl hover:bg-orange-600 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
                <RotateCcw className={spinning ? "animate-spin" : ""} />
                {t.spin}
            </button>
        </div>
    );
};

export default FoodRoulette;