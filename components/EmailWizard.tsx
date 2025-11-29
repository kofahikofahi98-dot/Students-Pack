import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateProfEmail } from '../services/geminiService';
import { Mail, Copy, Loader2, Send } from 'lucide-react';

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

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        const email = await generateProfEmail(topic, recipient || (lang === 'ar' ? 'الدكتور' : 'Professor'), desperation);
        setGeneratedEmail(email);
        setLoading(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedEmail);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                    <Mail size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{t.emailWizard}</h3>
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
                    <button 
                        onClick={copyToClipboard}
                        className="absolute top-3 right-3 rtl:right-auto rtl:left-3 text-gray-400 hover:text-student-blue"
                    >
                        <Copy size={20} />
                    </button>
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-sm md:text-base">
                        {generatedEmail}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default EmailWizard;