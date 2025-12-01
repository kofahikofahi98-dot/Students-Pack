
import React, { useState, useRef } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { analyzeCoffeeCup } from '../services/geminiService';
import { Coffee, Upload, Loader2, Sparkles, Share2 } from 'lucide-react';

interface CoffeeReaderProps {
    lang: Language;
}

const CoffeeReader: React.FC<CoffeeReaderProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [image, setImage] = useState<string | null>(null);
    const [fortune, setFortune] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [contentLang, setContentLang] = useState<'en' | 'ar'>('ar');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setFortune('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReadFortune = async () => {
        if (!image) return;
        setLoading(true);
        // Extract base64 (remove prefix)
        const base64 = image.split(',')[1];
        const result = await analyzeCoffeeCup(base64, contentLang);
        setFortune(result);
        setLoading(false);
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: 'Coffee Fortune',
                text: fortune,
            }).catch(console.error);
        } else {
             navigator.clipboard.writeText(fortune);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-bl-full -z-0 opacity-50" />
            
            <div className="relative z-10 text-center mb-8">
                <div className="inline-block p-4 bg-yellow-100 rounded-full mb-4 text-yellow-800">
                    <Coffee size={40} />
                </div>
                <h3 className="text-3xl font-black text-gray-800 mb-2">{t.coffeeReader}</h3>
                <p className="text-gray-500">{lang === 'ar' ? "صور فنجانك وخلي الذكاء الاصطناعي يبصرلك" : "Snap your cup and let AI read your fortune"}</p>
            </div>

            <div className="space-y-6">
                {!image ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-3 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:bg-gray-50 hover:border-yellow-400 transition group"
                    >
                        <Upload size={48} className="mx-auto mb-4 text-gray-300 group-hover:text-yellow-500 transition-colors" />
                        <h4 className="font-bold text-gray-700 mb-1">{t.uploadCoffee}</h4>
                        <p className="text-sm text-gray-400">JPG, PNG</p>
                    </div>
                ) : (
                    <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-square md:aspect-video bg-black">
                        <img src={image} alt="Coffee Cup" className="w-full h-full object-contain" />
                        <button 
                            onClick={() => setImage(null)}
                            className="absolute top-2 right-2 bg-white/80 p-2 rounded-full hover:bg-white text-gray-800"
                        >
                            ✕
                        </button>
                    </div>
                )}
                
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                />

                {image && !fortune && (
                    <div className="space-y-4">
                         <div className="flex gap-2 justify-center">
                            <button 
                                onClick={() => setContentLang('en')}
                                className={`px-4 py-2 rounded-full text-sm font-bold border transition ${contentLang === 'en' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}
                            >
                                English
                            </button>
                            <button 
                                onClick={() => setContentLang('ar')}
                                className={`px-4 py-2 rounded-full text-sm font-bold border transition ${contentLang === 'ar' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}
                            >
                                العربية
                            </button>
                        </div>
                        <button 
                            onClick={handleReadFortune}
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} className="text-yellow-400" />}
                            {loading ? t.readingFortune : lang === 'ar' ? "بصرلي يا معلم" : "Read My Fortune"}
                        </button>
                    </div>
                )}

                {fortune && (
                    <div className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200 animate-fade-in text-center relative group">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            {t.yourFortune}
                        </div>
                         <button 
                            onClick={handleShare}
                            className="absolute top-2 right-2 p-2 text-yellow-600 hover:text-yellow-800 transition"
                        >
                            <Share2 size={18} />
                        </button>
                        <p className={`text-xl font-bold text-gray-800 leading-relaxed mt-2 ${contentLang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
                            "{fortune}"
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoffeeReader;
