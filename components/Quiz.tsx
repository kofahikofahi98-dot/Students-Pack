
import React, { useState, useEffect } from 'react';
import { QuizQuestion, University, Language } from '../types';
import { UNIVERSITIES, TRANSLATIONS } from '../constants';
import { generateQuizQuestions } from '../services/geminiService';
import { RefreshCw, CheckCircle, School, Share2, User, Star } from 'lucide-react';

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
        descAr: "بتعرف الخطط الدراسية أكثر من الدكتور.",
        icon: "🤓", color: "bg-purple-600"
    };
    if (avg <= 2.5) return { 
        en: "The Social Mayor (Mukhtar)", ar: "مختار الجامعة", 
        descEn: "You know everyone, from the guard to the dean.", 
        descAr: "بتعرف الكل، من الأمن للعميد.",
        icon: "😎", color: "bg-blue-600"
    };
    return { 
        en: "The Legend (Taysh)", ar: "الأسطورة (الطايش)", 
        descEn: "You are here for the vibes and the cafeteria.", 
        descAr: "أنت جاي عشان الأجواء والكافتيريا.",
        icon: "🤪", color: "bg-orange-500"
    };
  };

  if (!university) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-xl max-w-2xl mx-auto border-t-4 border-student-blue">
        <School className="w-20 h-20 text-student-blue mb-6 animate-bounce" />
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">{t.selectUni}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {UNIVERSITIES.map(uni => (
                <button
                    key={uni.id}
                    onClick={() => setUniversity(uni)}
                    className="p-5 border-2 border-gray-100 hover:border-student-blue rounded-2xl transition-all text-left rtl:text-right hover:bg-blue-50 flex items-center gap-3 group"
                >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-student-blue group-hover:bg-blue-600 group-hover:text-white transition-colors font-bold">
                        {uni.nameEn.substring(0,1)}
                    </div>
                    <span className="font-bold text-gray-700">{lang === 'ar' ? uni.nameAr : uni.nameEn}</span>
                </button>
            ))}
        </div>
      </div>
    );
  }

  if (loading) return <div className="text-center p-12 text-xl font-bold animate-pulse text-student-blue">{t.loading}</div>;

  if (showResult) {
    const result = getResult();
    return (
      <div className="flex flex-col items-center animate-fade-in">
        {/* ID CARD DESIGN */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full border border-gray-200 relative">
            {/* Holographic header effect */}
            <div className={`h-24 w-full ${result.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10 skew-y-6 transform origin-bottom-left"></div>
                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 text-white/90 font-bold text-xs tracking-widest uppercase">
                    Student ID
                </div>
                <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10 text-5xl">
                    {result.icon}
                </div>
            </div>

            <div className="pt-16 pb-8 px-8 text-center">
                <h2 className="text-3xl font-black text-gray-800 mb-1">{lang === 'ar' ? result.ar : result.en}</h2>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-6">{lang === 'ar' ? university.nameAr : university.nameEn}</p>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                    <p className="text-gray-600 leading-relaxed font-medium">
                        "{lang === 'ar' ? result.descAr : result.descEn}"
                    </p>
                </div>

                <div className="flex justify-center gap-2 mb-6">
                    {[1,2,3,4,5].map(s => <Star key={s} size={16} className="text-yellow-400 fill-current" />)}
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => {
                            setScores([]);
                            setCurrentQuestionIndex(0);
                            setShowResult(false);
                            setUniversity(null);
                        }}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                    >
                        {t.back}
                    </button>
                    <button className="flex-1 bg-student-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
                        <Share2 size={18} /> {t.share}
                    </button>
                </div>
            </div>
            
            {/* Barcode Decoration */}
            <div className="h-4 bg-gray-900 mx-8 mb-6 rounded-sm opacity-80" 
                style={{backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, #fff 2px, #fff 4px)'}}>
            </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-3">
            <div 
                className="bg-gradient-to-r from-jordan-red to-orange-500 h-3 transition-all duration-500 ease-out rounded-r-full" 
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
        </div>

        <div className="p-8 md:p-12">
            <div className="flex justify-between items-center mb-8">
                <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Question {currentQuestionIndex + 1} / {questions.length}
                </span>
                <button onClick={handleGenerateNew} className="text-student-blue flex items-center gap-2 hover:bg-blue-50 px-3 py-1 rounded-lg transition text-sm font-bold">
                    <RefreshCw size={16} /> {t.generateNew}
                </button>
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-gray-800 mb-10 leading-snug">
                {lang === 'ar' ? currentQ.questionAr : currentQ.questionEn}
            </h3>

            <div className="space-y-4">
                {currentQ.options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => handleOptionClick(opt.score)}
                        className="w-full p-5 text-left rtl:text-right border-2 border-gray-100 rounded-2xl hover:border-student-blue hover:bg-blue-50/50 hover:shadow-md transition-all flex items-center justify-between group"
                    >
                        <span className="font-bold text-lg text-gray-700 group-hover:text-student-blue transition-colors">
                            {lang === 'ar' ? opt.textAr : opt.textEn}
                        </span>
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-student-blue group-hover:bg-student-blue transition-all flex items-center justify-center">
                            <CheckCircle className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={14} />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Quiz;
