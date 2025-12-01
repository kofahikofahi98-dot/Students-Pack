
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { optimizeLinkedIn } from '../services/geminiService';
import { Linkedin, Loader2, Copy, Briefcase } from 'lucide-react';

interface LinkedInProps {
    lang: Language;
}

const LinkedInOptimizer: React.FC<LinkedInProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [role, setRole] = useState('');
    const [ambition, setAmbition] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [contentLang, setContentLang] = useState<'en' | 'ar'>('en');

    const handleOptimize = async () => {
        if (!role || !ambition) return;
        setLoading(true);
        const res = await optimizeLinkedIn(role, ambition, contentLang);
        setResult(res);
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto bg-black p-1 rounded-3xl shadow-2xl border border-yellow-600/50">
            <div className="bg-gray-900 p-8 rounded-[22px] h-full relative overflow-hidden">
                {/* Gold Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex items-center gap-4 mb-8 relative z-10 justify-between flex-wrap">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-xl text-black shadow-lg shadow-yellow-500/20">
                            <Linkedin size={32} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white">{t.linkedInOptimizer}</h3>
                            <p className="text-sm text-yellow-500 font-bold uppercase tracking-wider">{lang === 'ar' ? 'الاحترافية المطلقة' : 'Absolute Professionalism'}</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                         <button 
                            onClick={() => setContentLang('en')}
                            className={`px-3 py-1 rounded-full text-xs font-bold border transition ${contentLang === 'en' ? 'bg-yellow-600 text-black border-yellow-600' : 'bg-gray-800 text-gray-400 border-gray-700'}`}
                        >
                            EN
                        </button>
                        <button 
                            onClick={() => setContentLang('ar')}
                            className={`px-3 py-1 rounded-full text-xs font-bold border transition ${contentLang === 'ar' ? 'bg-yellow-600 text-black border-yellow-600' : 'bg-gray-800 text-gray-400 border-gray-700'}`}
                        >
                            AR
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8 relative z-10">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">{t.currentRole}</label>
                        <input 
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                            placeholder={lang === 'ar' ? "مثلاً: طالب هندسة حاسوب سنة ثالثة" : "e.g., Junior CS Student"}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">{t.dreamJob}</label>
                        <input 
                            value={ambition}
                            onChange={(e) => setAmbition(e.target.value)}
                            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-yellow-500 outline-none transition"
                            placeholder={lang === 'ar' ? "مثلاً: مدير منتجات في جوجل" : "e.g., Product Manager at Google"}
                        />
                    </div>
                </div>

                <button 
                    onClick={handleOptimize}
                    disabled={loading || !role || !ambition}
                    className="relative z-10 w-full bg-gradient-to-r from-yellow-500 to-yellow-700 text-black py-4 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-600 transition flex justify-center items-center gap-2 text-lg shadow-lg shadow-yellow-900/50"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Briefcase size={20} />}
                    {t.optimizeProfile}
                </button>

                {result && (
                    <div className="mt-8 bg-gray-800 p-8 rounded-xl border border-gray-700 animate-fade-in relative z-10">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-4">
                            <span className="font-bold text-yellow-500 uppercase text-xs tracking-widest">{t.optimizedResult}</span>
                            <button 
                                onClick={() => navigator.clipboard.writeText(result)} 
                                className="text-gray-400 hover:text-white transition"
                            >
                                <Copy size={18} />
                            </button>
                        </div>
                        <div className={`prose prose-invert max-w-none text-gray-300 whitespace-pre-line leading-relaxed ${contentLang === 'ar' ? 'font-arabic text-right' : 'font-sans'}`}>
                            {result}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LinkedInOptimizer;
