
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { roastSchedule } from '../services/geminiService';
import { Calendar, Flame, Loader2, Share2 } from 'lucide-react';

interface RoasterProps {
    lang: Language;
}

const ScheduleRoaster: React.FC<RoasterProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [schedule, setSchedule] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [contentLang, setContentLang] = useState<'en' | 'ar'>('ar');

    const handleRoast = async () => {
        if (!schedule) return;
        setLoading(true);
        const res = await roastSchedule(schedule, contentLang);
        setResult(res);
        setLoading(false);
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: 'My Schedule Roast',
                text: result,
            }).catch(console.error);
        } else {
             navigator.clipboard.writeText(result);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border-2 border-red-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-100 p-2 rounded-full text-red-600">
                    <Calendar size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{t.scheduleRoaster}</h3>
            </div>

            <textarea 
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-red-500 outline-none h-32 mb-4 bg-gray-50"
                placeholder={t.pasteSchedule}
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
                onClick={handleRoast}
                disabled={loading || !schedule}
                className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition flex justify-center items-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Flame size={20} />}
                {t.roastMySchedule}
            </button>

            {result && (
                <div className="mt-6 p-6 bg-red-50 rounded-xl border border-red-200 animate-fade-in relative group">
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                            onClick={handleShare}
                            className="bg-white p-2 rounded-full text-gray-500 hover:text-red-500 shadow-sm"
                        >
                            <Share2 size={16} />
                        </button>
                    </div>
                    <span className="absolute -top-3 right-4 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">{t.roastResult}</span>
                    <p className={`text-lg font-bold text-gray-800 leading-relaxed ${contentLang === 'ar' ? 'font-arabic text-right' : 'text-left'}`}>
                        "{result}"
                    </p>
                </div>
            )}
        </div>
    );
};

export default ScheduleRoaster;
