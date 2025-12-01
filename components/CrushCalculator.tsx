
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { calculateCrush } from '../services/geminiService';
import { Heart, Loader2, Sparkles, Share2 } from 'lucide-react';

interface CrushProps {
    lang: Language;
}

const CrushCalculator: React.FC<CrushProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [name1, setName1] = useState('');
    const [name2, setName2] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [contentLang, setContentLang] = useState<'en' | 'ar'>('ar');

    const handleCalculate = async () => {
        if (!name1 || !name2) return;
        setLoading(true);
        const res = await calculateCrush(name1, name2, contentLang);
        setResult(res);
        setLoading(false);
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: 'Crush Calculator',
                text: `${name1} + ${name2} = ${result}`,
            }).catch(console.error);
        } else {
             navigator.clipboard.writeText(`${name1} + ${name2} = ${result}`);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl border-4 border-pink-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 to-red-500" />
            
            <Heart size={48} className="mx-auto text-pink-500 mb-4 animate-pulse" fill="currentColor" />
            <h3 className="text-3xl font-black text-gray-800 mb-6">{t.crushCalc}</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-xs font-bold text-pink-600 mb-1">{t.yourName}</label>
                    <input 
                        value={name1}
                        onChange={(e) => setName1(e.target.value)}
                        className="w-full p-3 bg-pink-50 border-2 border-pink-100 rounded-xl text-center focus:border-pink-400 outline-none"
                        placeholder="Ahmad"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-pink-600 mb-1">{t.crushName}</label>
                    <input 
                        value={name2}
                        onChange={(e) => setName2(e.target.value)}
                        className="w-full p-3 bg-pink-50 border-2 border-pink-100 rounded-xl text-center focus:border-pink-400 outline-none"
                        placeholder="Layla"
                    />
                </div>
            </div>

             <div className="flex gap-2 justify-center mb-6">
                <button 
                    onClick={() => setContentLang('en')}
                    className={`px-4 py-1 rounded-full text-xs font-bold border transition ${contentLang === 'en' ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-400'}`}
                >
                    English
                </button>
                <button 
                    onClick={() => setContentLang('ar')}
                    className={`px-4 py-1 rounded-full text-xs font-bold border transition ${contentLang === 'ar' ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-400'}`}
                >
                    العربية
                </button>
            </div>

            <button 
                onClick={handleCalculate}
                disabled={loading || !name1 || !name2}
                className="w-full bg-pink-500 text-white py-3 rounded-xl font-bold hover:bg-pink-600 transition shadow-lg flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                {t.calcLove}
            </button>

            {result && (
                <div className="mt-8 p-6 bg-pink-50 rounded-2xl border border-pink-200 animate-fade-in relative">
                     <button 
                        onClick={handleShare}
                        className="absolute top-2 right-2 p-2 text-pink-400 hover:text-pink-600 transition"
                    >
                        <Share2 size={18} />
                    </button>
                    <h4 className="font-bold text-pink-800 mb-2 uppercase text-xs tracking-widest">{t.loveScore}</h4>
                    <p className={`text-lg font-medium text-gray-800 leading-relaxed ${contentLang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
                        "{result}"
                    </p>
                </div>
            )}
        </div>
    );
};

export default CrushCalculator;
