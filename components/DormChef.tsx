
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateDormRecipe } from '../services/geminiService';
import { ChefHat, Sparkles, Loader2, Share2 } from 'lucide-react';

interface ChefProps {
    lang: Language;
}

const DormChef: React.FC<ChefProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [ingredients, setIngredients] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [contentLang, setContentLang] = useState<'en' | 'ar'>('ar');

    const handleCook = async () => {
        if (!ingredients) return;
        setLoading(true);
        const res = await generateDormRecipe(ingredients, contentLang);
        setResult(res);
        setLoading(false);
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: 'Dorm Chef Recipe',
                text: result,
            }).catch(console.error);
        } else {
             navigator.clipboard.writeText(result);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border-2 border-orange-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                    <ChefHat size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{t.dormChef}</h3>
            </div>

            <label className="block text-sm font-bold text-gray-600 mb-1">{t.ingredients}</label>
            <input 
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none mb-4 bg-gray-50"
                placeholder={t.ingredientsPlaceholder}
            />

            <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">{t.contentLang}</label>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setContentLang('en')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${contentLang === 'en' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200'}`}
                    >
                        English
                    </button>
                    <button 
                        onClick={() => setContentLang('ar')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${contentLang === 'ar' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200'}`}
                    >
                        العربية
                    </button>
                </div>
            </div>

            <button 
                onClick={handleCook}
                disabled={loading || !ingredients}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition flex justify-center items-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                {t.cookSomething}
            </button>

            {result && (
                <div className="mt-6 p-6 bg-orange-50 rounded-xl border border-orange-200 animate-fade-in relative group">
                    <button 
                        onClick={handleShare}
                        className="absolute top-2 right-2 bg-white/50 hover:bg-white p-2 rounded-full text-orange-600 transition"
                    >
                        <Share2 size={16} />
                    </button>
                    <span className="absolute -top-3 right-4 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold">{t.chefResult}</span>
                    <p className={`text-lg font-bold text-gray-800 leading-relaxed whitespace-pre-line ${contentLang === 'ar' ? 'font-arabic text-right' : 'text-left'}`}>
                        {result}
                    </p>
                </div>
            )}
        </div>
    );
};

export default DormChef;
