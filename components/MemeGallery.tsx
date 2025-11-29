
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, STICKERS } from '../constants';
import { generateMemeCaption, generateMemeImage } from '../services/geminiService';
import { Download, Sparkles, ImagePlus } from 'lucide-react';

interface MemeProps {
    lang: Language;
}

const MemeGallery: React.FC<MemeProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [caption, setCaption] = useState({ top: "WHEN THE PROF SAYS", bottom: "ATTENDANCE IS OPTIONAL" });
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Image state: Can be a URL (picsum) or Base64 (Gemini)
    const [bgImage, setBgImage] = useState<string>(`https://picsum.photos/seed/123/500/500?grayscale`);

    const handleGenerate = async () => {
        setLoading(true);
        
        // Parallel execution for speed if topic is present
        // If topic is present, we generate BOTH image and text from AI.
        // If topic is empty, we just refresh picsum and get random text.

        if (topic.trim()) {
            // AI Mode
            const [captionResult, imageResult] = await Promise.all([
                generateMemeCaption(topic),
                generateMemeImage(topic)
            ]);

            if (captionResult) {
                setCaption({
                    top: lang === 'ar' ? captionResult.topAr : captionResult.topEn,
                    bottom: lang === 'ar' ? captionResult.bottomAr : captionResult.bottomEn
                });
            }
            if (imageResult) {
                setBgImage(imageResult);
            }
        } else {
            // Random/Fast Mode
            const randomSeed = Math.floor(Math.random() * 1000);
            setBgImage(`https://picsum.photos/seed/${randomSeed}/500/500?grayscale`);
            
            const result = await generateMemeCaption();
            if(result) {
                setCaption({
                    top: lang === 'ar' ? result.topAr : result.topEn,
                    bottom: lang === 'ar' ? result.bottomAr : result.bottomEn
                });
            }
        }

        setLoading(false);
    }

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Meme Generator */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="text-yellow-500" />
                    {lang === 'ar' ? "صانع الميمز" : "Meme Generator"}
                </h3>
                
                {/* Topic Input */}
                <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                        {t.memeTopicLabel}
                    </label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder={t.memeTopicPlaceholder}
                            className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-student-blue outline-none text-sm"
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        {lang === 'ar' 
                            ? "اتركه فارغاً لميم عشوائي، أو اكتب موضوع لتوليد ميم خاص بالذكاء الاصطناعي!" 
                            : "Leave empty for random, or type a topic to generate a custom AI meme!"}
                    </p>
                </div>

                <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4 group cursor-pointer border-4 border-black shadow-sm">
                    <img 
                        src={bgImage} 
                        alt="Meme Template" 
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Top Text */}
                    <div 
                        className="absolute top-6 left-0 w-full px-4 text-center pointer-events-none z-10"
                        dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    >
                        <h2 
                            className="text-2xl md:text-3xl font-black text-white stroke-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] break-words leading-tight" 
                            style={{
                                WebkitTextStroke: '2px black',
                                textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                                fontFamily: lang === 'ar' ? 'Cairo, sans-serif' : 'Impact, sans-serif'
                            }}
                        >
                            {caption.top}
                        </h2>
                    </div>

                    {/* Bottom Text */}
                    <div 
                        className="absolute bottom-6 left-0 w-full px-4 text-center pointer-events-none z-10"
                        dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    >
                        <h2 
                            className="text-2xl md:text-3xl font-black text-white stroke-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] break-words leading-tight" 
                            style={{
                                WebkitTextStroke: '2px black',
                                textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                                fontFamily: lang === 'ar' ? 'Cairo, sans-serif' : 'Impact, sans-serif'
                            }}
                        >
                            {caption.bottom}
                        </h2>
                    </div>
                </div>

                <button 
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full bg-jordan-red text-white py-3 rounded-xl font-bold hover:bg-red-700 transition flex justify-center items-center gap-2 shadow-md"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
                            {t.generating}
                        </>
                    ) : (
                        <>
                            <ImagePlus size={20} />
                            {lang === 'ar' ? "اصنع ميم جديد" : "Generate Meme"}
                        </>
                    )}
                </button>
            </div>

            {/* Stickers Pack */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Download className="text-blue-500" />
                    {t.stickers}
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                    {STICKERS.map(sticker => (
                        <div key={sticker.id} className="aspect-square bg-gray-50 rounded-xl flex flex-col items-center justify-center p-2 hover:bg-blue-50 transition cursor-pointer border-2 border-transparent hover:border-blue-200">
                            <span className="text-5xl mb-2">{sticker.url}</span>
                            <span className="text-xs text-center font-medium text-gray-500">
                                {lang === 'ar' ? sticker.labelAr : sticker.labelEn}
                            </span>
                        </div>
                    ))}
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-sm text-yellow-800">
                    <p>
                        {lang === 'ar' 
                        ? "هذه الحزمة متاحة للتحميل. استخدمها في ستوريات إنستغرام أو واتساب!" 
                        : "This pack is available for download. Use them in your Instagram Stories or WhatsApp!"}
                    </p>
                </div>
                
                <button className="mt-4 w-full border-2 border-student-blue text-student-blue py-2 rounded-xl font-bold hover:bg-blue-50 transition">
                    {t.download} (ZIP)
                </button>
            </div>
        </div>
    );
};

export default MemeGallery;
