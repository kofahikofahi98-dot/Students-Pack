
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateCareerRoadmap } from '../services/geminiService';
import { Map, Zap, Loader2, Navigation, Share2 } from 'lucide-react';

interface RoadmapProps {
    lang: Language;
}

const CareerRoadmap: React.FC<RoadmapProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [major, setMajor] = useState('');
    const [roadmap, setRoadmap] = useState('');
    const [loading, setLoading] = useState(false);
    const [contentLang, setContentLang] = useState<'en' | 'ar'>('en');

    const handleGenerate = async () => {
        if (!major) return;
        setLoading(true);
        const res = await generateCareerRoadmap(major, contentLang);
        setRoadmap(res);
        setLoading(false);
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: 'Career Roadmap',
                text: roadmap,
            }).catch(console.error);
        } else {
             navigator.clipboard.writeText(roadmap);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-black p-1 rounded-3xl shadow-2xl border border-gray-800">
            <div className="bg-black p-8 rounded-[22px] h-full relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(30,30,30,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(30,30,30,0.5)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                <div className="flex items-center gap-4 mb-8 relative z-10 justify-between flex-wrap">
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-xl text-black shadow-lg shadow-white/10">
                            <Map size={32} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white">{t.careerRoadmap}</h3>
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">{lang === 'ar' ? 'استراتيجية المستقبل' : 'Future Strategy'}</p>
                        </div>
                    </div>
                     <div className="flex gap-2">
                         <button 
                            onClick={() => setContentLang('en')}
                            className={`px-3 py-1 rounded-full text-xs font-bold border transition ${contentLang === 'en' ? 'bg-white text-black border-white' : 'bg-gray-800 text-gray-400 border-gray-700'}`}
                        >
                            EN
                        </button>
                        <button 
                            onClick={() => setContentLang('ar')}
                            className={`px-3 py-1 rounded-full text-xs font-bold border transition ${contentLang === 'ar' ? 'bg-white text-black border-white' : 'bg-gray-800 text-gray-400 border-gray-700'}`}
                        >
                            AR
                        </button>
                    </div>
                </div>

                <div className="mb-8 relative z-10">
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">{t.roadmapMajor}</label>
                    <div className="flex gap-4">
                        <input 
                            value={major}
                            onChange={(e) => setMajor(e.target.value)}
                            className="flex-1 p-4 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-white outline-none transition"
                            placeholder={lang === 'ar' ? "مثلاً: محاسبة، طب أسنان، تصميم جرافيك..." : "e.g., Accounting, Dentistry, Graphic Design..."}
                        />
                        <button 
                            onClick={handleGenerate}
                            disabled={loading || !major}
                            className="bg-white text-black px-8 rounded-xl font-bold hover:bg-gray-200 transition flex items-center gap-2 shadow-lg shadow-white/10"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Navigation size={20} />}
                        </button>
                    </div>
                </div>

                {roadmap && (
                    <div className="mt-8 relative z-10 animate-fade-in group">
                         <div className="flex justify-between items-center mb-6">
                             <div className="flex items-center gap-2">
                                <Zap className="text-yellow-400 fill-yellow-400" size={20} />
                                <span className="font-bold text-white uppercase text-sm tracking-widest">{t.roadmapResult}</span>
                            </div>
                            <button onClick={handleShare} className="text-gray-400 hover:text-white transition">
                                <Share2 size={18} />
                            </button>
                        </div>
                        
                        <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-2xl">
                            <div className={`prose prose-invert prose-lg max-w-none text-gray-300 whitespace-pre-line leading-relaxed ${contentLang === 'ar' ? 'font-arabic text-right' : 'text-left'}`}>
                                {roadmap}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CareerRoadmap;
