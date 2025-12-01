
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, FOOD_ITEMS } from '../constants';
import { Utensils, RotateCcw, Share2 } from 'lucide-react';

interface FoodRouletteProps {
    lang: Language;
}

const FoodRoulette: React.FC<FoodRouletteProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [spinning, setSpinning] = useState(false);
    const [selectedFood, setSelectedFood] = useState<string | null>(null);
    const [isBroke, setIsBroke] = useState(true);

    const spin = () => {
        if (spinning) return;
        
        // Filter items based on budget
        const items = FOOD_ITEMS.filter(item => isBroke ? item.isCheap : true);

        setSpinning(true);
        setSelectedFood(null);

        let counter = 0;
        const maxSpins = 20;
        const speed = 100;

        const interval = setInterval(() => {
            counter++;
            const randomIdx = Math.floor(Math.random() * items.length);
            setSelectedFood(items[randomIdx].id);
            
            if (counter > maxSpins) {
                clearInterval(interval);
                setSpinning(false);
            }
        }, speed);
    };

    const handleShare = async () => {
        if (!currentItem) return;
        const foodName = lang === 'ar' ? currentItem.nameAr : currentItem.nameEn;
        if (navigator.share) {
            await navigator.share({
                title: 'Food Roulette',
                text: `I'm eating ${foodName} today! 🎲`,
            }).catch(console.error);
        }
    };

    const currentItem = FOOD_ITEMS.find(f => f.id === selectedFood);

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-2xl border-4 border-orange-400 text-center relative overflow-hidden">
             {/* Decorative Dots */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-orange-200 rounded-full"></div>
            <div className="absolute top-2 right-2 w-3 h-3 bg-orange-200 rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 bg-orange-200 rounded-full"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-orange-200 rounded-full"></div>

            <div className="relative">
                <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center justify-center gap-2">
                    <span className="bg-orange-100 p-2 rounded-lg text-orange-600"><Utensils size={24} /></span>
                    {t.foodRoulette}
                </h3>
                 {currentItem && !spinning && (
                    <button 
                        onClick={handleShare}
                        className="absolute top-0 right-0 text-orange-400 hover:text-orange-600"
                    >
                        <Share2 size={20} />
                    </button>
                )}
            </div>

            {/* Budget Switch */}
            <div className="flex justify-center mb-6">
                <div className="bg-gray-100 p-1 rounded-full flex relative w-full max-w-[280px]">
                    <button 
                        onClick={() => setIsBroke(true)}
                        className={`flex-1 py-2 rounded-full text-xs font-bold transition-all z-10 ${isBroke ? 'text-white' : 'text-gray-500'}`}
                    >
                        {t.budgetBroke}
                    </button>
                    <button 
                        onClick={() => setIsBroke(false)}
                        className={`flex-1 py-2 rounded-full text-xs font-bold transition-all z-10 ${!isBroke ? 'text-white' : 'text-gray-500'}`}
                    >
                        {t.budgetRich}
                    </button>
                    
                    {/* Animated slider background */}
                    <div 
                        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-orange-500 rounded-full transition-all duration-300 ${isBroke ? 'left-1' : 'left-[calc(50%+4px)]'}`}
                    ></div>
                </div>
            </div>

            <div className="h-56 bg-gray-100 rounded-2xl flex items-center justify-center mb-8 border-inner shadow-inner border-4 border-gray-200 relative overflow-hidden">
                {/* Slot Machine Window Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10 pointer-events-none z-10"></div>
                
                {currentItem ? (
                    <div className={`flex flex-col items-center justify-center transition-all ${spinning ? 'blur-sm scale-90' : 'blur-0 scale-110'}`}>
                        <div className="text-9xl mb-4 filter drop-shadow-xl">{currentItem.icon}</div>
                        {!spinning && (
                            <div className="animate-bounce-in bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg z-20">
                                <h4 className="text-2xl font-black text-gray-800">
                                    {lang === 'ar' ? currentItem.nameAr : currentItem.nameEn}
                                </h4>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-6xl opacity-20 grayscale">🎰</div>
                )}
            </div>

            <button 
                onClick={spin}
                disabled={spinning}
                className="w-full bg-gradient-to-b from-orange-400 to-orange-600 text-white py-4 rounded-2xl font-black text-xl hover:from-orange-500 hover:to-orange-700 transition shadow-[0_6px_0_#c2410c] active:shadow-none active:translate-y-[6px] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                <RotateCcw className={spinning ? "animate-spin" : ""} />
                {t.spin}
            </button>
        </div>
    );
};

export default FoodRoulette;
