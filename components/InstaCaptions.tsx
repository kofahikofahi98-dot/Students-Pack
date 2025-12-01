
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateInstaCaption } from '../services/geminiService';
import { Instagram, Camera, Loader2, Copy, Share2 } from 'lucide-react';

interface InstaProps {
    lang: Language;
}

const InstaCaptions: React.FC<InstaProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [desc, setDesc] = useState('');
    const [captions, setCaptions] = useState('');
    const [loading, setLoading] = useState(false);
    const [contentLang, setContentLang] = useState<'en' | 'ar'>('ar');

    const handleGenerate = async () => {
        if (!desc) return;
        setLoading(true);
        const res = await generateInstaCaption(desc, contentLang);
        setCaptions(res);
        setLoading(false);
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: 'Insta Captions',
                text: captions,
            }).catch(console.error);
        } else {
             navigator.clipboard.writeText(captions);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border-2 border-pink-500">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-3 rounded-xl text-white">
                    <Instagram size={32} />
                </div>
                <div>
                    <h3 className="text-3xl font-black text-gray-800">{t.instaCaptions}</h3>
                    <p className="text-sm text-gray-500 font-bold">✨ Aesthetic & Viral ✨</p>
                </div>
            </div>

            <label className="block text-sm font-bold text-gray-600 mb-1">{t.photoDesc}</label>
            <input 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-pink-500 outline-none mb-4 bg-gray-50"
                placeholder={t.photoDescPlaceholder}
            />

            <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">{t.contentLang}</label>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setContentLang('en')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${contentLang === 'en' ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-gray-600 border-gray-200'}`}
                    >
                        English
                    </button>
                    <button 
                        onClick={() => setContentLang('ar')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${contentLang === 'ar' ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-gray-600 border-gray-200'}`}
                    >
                        العربية
                    </button>
                </div>
            </div>

            <button 
                onClick={handleGenerate}
                disabled={loading || !desc}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:opacity-90 transition flex justify-center items-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Camera size={20} />}
                {t.generateCaptions}
            </button>

            {captions && (
                <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200 animate-fade-in relative">
                     <button 
                        onClick={handleShare}
                        className="absolute top-2 right-2 p-2 text-pink-400 hover:text-pink-600 transition"
                    >
                        <Share2 size={18} />
                    </button>
                    <div className={`prose prose-sm max-w-none text-gray-800 whitespace-pre-line leading-relaxed ${contentLang === 'ar' ? 'font-arabic text-right' : 'text-left'}`}>
                        {captions}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstaCaptions;
