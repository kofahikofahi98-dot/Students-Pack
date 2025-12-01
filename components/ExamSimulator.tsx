
import React, { useState } from 'react';
import { Language, ExamQuestion } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateMockExam } from '../services/geminiService';
import { PenTool, CheckCircle, Loader2, BookOpen } from 'lucide-react';

interface ExamProps {
    lang: Language;
}

const ExamSimulator: React.FC<ExamProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [questions, setQuestions] = useState<ExamQuestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [revealed, setRevealed] = useState<number[]>([]);
    const [contentLang, setContentLang] = useState<'en' | 'ar'>('ar');

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        setQuestions([]);
        setRevealed([]);
        const res = await generateMockExam(topic, difficulty, contentLang);
        setQuestions(res);
        setLoading(false);
    };

    const toggleAnswer = (idx: number) => {
        if (revealed.includes(idx)) {
            setRevealed(revealed.filter(i => i !== idx));
        } else {
            setRevealed([...revealed, idx]);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border-2 border-emerald-100">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                    <PenTool size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">{t.examSimulator}</h3>
                    <p className="text-sm text-gray-500">{t.examDesc}</p>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">{t.difficulty}</label>
                <div className="flex gap-2">
                     <button
                        onClick={() => setDifficulty('easy')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition ${difficulty === 'easy' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 text-gray-500'}`}
                     >
                        {t.diffEasy}
                     </button>
                     <button
                        onClick={() => setDifficulty('medium')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition ${difficulty === 'medium' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-gray-100 text-gray-500'}`}
                     >
                        {t.diffMedium}
                     </button>
                     <button
                        onClick={() => setDifficulty('hard')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition ${difficulty === 'hard' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-100 text-gray-500'}`}
                     >
                        {t.diffHard}
                     </button>
                </div>
            </div>

             <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">{t.contentLang}</label>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setContentLang('en')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${contentLang === 'en' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200'}`}
                    >
                        English
                    </button>
                    <button 
                        onClick={() => setContentLang('ar')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${contentLang === 'ar' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200'}`}
                    >
                        العربية
                    </button>
                </div>
            </div>

            <div className="flex gap-2 mb-6">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 mb-1">{t.examTopic}</label>
                    <input 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
                        placeholder={t.examTopicPlaceholder}
                    />
                </div>
                <button 
                    onClick={handleGenerate}
                    disabled={loading || !topic}
                    className="self-end bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <BookOpen size={20} />}
                </button>
            </div>

            <div className="space-y-6">
                {questions.map((q, idx) => (
                    <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-fade-in">
                        <div className="flex gap-3">
                            <span className="font-bold text-emerald-600 text-lg">Q{idx + 1}</span>
                            <div className="w-full">
                                <h4 className={`font-bold text-gray-800 text-lg mb-4 ${contentLang === 'ar' ? 'text-right font-arabic' : 'text-left'}`}>{q.question}</h4>
                                <div className="space-y-2 mb-4">
                                    {q.options?.map((opt, i) => (
                                        <div key={i} className={`p-2 bg-white rounded-lg border border-gray-100 text-gray-700 text-sm ${contentLang === 'ar' ? 'text-right font-arabic' : 'text-left'}`}>
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                                
                                <button 
                                    onClick={() => toggleAnswer(idx)}
                                    className="text-sm font-bold text-emerald-600 hover:underline flex items-center gap-1"
                                >
                                    {revealed.includes(idx) ? 'Hide Answer' : t.showAnswer}
                                </button>
                                
                                {revealed.includes(idx) && (
                                    <div className="mt-3 p-3 bg-emerald-100 text-emerald-900 rounded-lg flex items-start gap-2 animate-fade-in">
                                        <CheckCircle size={16} className="mt-0.5 shrink-0" />
                                        <span className={`font-bold ${contentLang === 'ar' ? 'text-right font-arabic' : 'text-left'}`}>{q.answer}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExamSimulator;
