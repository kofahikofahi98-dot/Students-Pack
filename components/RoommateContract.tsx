
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateRoommateContract } from '../services/geminiService';
import { FileSignature, ScrollText, Loader2, Copy, Share2 } from 'lucide-react';

interface ContractProps {
    lang: Language;
}

const RoommateContract: React.FC<ContractProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [habits, setHabits] = useState('');
    const [contract, setContract] = useState('');
    const [loading, setLoading] = useState(false);
    const [contentLang, setContentLang] = useState<'en' | 'ar'>('ar');

    const handleGenerate = async () => {
        if (!habits) return;
        setLoading(true);
        const res = await generateRoommateContract(habits, contentLang);
        setContract(res);
        setLoading(false);
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: 'Roommate Contract',
                text: contract,
            }).catch(console.error);
        } else {
             navigator.clipboard.writeText(contract);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border-4 border-gray-800">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-gray-800 p-3 rounded-full text-white">
                    <FileSignature size={32} />
                </div>
                <div>
                    <h3 className="text-3xl font-black text-gray-800">{t.roommateContract}</h3>
                    <p className="text-sm text-gray-500">{t.contractDesc}</p>
                </div>
            </div>

            <label className="block text-sm font-bold text-gray-600 mb-1">{t.badHabits}</label>
            <textarea 
                value={habits}
                onChange={(e) => setHabits(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-gray-800 outline-none h-32 mb-4 bg-gray-50"
                placeholder={t.badHabitsPlaceholder}
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
                onClick={handleGenerate}
                disabled={loading || !habits}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition flex justify-center items-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : <ScrollText size={20} />}
                {t.generateContract}
            </button>

            {contract && (
                <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200 animate-fade-in relative shadow-inner">
                     <button 
                        onClick={handleShare}
                        className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-800 transition"
                    >
                        <Share2 size={18} />
                    </button>
                    <div className="flex justify-center mb-4">
                        <span className="bg-red-800 text-white text-xs px-2 py-1 uppercase tracking-widest font-bold">Official Document</span>
                    </div>
                    <div className={`prose prose-sm max-w-none text-gray-800 whitespace-pre-line leading-relaxed ${contentLang === 'ar' ? 'font-arabic text-right' : 'font-serif'}`}>
                        {contract}
                    </div>
                    <div className="mt-6 border-t border-gray-300 pt-4 flex justify-between text-gray-400 text-sm font-serif italic">
                        <span>Signed: ________________</span>
                        <span>Date: ________________</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoommateContract;
