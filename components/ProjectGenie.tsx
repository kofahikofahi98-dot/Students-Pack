
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateProjectIdeas } from '../services/geminiService';
import { Lightbulb, Rocket, Loader2, Share2 } from 'lucide-react';

interface ProjectProps {
    lang: Language;
}

const ProjectGenie: React.FC<ProjectProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [major, setMajor] = useState('');
    const [interests, setInterests] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [contentLang, setContentLang] = useState<'en' | 'ar'>('ar');

    const handleGenerate = async () => {
        if (!major || !interests) return;
        setLoading(true);
        const res = await generateProjectIdeas(major, interests, contentLang);
        setResult(res);
        setLoading(false);
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: 'Graduation Project Ideas',
                text: result,
            }).catch(console.error);
        } else {
             navigator.clipboard.writeText(result);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border-4 border-student-blue relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50" />
            
            <div className="relative z-10 flex items-center gap-4 mb-8">
                <div className="bg-student-blue p-3 rounded-full text-white">
                    <Rocket size={32} />
                </div>
                <div>
                    <h3 className="text-3xl font-black text-gray-800">{t.projectGenie}</h3>
                    <p className="text-sm text-gray-500 font-bold">{lang === 'ar' ? 'أفكار مشاريع تخرج مميزة' : 'Unique Graduation Project Ideas'}</p>
                </div>
            </div>

            <div className="grid gap-4 mb-6 relative z-10">
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">{t.projectMajor}</label>
                    <input 
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-student-blue outline-none bg-gray-50"
                        placeholder={lang === 'ar' ? "مثلاً: هندسة مدنية" : "e.g. Civil Engineering"}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">{t.projectInterests}</label>
                    <textarea 
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-student-blue outline-none h-24 bg-gray-50"
                        placeholder={t.projectInterestsPlaceholder}
                    />
                </div>
            </div>

            <div className="mb-6 relative z-10">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">{t.contentLang}</label>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setContentLang('en')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${contentLang === 'en' ? 'bg-student-blue text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}
                    >
                        English
                    </button>
                    <button 
                        onClick={() => setContentLang('ar')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${contentLang === 'ar' ? 'bg-student-blue text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}
                    >
                        العربية
                    </button>
                </div>
            </div>

            <button 
                onClick={handleGenerate}
                disabled={loading || !major || !interests}
                className="w-full bg-student-blue text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-lg relative z-10"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Lightbulb size={20} className="text-yellow-300" />}
                {t.generateIdeas}
            </button>

            {result && (
                <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-200 animate-fade-in relative shadow-inner z-10">
                     <button 
                        onClick={handleShare}
                        className="absolute top-2 right-2 p-2 text-blue-400 hover:text-blue-800 transition"
                    >
                        <Share2 size={18} />
                    </button>
                    <div className="flex justify-center mb-4">
                        <span className="bg-student-blue text-white text-xs px-2 py-1 uppercase tracking-widest font-bold rounded">{t.ideasResult}</span>
                    </div>
                    <div className={`prose prose-sm max-w-none text-gray-800 whitespace-pre-line leading-relaxed ${contentLang === 'ar' ? 'font-arabic text-right' : 'text-left'}`}>
                        {result}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectGenie;
