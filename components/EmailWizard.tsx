
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateProfEmail } from '../services/geminiService';
import { Mail, Copy, Loader2, Send, Zap, Share2 } from 'lucide-react';

interface EmailWizardProps {
    lang: Language;
}

const EmailWizard: React.FC<EmailWizardProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [recipient, setRecipient] = useState('');
    const [topic, setTopic] = useState('');
    const [desperation, setDesperation] = useState(0); // 0 to 100
    const [generatedEmail, setGeneratedEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [contentLang, setContentLang] = useState<'en' | 'ar'>('en');

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        const email = await generateProfEmail(topic, recipient || (lang === 'ar' ? 'الدكتور' : 'Professor'), desperation, contentLang);
        setGeneratedEmail(email);
        setLoading(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedEmail);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Student Email Draft',
                    text: generatedEmail,
                });
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            copyToClipboard();
        }
    };

    const applyTemplate = (tempTopic: string, tempDesperation: number) => {
        setTopic(tempTopic);
        setDesperation(tempDesperation);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                    <Mail size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{t.emailWizard}</h3>
            </div>

            <div className="mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-2">
                    <Zap size={12} /> {t.quickTemplates}
                </span>
                <div className="flex gap-2 flex-wrap">
                    <button 
                        onClick={() => applyTemplate(lang === 'ar' ? 'إجازة مرضية بسبب انفلونزا شديدة' : 'Sick leave due to severe flu', 20)}
                        className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-xs font-bold text-gray-700 transition"
                    >
                        {t.templateSick}
                    </button>
                    <button 
                        onClick={() => applyTemplate(lang === 'ar' ? 'مراجعة ورقة الامتحان الأول' : 'Review first exam paper', 50)}
                        className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-xs font-bold text-gray-700 transition"
                    >
                        {t.templateGrade}
                    </button>
                    <button 
                        onClick={() => applyTemplate(lang === 'ar' ? 'طلب تمديد موعد تسليم الواجب' : 'Request assignment deadline extension', 80)}
                        className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-xs font-bold text-gray-700 transition"
                    >
                        {t.templateExtension}
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">{t.emailRecipient}</label>
                    <input 
                        type="text" 
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-200 outline-none"
                        placeholder="Dr. Mazen"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">{t.emailTopic}</label>
                    <input 
                        type="text" 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-200 outline-none"
                        placeholder={lang === 'ar' ? "تمديد الواجب" : "Assignment Extension"}
                    />
                </div>
            </div>

            <div className="mb-8">
                <div className="flex justify-between text-sm font-bold text-gray-500 mb-2">
                    <span>{t.toneFormal}</span>
                    <span>{t.toneDesperate}</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={desperation}
                    onChange={(e) => setDesperation(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-jordan-red"
                />
                <p className="text-center text-xs text-gray-400 mt-1">{t.emailTone}: {desperation}%</p>
            </div>

            <div className="mb-6">
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
                disabled={loading || !topic}
                className="w-full bg-student-blue text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                {t.generateEmail}
            </button>

            {generatedEmail && (
                <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200 relative animate-fade-in">
                    <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 flex gap-2">
                         <button 
                            onClick={handleShare}
                            className="text-gray-400 hover:text-green-600 transition"
                            title={t.share}
                        >
                            <Share2 size={20} />
                        </button>
                        <button 
                            onClick={copyToClipboard}
                            className="text-gray-400 hover:text-student-blue transition"
                            title={t.copyText}
                        >
                            <Copy size={20} />
                        </button>
                    </div>
                    <pre className={`whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-sm md:text-base ${contentLang === 'ar' ? 'text-right font-arabic' : 'text-left'}`}>
                        {generatedEmail}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default EmailWizard;
