

import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateCVSummary } from '../services/geminiService';
import { FileText, Wand2, Loader2, Copy, Share2 } from 'lucide-react';

interface CVProps {
    lang: Language;
}

const CVBuilder: React.FC<CVProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [major, setMajor] = useState('');
    const [skills, setSkills] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [contentLang, setContentLang] = useState<'en' | 'ar'>('en');

    const handleGenerate = async () => {
        if (!major || !skills) return;
        setLoading(true);
        const res = await generateCVSummary(major, skills, contentLang);
        setResult(res);
        setLoading(false);
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: 'Professional CV',
                text: result,
            }).catch(console.error);
        } else {
             navigator.clipboard.writeText(result);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-slate-100 p-2 rounded-full text-slate-700">
                    <FileText size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{t.cvBuilder}</h3>
            </div>

            <div className="grid gap-4 mb-6">
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">{t.major}</label>
                    <input 
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        className="w-full p-3 border rounded-xl focus:border-slate-500 outline-none"
                        placeholder="e.g. Business Administration"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">{t.skills}</label>
                    <textarea 
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="w-full p-3 border rounded-xl focus:border-slate-500 outline-none h-24"
                        placeholder={t.skillsPlaceholder}
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">{t.contentLang}</label>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setContentLang('en')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${contentLang === 'en' ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        English
                    </button>
                    <button 
                        onClick={() => setContentLang('ar')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${contentLang === 'ar' ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        العربية
                    </button>
                </div>
            </div>

            <button 
                onClick={handleGenerate}
                disabled={loading || !major || !skills}
                className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition flex justify-center items-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={18} />}
                {t.generateCV}
            </button>

            {result && (
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">{t.cvResult}</span>
                        <div className="flex gap-2">
                             <button 
                                onClick={handleShare}
                                className="text-student-blue hover:text-blue-700"
                            >
                                <Share2 size={16} />
                            </button>
                            <button 
                                onClick={() => navigator.clipboard.writeText(result)} 
                                className="text-student-blue hover:text-blue-700"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>
                    <div className={`bg-gray-50 p-6 rounded-xl border border-gray-200 text-gray-800 leading-relaxed whitespace-pre-wrap relative ${contentLang === 'ar' ? 'font-arabic text-right' : 'font-sans text-left'}`}>
                        {result}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CVBuilder;
