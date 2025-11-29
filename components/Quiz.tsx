import React, { useState, useEffect } from 'react';
import { QuizQuestion, University, Language } from '../types';
import { UNIVERSITIES, TRANSLATIONS } from '../constants';
import { generateQuizQuestions } from '../services/geminiService';
import { RefreshCw, CheckCircle, School } from 'lucide-react';

interface QuizProps {
  lang: Language;
}

const Quiz: React.FC<QuizProps> = ({ lang }) => {
  const [university, setUniversity] = useState<University | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = TRANSLATIONS[lang];

  // Default hardcoded questions if API fails or for initial load
  const defaultQuestions: QuizQuestion[] = [
    {
      id: 1,
      questionEn: "It's 7:55 AM, and your lecture is at 8:00 AM. You are still in bed. What do you do?",
      questionAr: "الساعة ٧:٥٥ الصبح، ومحاضرتك عالثمانية، وأنت لسا بالتخت. شو بتعمل؟",
      options: [
        { id: 'a', textEn: "Sprint like a gazelle. I can make it.", textAr: "بركض زي الغزال. بلحق.", score: 1 },
        { id: 'b', textEn: "Go back to sleep. It's written.", textAr: "بكمل نومة. مكتوب ومقدر.", score: 3 },
        { id: 'c', textEn: "Send a text: 'Dr, I have a flat tire'.", textAr: "ببعث مسج: 'دكتور، البنشر ضرب'.", score: 2 }
      ]
    },
    {
      id: 2,
      questionEn: "Where do you spend most of your time on campus?",
      questionAr: "وين بتقضي معظم وقتك بالجامعة؟",
      options: [
        { id: 'a', textEn: "Library front row.", textAr: "المكتبة الصف الأول.", score: 1 },
        { id: 'b', textEn: "Cafeteria / Coffee shop.", textAr: "الكافتيريا / عند القهوة.", score: 3 },
        { id: 'c', textEn: "Wandering aimlessly looking for friends.", textAr: "بلفلف بدور على شلة.", score: 2 }
      ]
    }
  ];

  useEffect(() => {
    setQuestions(defaultQuestions);
  }, []);

  const handleGenerateNew = async () => {
    setLoading(true);
    const newQs = await generateQuizQuestions();
    if (newQs && newQs.length > 0) {
      setQuestions(newQs);
      setCurrentQuestionIndex(0);
      setScores([]);
      setShowResult(false);
    }
    setLoading(false);
  };

  const handleOptionClick = (score: number) => {
    const newScores = [...scores, score];
    setScores(newScores);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const getResult = () => {
    const total = scores.reduce((a, b) => a + b, 0);
    const avg = total / scores.length;
    
    if (avg <= 1.5) return { 
        en: "The Nerd (Dawweer)", ar: "القطاعة (الدفّير)", 
        descEn: "You know the syllabus better than the professor.", 
        descAr: "بتعرف الخطط الدراسية أكثر من الدكتور." 
    };
    if (avg <= 2.5) return { 
        en: "The Social Mayor (Mukhtar)", ar: "مختار الجامعة", 
        descEn: "You know everyone, from the guard to the dean.", 
        descAr: "بتعرف الكل، من الأمن للعميد." 
    };
    return { 
        en: "The Legend (Taysh)", ar: "الأسطورة (الطايش)", 
        descEn: "You are here for the vibes and the cafeteria.", 
        descAr: "أنت جاي عشان الأجواء والكافتيريا." 
    };
  };

  if (!university) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-xl max-w-2xl mx-auto">
        <School className="w-16 h-16 text-student-blue mb-4" />
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{t.selectUni}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {UNIVERSITIES.map(uni => (
                <button
                    key={uni.id}
                    onClick={() => setUniversity(uni)}
                    className="p-4 border-2 border-gray-100 hover:border-student-blue rounded-xl transition-all text-left rtl:text-right hover:bg-blue-50"
                >
                    <span className="font-semibold text-gray-700">{lang === 'ar' ? uni.nameAr : uni.nameEn}</span>
                </button>
            ))}
        </div>
      </div>
    );
  }

  if (loading) return <div className="text-center p-12 text-xl font-bold animate-pulse">{t.loading}</div>;

  if (showResult) {
    const result = getResult();
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl animate-fade-in border-4 border-highlight-yellow">
        <div className="text-6xl mb-4">👑</div>
        <h2 className="text-3xl font-bold text-jordan-red mb-2">{t.results}</h2>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{lang === 'ar' ? result.ar : result.en}</h3>
        <p className="text-lg text-gray-600 mb-8">{lang === 'ar' ? result.descAr : result.descEn}</p>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-500">{t.university}: {lang === 'ar' ? university.nameAr : university.nameEn}</p>
        </div>

        <button 
            onClick={() => {
                setScores([]);
                setCurrentQuestionIndex(0);
                setShowResult(false);
                setUniversity(null);
            }}
            className="bg-student-blue text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition"
        >
            {t.back}
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2">
            <div 
                className="bg-jordan-red h-2 transition-all duration-300" 
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
        </div>

        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-gray-400">Question {currentQuestionIndex + 1}/{questions.length}</span>
                <button onClick={handleGenerateNew} className="text-student-blue flex items-center gap-2 hover:underline text-sm">
                    <RefreshCw size={16} /> {t.generateNew}
                </button>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
                {lang === 'ar' ? currentQ.questionAr : currentQ.questionEn}
            </h3>

            <div className="space-y-4">
                {currentQ.options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => handleOptionClick(opt.score)}
                        className="w-full p-4 text-left rtl:text-right border-2 border-gray-100 rounded-xl hover:border-student-blue hover:bg-blue-50 transition-all flex items-center justify-between group"
                    >
                        <span className="font-medium text-lg text-gray-700">{lang === 'ar' ? opt.textAr : opt.textEn}</span>
                        <CheckCircle className="text-student-blue opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Quiz;