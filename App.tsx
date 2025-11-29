import React, { useState } from 'react';
import { Language } from './types';
import { TRANSLATIONS } from './constants';
import Quiz from './components/Quiz';
import Bingo from './components/Bingo';
import SurvivalGuide from './components/SurvivalGuide';
import MemeGallery from './components/MemeGallery';
import AIStudio from './components/AIStudio';
import GPACalculator from './components/GPACalculator';
import EmailWizard from './components/EmailWizard';
import FoodRoulette from './components/FoodRoulette';
import { Gamepad2, Brain, BookOpen, Smile, Download, Globe, Palette, Calculator, Mail, Utensils, LayoutGrid } from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quiz' | 'bingo' | 'guide' | 'memes' | 'studio' | 'gpa' | 'email' | 'food'>('dashboard');

  const t = TRANSLATIONS[lang];

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  const navItems = [
    { id: 'quiz', icon: Brain, label: t.startQuiz, color: 'bg-purple-100 text-purple-600' },
    { id: 'bingo', icon: Gamepad2, label: t.playBingo, color: 'bg-pink-100 text-pink-600' },
    { id: 'studio', icon: Palette, label: t.aiStudio, color: 'bg-blue-100 text-blue-600' },
    { id: 'memes', icon: Smile, label: t.memeGallery, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'guide', icon: BookOpen, label: t.survivalGuide, color: 'bg-green-100 text-green-600' },
    { id: 'gpa', icon: Calculator, label: t.gpaCalc, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'email', icon: Mail, label: t.emailWizard, color: 'bg-red-100 text-red-600' },
    { id: 'food', icon: Utensils, label: t.foodRoulette, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div 
        dir={lang === 'ar' ? 'rtl' : 'ltr'} 
        className={`min-h-screen bg-gray-50 ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}
    >
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <div 
                    className="flex items-center gap-2 cursor-pointer" 
                    onClick={() => setActiveTab('dashboard')}
                >
                    <div className="bg-jordan-red text-white p-2 rounded-lg font-bold text-xl">JO</div>
                    <div>
                        <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">{t.title}</h1>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {activeTab !== 'dashboard' && (
                        <button 
                            onClick={() => setActiveTab('dashboard')}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full md:hidden"
                        >
                            <LayoutGrid size={20} />
                        </button>
                    )}
                    <button 
                        onClick={toggleLang}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition font-bold text-xs md:text-sm text-gray-700"
                    >
                        <Globe size={14} />
                        {lang === 'en' ? 'AR' : 'EN'}
                    </button>
                </div>
            </div>
            
            {/* Scrollable Nav for Sub-pages */}
            {activeTab !== 'dashboard' && (
                <div className="max-w-6xl mx-auto px-2 overflow-x-auto pb-0 scrollbar-hide border-t border-gray-100">
                    <div className="flex space-x-2 rtl:space-x-reverse min-w-max py-2">
                        {navItems.map((item) => (
                            <button 
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={`
                                    px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold transition
                                    ${activeTab === item.id ? 'bg-gray-800 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}
                                `}
                            >
                                <item.icon size={14} /> {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-6 md:py-8 pb-32">
            
            {/* DASHBOARD VIEW */}
            {activeTab === 'dashboard' && (
                <div className="animate-fade-in-up">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-2">{t.title}</h2>
                        <p className="text-gray-500 text-lg">{t.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center justify-center gap-4 group"
                            >
                                <div className={`p-4 rounded-full ${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon size={32} />
                                </div>
                                <span className="font-bold text-gray-800 text-center">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-12 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-start">
                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                                {lang === 'ar' ? "شو بتستنى؟" : "What are you waiting for?"}
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {lang === 'ar' ? "حمل الحزمة الكاملة واستمتع بكل المزايا!" : "Get the full pack instantly!"}
                            </p>
                        </div>
                        <button className="bg-jordan-red text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition shadow-lg flex items-center gap-2">
                             <Download size={20} />
                             {t.download}
                        </button>
                    </div>
                </div>
            )}

            {/* SECTIONS */}
            <div className="animate-fade-in">
                {activeTab === 'quiz' && <Quiz lang={lang} />}
                {activeTab === 'bingo' && <Bingo lang={lang} />}
                {activeTab === 'studio' && <AIStudio lang={lang} />}
                {activeTab === 'memes' && <MemeGallery lang={lang} />}
                {activeTab === 'guide' && <SurvivalGuide lang={lang} />}
                {activeTab === 'gpa' && <GPACalculator lang={lang} />}
                {activeTab === 'email' && <EmailWizard lang={lang} />}
                {activeTab === 'food' && <FoodRoulette lang={lang} />}
            </div>
        </main>
    </div>
  );
};

export default App;