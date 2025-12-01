
import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateDebateCounterpoint } from '../services/geminiService';
import { Swords, MessageSquare, Loader2, ShieldAlert, Bot, User, Flame } from 'lucide-react';

interface DebateProps {
    lang: Language;
}

const DebateArena: React.FC<DebateProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [topic, setTopic] = useState('');
    const [history, setHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
    const [loading, setLoading] = useState(false);
    const [contentLang, setContentLang] = useState<'en' | 'ar'>('ar');
    const scrollRef = useRef<HTMLDivElement>(null);

    const suggestions = lang === 'ar'
        ? ['الذكاء الاصطناعي سيستبدل الأطباء', 'التعليم الجامعي غير ضروري', 'العمل عن بعد سيء للمبتدئين', 'المال أهم من الشغف']
        : ['AI will replace doctors', 'University degrees are obsolete', 'Remote work hurts juniors', 'Money > Passion'];

    const handleChallenge = async () => {
        if (!topic) return;
        
        const newHistory = [...history, { role: 'user' as const, text: topic }];
        setHistory(newHistory);
        setTopic('');
        setLoading(true);

        const response = await generateDebateCounterpoint(topic, contentLang);
        
        setHistory([...newHistory, { role: 'ai' as const, text: response }]);
        setLoading(false);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history, loading]);

    return (
        <div className="max-w-4xl mx-auto bg-[#1a1a1a] rounded-3xl shadow-2xl overflow-hidden border border-red-900/30 relative flex flex-col md:flex-row h-[700px]">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img 
                    src="https://images.unsplash.com/photo-1555848962-6e79363ec58f?q=80&w=1000&auto=format&fit=crop" 
                    alt="Arena Background" 
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-[#1a1a1a]/90 mix-blend-multiply"></div>
            </div>

            {/* Sidebar / Header Area */}
            <div className="md:w-64 bg-[#111]/90 backdrop-blur p-6 flex flex-col border-b md:border-b-0 md:border-r border-red-900/20 relative z-20">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-red-600 p-2.5 rounded-lg text-white shadow-[0_0_15px_rgba(220,38,38,0.6)] animate-pulse">
                        <Swords size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white leading-none uppercase tracking-tighter italic">{t.debateArena}</h3>
                        <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">The Colosseum</span>
                    </div>
                </div>

                <div className="mb-8 hidden md:block">
                    <p className="text-xs text-gray-400 leading-relaxed border-l-2 border-red-800 pl-3">
                        {t.debateDesc}
                    </p>
                </div>

                <div className="mt-auto space-y-4">
                     <div className="bg-[#222] rounded-lg p-3 border border-gray-800">
                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2">{t.contentLang}</label>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setContentLang('en')}
                                className={`flex-1 py-1.5 rounded text-xs font-bold transition ${contentLang === 'en' ? 'bg-red-700 text-white' : 'bg-black text-gray-500 hover:text-white'}`}
                            >
                                EN
                            </button>
                            <button 
                                onClick={() => setContentLang('ar')}
                                className={`flex-1 py-1.5 rounded text-xs font-bold transition ${contentLang === 'ar' ? 'bg-red-700 text-white' : 'bg-black text-gray-500 hover:text-white'}`}
                            >
                                AR
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Arena */}
            <div className="flex-1 bg-gradient-to-b from-[#1a1a1a]/80 to-[#0f0f0f]/90 relative flex flex-col backdrop-blur-sm z-10">
                {/* Background Decoration */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <Swords size={300} />
                </div>

                {/* Chat Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar relative z-10">
                    {history.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-6">
                            <div className="w-20 h-20 bg-[#222] rounded-full flex items-center justify-center border border-gray-800">
                                <Flame size={32} className="text-red-800" />
                            </div>
                            <div className="text-center">
                                <h4 className="text-white font-bold text-lg mb-1">{t.startDebate}</h4>
                                <p className="text-sm opacity-50">{lang === 'ar' ? 'اختر موضوعاً أو اكتب رأيك لتتحدى الذكاء الاصطناعي' : 'Select a topic or type your thesis to challenge the AI'}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-lg">
                                {suggestions.map(s => (
                                    <button 
                                        key={s}
                                        onClick={() => setTopic(s)}
                                        className="bg-[#222] hover:bg-red-900/20 text-gray-400 hover:text-red-400 px-4 py-3 rounded-xl text-xs font-bold transition border border-gray-800 hover:border-red-900 text-left rtl:text-right"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {history.map((msg, idx) => (
                        <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in-up`}>
                            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-red-700 text-white'}`}>
                                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                            </div>
                            <div className={`
                                max-w-[85%] p-5 rounded-3xl text-sm md:text-base leading-relaxed shadow-xl border
                                ${msg.role === 'user' 
                                    ? 'bg-blue-900/40 text-blue-100 rounded-tr-none border-blue-500/30' 
                                    : 'bg-red-900/20 text-red-100 rounded-tl-none border-red-500/20'}
                                ${msg.role === 'ai' && contentLang === 'ar' ? 'font-arabic text-right' : ''}
                            `}>
                                {msg.role === 'ai' && <div className="text-[10px] text-red-500 font-bold mb-2 uppercase tracking-widest flex items-center gap-1"><ShieldAlert size={10} /> {t.aiCounter}</div>}
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                         <div className="flex gap-4 animate-pulse">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-red-700/50 flex items-center justify-center">
                                <Bot size={18} className="text-white/50" />
                            </div>
                             <div className="bg-[#222] text-gray-400 p-4 rounded-3xl rounded-tl-none border border-gray-800 flex items-center gap-3">
                                <Loader2 className="animate-spin text-red-600" size={16} />
                                <span className="text-xs font-mono uppercase">{lang === 'ar' ? 'جاري تحليل الحجج...' : 'Analyzing arguments...'}</span>
                             </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 bg-[#111] border-t border-gray-800 relative z-20">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-blue-600 rounded-full opacity-20 group-focus-within:opacity-100 transition duration-500 blur"></div>
                        <div className="relative flex items-center bg-[#000] rounded-full p-1 pr-2">
                             <input 
                                type="text" 
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleChallenge()}
                                className="w-full bg-transparent text-white px-6 py-3 rounded-full focus:outline-none placeholder-gray-600"
                                placeholder={t.debateTopic}
                            />
                            <button 
                                onClick={handleChallenge}
                                disabled={loading || !topic}
                                className="bg-white text-black hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition disabled:opacity-50 disabled:bg-gray-700 disabled:text-gray-500"
                            >
                                <MessageSquare size={18} fill="currentColor" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DebateArena;
