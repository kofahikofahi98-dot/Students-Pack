
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { interpretDream } from '../services/geminiService';
import { CloudMoon, Sparkles, Loader2, Share2 } from 'lucide-react';

interface DreamProps {
    lang: Language;
}

const DreamInterpreter: React.FC<DreamProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [dream, setDream] = useState('');
    const [interpretation, setInterpretation] = useState('');
    const [loading, setLoading] = useState(false);
    const [contentLang, setContentLang] = useState<'en' | 'ar'>('ar');

    const handleInterpret = async () => {
        if (!dream) return;
        setLoading(true);
        const res = await interpretDream(dream, contentLang);
        setInterpretation(res);
        setLoading(false);
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: 'Dream Interpretation',
                text: interpretation,
            }).catch(console.error);
        } else {
             navigator.clipboard.writeText(interpretation);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-indigo-900 text-white p-8 rounded-2xl shadow-2xl border border-indigo-700 relative overflow-hidden">
            {/* Stars Background */}
            <div className="absolute top-4 left-10 text-yellow-300 opacity-50 animate-pulse text-xs">✦</div>
            <div className="absolute bottom-10 right-10 text-yellow-300 opacity-50 animate-pulse text-xl">✦</div>
            <div className="absolute top-1/2 left-1/4 text-white opacity-20 text-sm">★</div>

            <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="bg-indigo-800 p-3 rounded-full text-indigo-200">
                    <CloudMoon size={32} />
                </div>
                <div>
                    <h3 className="text-3xl font-black text-white">{t.dreamInterpreter}</h3>
                    <p className="text-sm text-indigo-300">{t.dreamDesc}</p>
                </div>
            </div>

            <textarea 
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                className="w-full p-4 border border-indigo-700 rounded-xl focus:border-indigo-400 outline-none h-32 mb-4 bg-indigo-800/50 text-white placeholder-indigo-400 relative z-10"
                placeholder={t.dreamPlaceholder}
            />

            <div className="mb-6 relative z-10">
                <label className="block text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wide">{t.contentLang}</label>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setContentLang('en')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${contentLang === 'en' ? 'bg-white text-indigo-900 border-white' : 'bg-transparent text-indigo-300 border-indigo-700 hover:bg-indigo-800'}`}
                    >
                        English
                    </button>
                    <button 
                        onClick={() => setContentLang('ar')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${contentLang === 'ar' ? 'bg-white text-indigo-900 border-white' : 'bg-transparent text-indigo-300 border-indigo-700 hover:bg-indigo-800'}`}
                    >
                        العربية
                    </button>
                </div>
            </div>

            <button 
                onClick={handleInterpret}
                disabled={loading || !dream}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-4 rounded-xl font-bold hover:opacity-90 transition flex justify-center items-center gap-2 shadow-lg shadow-indigo-900/50 relative z-10"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                {t.interpretDream}
            </button>

            {interpretation && (
                <div className="mt-8 bg-indigo-800/80 p-6 rounded-xl border border-indigo-600 animate-fade-in relative z-10 backdrop-blur-sm">
                     <button 
                        onClick={handleShare}
                        className="absolute top-2 right-2 p-2 text-indigo-300 hover:text-white transition"
                    >
                        <Share2 size={18} />
                    </button>
                    <div className={`prose prose-invert max-w-none text-indigo-100 whitespace-pre-line leading-relaxed ${contentLang === 'ar' ? 'font-arabic text-right' : 'text-left'}`}>
                        {interpretation}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DreamInterpreter;
