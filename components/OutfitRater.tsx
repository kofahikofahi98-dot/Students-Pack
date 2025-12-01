
import React, { useState, useRef } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { rateOutfit } from '../services/geminiService';
import { Shirt, Camera, Loader2, Share2 } from 'lucide-react';

interface OutfitProps {
    lang: Language;
}

const OutfitRater: React.FC<OutfitProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [image, setImage] = useState<string | null>(null);
    const [rating, setRating] = useState('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [contentLang, setContentLang] = useState<'en' | 'ar'>('ar');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setRating('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRate = async () => {
        if (!image) return;
        setLoading(true);
        const base64 = image.split(',')[1];
        const res = await rateOutfit(base64, contentLang);
        setRating(res);
        setLoading(false);
    };

     const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: 'Outfit Rating',
                text: rating,
            }).catch(console.error);
        } else {
             navigator.clipboard.writeText(rating);
        }
    };


    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-teal-100 p-2 rounded-full text-teal-600">
                    <Shirt size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{t.outfitRater}</h3>
            </div>

            <div className="space-y-6 text-center">
                {!image ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-3 border-dashed border-gray-200 rounded-2xl p-10 hover:bg-gray-50 cursor-pointer transition"
                    >
                        <Camera size={40} className="mx-auto text-gray-400 mb-2" />
                        <p className="font-bold text-gray-600">{t.uploadOutfit}</p>
                    </div>
                ) : (
                    <div className="relative rounded-2xl overflow-hidden aspect-[3/4] max-h-96 mx-auto bg-black">
                        <img src={image} className="w-full h-full object-contain" alt="Outfit" />
                        <button 
                            onClick={() => setImage(null)}
                            className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-black hover:bg-white"
                        >
                            ✕
                        </button>
                    </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />

                {image && !rating && (
                    <div className="space-y-4">
                         <div className="flex gap-2 justify-center">
                            <button 
                                onClick={() => setContentLang('en')}
                                className={`px-4 py-2 rounded-full text-sm font-bold border transition ${contentLang === 'en' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                            >
                                English
                            </button>
                            <button 
                                onClick={() => setContentLang('ar')}
                                className={`px-4 py-2 rounded-full text-sm font-bold border transition ${contentLang === 'ar' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                            >
                                العربية
                            </button>
                        </div>
                        <button 
                            onClick={handleRate}
                            disabled={loading}
                            className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition flex justify-center items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : t.judgeMe}
                        </button>
                    </div>
                )}

                {rating && (
                    <div className="bg-teal-50 p-6 rounded-xl border border-teal-200 animate-fade-in relative">
                        <button 
                            onClick={handleShare}
                            className="absolute top-2 right-2 p-2 text-teal-500 hover:text-teal-800 transition"
                        >
                            <Share2 size={18} />
                        </button>
                        <p className={`text-xl font-bold text-gray-800 leading-relaxed ${contentLang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
                            {rating}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OutfitRater;
