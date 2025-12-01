
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Crown, Lock, CheckCircle, X } from 'lucide-react';

interface PremiumModalProps {
    lang: Language;
    onClose: () => void;
    onUnlock: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ lang, onClose, onUnlock }) => {
    const t = TRANSLATIONS[lang];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative animate-fade-in-up">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-gray-400 hover:text-gray-600 z-10"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 text-center text-white relative">
                    <Crown size={64} className="mx-auto mb-4 drop-shadow-md animate-bounce" />
                    <h2 className="text-3xl font-black mb-2">{t.proPack}</h2>
                    <p className="opacity-90 font-medium">{t.proDescription}</p>
                    
                    {/* Background decorations */}
                    <div className="absolute top-0 left-0 w-20 h-20 bg-white/20 rounded-full -translate-x-10 -translate-y-10" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 translate-y-10" />
                </div>

                {/* Body */}
                <div className="p-8">
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-gray-700">
                            <div className="bg-green-100 p-1 rounded-full text-green-600"><CheckCircle size={16} /></div>
                            <span className="font-bold">{t.aiStudio} (AI Sketch)</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <div className="bg-green-100 p-1 rounded-full text-green-600"><CheckCircle size={16} /></div>
                            <span className="font-bold">{t.smartSummarizer}</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <div className="bg-green-100 p-1 rounded-full text-green-600"><CheckCircle size={16} /></div>
                            <span className="font-bold">{t.examSimulator}</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <div className="bg-green-100 p-1 rounded-full text-green-600"><CheckCircle size={16} /></div>
                            <span className="font-bold">{t.projectGenie}</span>
                        </li>
                         <li className="flex items-center gap-3 text-gray-700">
                            <div className="bg-green-100 p-1 rounded-full text-green-600"><CheckCircle size={16} /></div>
                            <span className="font-bold">{t.crushCalc} & {t.outfitRater}</span>
                        </li>
                    </ul>

                    <button 
                        onClick={onUnlock}
                        className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-xl flex items-center justify-center gap-2 group"
                    >
                        <span>{t.buyNow}</span>
                        <Lock size={18} className="text-yellow-400 group-hover:text-white transition-colors" />
                    </button>
                    
                    <p className="text-center text-xs text-gray-400 mt-4">
                        {lang === 'ar' ? "دفعة واحدة لمدى الحياة. ما في اشتراكات." : "One-time payment. No subscriptions."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PremiumModal;
