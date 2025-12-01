
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { summarizeLecture } from '../services/geminiService';
import { FileText, Sparkles, Loader2, Copy, Share2 } from 'lucide-react';

interface SummarizerProps {
    lang: Language;
}

const SmartSummarizer: React.FC<SummarizerProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [notes, setNotes] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [contentLang, setContentLang] = useState<'en' | 'ar'>('ar');

    const handleSummarize = async () => {
        if (!notes) return;
        setLoading(true);
        const res = await summarizeLecture(notes, contentLang);
        setSummary(res);
        setLoading(false);
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: 'Lecture Summary',
                text: summary,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(summary);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border-2 border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">{t.smartSummarizer}</h3>
                    <p className="text-sm text-gray-500">{t.summarizerDesc}</p>
                </div>
            </div>

            <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none h-40 mb-4 bg-gray-50 text-sm"
                placeholder={t.pasteNotes}
            />

            <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">{t.contentLang}</label>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setContentLang('en')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${contentLang === 'en' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200'}`}
                    >
                        English
                    </button>
                    <button 
                        onClick={() => setContentLang('ar')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${contentLang === 'ar' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200'}`}
                    >
                        العربية
                    </button>
                </div>
            </div>

            <button 
                onClick={handleSummarize}
                disabled={loading || !notes}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex justify-center items-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : <FileText size={20} />}
                {t.summarizeBtn}
            </button>

            {summary && (
                <div className="mt-8 bg-indigo-50 p-6 rounded-xl border border-indigo-200 animate-fade-in relative">
                    <div className="flex justify-between items-center mb-4 border-b border-indigo-200 pb-2">
                        <span className="font-bold text-indigo-800">{t.summaryResult}</span>
                        <div className="flex gap-2">
                             <button 
                                onClick={handleShare}
                                className="text-indigo-500 hover:text-indigo-800"
                            >
                                <Share2 size={18} />
                            </button>
                            <button 
                                onClick={() => navigator.clipboard.writeText(summary)}
                                className="text-indigo-500 hover:text-indigo-800"
                            >
                                <Copy size={18} />
                            </button>
                        </div>
                    </div>
                    <div className={`prose prose-sm max-w-none text-gray-800 whitespace-pre-line leading-relaxed ${contentLang === 'ar' ? 'font-arabic text-right' : 'text-left'}`}>
                        {summary}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartSummarizer;
