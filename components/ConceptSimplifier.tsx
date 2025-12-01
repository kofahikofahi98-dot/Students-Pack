
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { simplifyConcept } from '../services/geminiService';
import { Lightbulb, Brain, Loader2, Share2, Atom, Zap } from 'lucide-react';

interface SimplifierProps {
    lang: Language;
}

const ConceptSimplifier: React.FC<SimplifierProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [concept, setConcept] = useState('');
    const [level, setLevel] = useState(50);
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);
    const [contentLang, setContentLang] = useState<'en' | 'ar'>('ar');

    const suggestions = lang === 'ar' 
        ? ['نظرية الألعاب', 'ميكانيكا الكم', 'البلوكتشين', 'الوجودية', 'الثقوب السوداء']
        : ['Game Theory', 'Quantum Mechanics', 'Blockchain', 'Existentialism', 'Black Holes'];

    const handleExplain = async () => {
        if (!concept) return;
        setLoading(true);
        const res = await simplifyConcept(concept, level, contentLang);
        setExplanation(res);
        setLoading(false);
    };

     const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: 'Concept Simplified',
                text: explanation,
            }).catch(console.error);
        } else {
             navigator.clipboard.writeText(explanation);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-[#0F172A] p-1 rounded-3xl shadow-[0_0_50px_rgba(79,70,229,0.3)] overflow-hidden border border-indigo-900/50 relative">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full">
                <img 
                    src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop" 
                    alt="Quantum Background" 
                    className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                />
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0F172A]/90 to-[#0F172A] pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="bg-[#0F172A]/80 backdrop-blur-xl p-8 md:p-10 rounded-[22px] h-full relative z-10">
                <div className="flex items-center gap-6 mb-8 border-b border-indigo-500/20 pb-6">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg shadow-indigo-500/20 text-white relative group">
                        <Brain size={36} className="relative z-10" />
                        <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                            {t.conceptSimplifier} 
                            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30">v2.0</span>
                        </h3>
                        <p className="text-indigo-200/60 font-medium mt-1">{lang === 'ar' ? 'فك شيفرة العلوم المعقدة' : 'Decode complex knowledge instantly'}</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Controls Side */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <label className="text-xs font-bold text-indigo-300 mb-2 block uppercase tracking-wider">{t.simplifyConcept}</label>
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl opacity-30 group-focus-within:opacity-100 transition duration-300 blur"></div>
                                <textarea 
                                    value={concept}
                                    onChange={(e) => setConcept(e.target.value)}
                                    className="relative w-full p-4 bg-[#1E293B] border border-indigo-500/30 rounded-xl focus:outline-none text-white placeholder-slate-500 h-32 resize-none"
                                    placeholder={lang === 'ar' ? "مثلاً: نظرية الأوتار الفائقة..." : "e.g. Superstring Theory..."}
                                />
                            </div>
                        </div>

                        {/* Suggestions */}
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map(s => (
                                <button 
                                    key={s}
                                    onClick={() => setConcept(s)}
                                    className="bg-indigo-950/50 hover:bg-indigo-900 border border-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 group"
                                >
                                    <Atom size={10} className="group-hover:text-cyan-400 transition" /> {s}
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="text-xs font-bold text-indigo-300 mb-3 block uppercase tracking-wider">{t.complexityLevel}</label>
                            <div className="bg-[#1E293B] p-4 rounded-xl border border-indigo-500/20">
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">
                                    <span className={level < 33 ? "text-cyan-400" : ""}>{t.levelChild}</span>
                                    <span className={level >= 33 && level <= 66 ? "text-indigo-400" : ""}>{t.levelStudent}</span>
                                    <span className={level > 66 ? "text-purple-400" : ""}>{t.levelExpert}</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={level}
                                    onChange={(e) => setLevel(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-cyan-400"
                                />
                            </div>
                        </div>

                        {/* Language & Action */}
                        <div className="flex gap-3">
                             <div className="flex bg-[#1E293B] rounded-lg p-1 border border-indigo-500/20">
                                <button 
                                    onClick={() => setContentLang('en')}
                                    className={`px-3 py-2 rounded-md text-xs font-bold transition ${contentLang === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                                >
                                    EN
                                </button>
                                <button 
                                    onClick={() => setContentLang('ar')}
                                    className={`px-3 py-2 rounded-md text-xs font-bold transition ${contentLang === 'ar' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                                >
                                    AR
                                </button>
                            </div>
                            <button 
                                onClick={handleExplain}
                                disabled={loading || !concept}
                                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-[#0F172A] py-2 rounded-xl font-black transition flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:shadow-none"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} fill="currentColor" />}
                                {t.explainBtn}
                            </button>
                        </div>
                    </div>

                    {/* Output Side */}
                    <div className="lg:col-span-3">
                        <div className="h-full min-h-[400px] bg-[#1E293B]/50 rounded-2xl border border-indigo-500/10 relative overflow-hidden flex flex-col">
                            {/* Decorative Grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                            
                            {explanation ? (
                                <div className="p-6 md:p-8 relative z-10 animate-fade-in flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Analysis Complete</span>
                                        </div>
                                        <button onClick={handleShare} className="text-slate-400 hover:text-white transition">
                                            <Share2 size={18} />
                                        </button>
                                    </div>
                                    <div className={`prose prose-invert prose-p:text-slate-300 prose-headings:text-white max-w-none leading-loose ${contentLang === 'ar' ? 'font-arabic text-right' : 'text-left'}`}>
                                        {explanation}
                                    </div>
                                    <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
                                        <span>TOKENS: {explanation.length}</span>
                                        <span>MODEL: GEMINI-2.5</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                                    <Lightbulb size={48} className="mb-4 opacity-20" />
                                    <p className="text-sm font-bold uppercase tracking-widest opacity-50">Waiting for Input...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConceptSimplifier;
