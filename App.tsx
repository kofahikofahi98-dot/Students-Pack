
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
import ProjectGenie from './components/ProjectGenie';
import CrushCalculator from './components/CrushCalculator';
import OutfitRater from './components/OutfitRater';
import CVBuilder from './components/CVBuilder';
import ScheduleRoaster from './components/ScheduleRoaster';
import DormChef from './components/DormChef';
import SmartSummarizer from './components/SmartSummarizer';
import ExamSimulator from './components/ExamSimulator';
import ConceptSimplifier from './components/ConceptSimplifier';
import DebateArena from './components/DebateArena';
import PremiumModal from './components/PremiumModal';
import LinkedInOptimizer from './components/LinkedInOptimizer';
import CareerRoadmap from './components/CareerRoadmap';
import RoommateContract from './components/RoommateContract';
import InstaCaptions from './components/InstaCaptions';
import DreamInterpreter from './components/DreamInterpreter';
import UniHub from './components/UniHub';
import { Gamepad2, Brain, BookOpen, Smile, Download, Globe, Palette, Calculator, Mail, Utensils, LayoutGrid, Rocket, Heart, Shirt, FileText, Lock, Calendar, ChefHat, GraduationCap, PenTool, Lightbulb, Swords, Zap, Briefcase, Map, Crown, ChevronLeft, ChevronRight, Home, FileSignature, Instagram, CloudMoon, Building2, Backpack, PartyPopper, Laptop2, School } from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quiz' | 'bingo' | 'guide' | 'memes' | 'studio' | 'gpa' | 'email' | 'food' | 'project' | 'crush' | 'outfit' | 'cv' | 'roast' | 'chef' | 'summarizer' | 'exam' | 'simplifier' | 'debate' | 'linkedin' | 'roadmap' | 'contract' | 'insta' | 'dream' | 'unihub'>('dashboard');
  
  // Premium State
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const t = TRANSLATIONS[lang];

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  const handleUnlock = () => {
      // Simulation of payment
      setTimeout(() => {
        setIsPremium(true);
        setShowPremiumModal(false);
      }, 1000);
  };

  const handleTabChange = (id: string) => {
      // List of IDs that are locked based on the navItems configuration
      const lockedIds = ['studio', 'summarizer', 'exam', 'project', 'crush', 'outfit', 'cv', 'insta', 'dream'];
      
      if (lockedIds.includes(id) && !isPremium) {
          setShowPremiumModal(true);
          return;
      }
      setActiveTab(id as any);
  };

  const navItems = [
    // FREE TOOLS
    { id: 'quiz', icon: Brain, label: t.startQuiz, color: 'bg-purple-100 text-purple-600', locked: false },
    { id: 'bingo', icon: Gamepad2, label: t.playBingo, color: 'bg-pink-100 text-pink-600', locked: false },
    { id: 'memes', icon: Smile, label: t.memeGallery, color: 'bg-yellow-100 text-yellow-600', locked: false },
    { id: 'unihub', icon: Building2, label: t.uniHub, color: 'bg-teal-100 text-teal-600', locked: false }, 
    { id: 'gpa', icon: Calculator, label: t.gpaCalc, color: 'bg-indigo-100 text-indigo-600', locked: false },
    { id: 'email', icon: Mail, label: t.emailWizard, color: 'bg-red-100 text-red-600', locked: false },
    { id: 'food', icon: Utensils, label: t.foodRoulette, color: 'bg-orange-100 text-orange-600', locked: false },
    { id: 'roast', icon: Calendar, label: t.scheduleRoaster, color: 'bg-rose-100 text-rose-600', locked: false },
    { id: 'chef', icon: ChefHat, label: t.dormChef, color: 'bg-amber-100 text-amber-600', locked: false },
    { id: 'guide', icon: BookOpen, label: t.survivalGuide, color: 'bg-green-100 text-green-600', locked: false },
    { id: 'contract', icon: FileSignature, label: t.roommateContract, color: 'bg-gray-200 text-gray-700', locked: false }, 

    // PREMIUM TOOLS (LOCKED)
    { id: 'studio', icon: Palette, label: t.aiStudio, color: 'bg-blue-100 text-blue-600', locked: true }, 
    
    // Nerd Corner (Premium)
    { id: 'summarizer', icon: GraduationCap, label: t.smartSummarizer, color: 'bg-indigo-50 text-indigo-800 border-2 border-indigo-200', locked: true },
    { id: 'exam', icon: PenTool, label: t.examSimulator, color: 'bg-emerald-50 text-emerald-800 border-2 border-emerald-200', locked: true },

    // Elite Zone
    { id: 'simplifier', icon: Lightbulb, label: t.conceptSimplifier, color: 'bg-violet-900 text-white shadow-xl ring-2 ring-violet-300', locked: false, 
      img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop' }, 
    { id: 'debate', icon: Swords, label: t.debateArena, color: 'bg-gray-900 text-white shadow-xl ring-2 ring-red-500', locked: false,
      img: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?q=80&w=1000&auto=format&fit=crop' }, 

    // Executive Suite
    { id: 'linkedin', icon: Briefcase, label: t.linkedInOptimizer, color: 'bg-black text-yellow-500 border border-yellow-600 shadow-2xl', locked: false },
    { id: 'roadmap', icon: Map, label: t.careerRoadmap, color: 'bg-black text-white border border-gray-600 shadow-2xl', locked: false },
    { id: 'cv', icon: FileText, label: t.cvBuilder, color: 'bg-slate-700 text-white border border-slate-600 shadow-2xl', locked: true },

    // More Premium Items
    { id: 'project', icon: Rocket, label: t.projectGenie, color: 'bg-student-blue text-white', locked: true },
    { id: 'crush', icon: Heart, label: t.crushCalc, color: 'bg-rose-500 text-white', locked: true },
    { id: 'outfit', icon: Shirt, label: t.outfitRater, color: 'bg-teal-500 text-white', locked: true },
    { id: 'insta', icon: Instagram, label: t.instaCaptions, color: 'bg-gradient-to-br from-pink-500 to-orange-400 text-white', locked: true },
    { id: 'dream', icon: CloudMoon, label: t.dreamInterpreter, color: 'bg-indigo-900 text-indigo-200', locked: true },
  ];

  // Logic for Arrows
  const currentIndex = navItems.findIndex(i => i.id === activeTab);
  
  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < navItems.length - 1) {
        handleTabChange(navItems[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
        handleTabChange(navItems[currentIndex - 1].id);
    }
  };

  // Sections Grouping - REARRANGED
  const sectionAcademicIds = ['gpa', 'email', 'summarizer', 'exam', 'project'];
  const sectionSurvivalIds = ['roast', 'guide', 'contract', 'chef'];
  const sectionFunIds = ['studio', 'memes', 'bingo', 'quiz', 'food', 'crush', 'outfit', 'insta', 'dream'];
  // Executive Suite uses specific IDs in the layout code
  // Elite Zone uses specific IDs in the layout code

  const renderGridSection = (title: string, icon: React.ElementType, ids: string[], accentColor: string) => (
      <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
               <div className={`p-2 rounded-lg ${accentColor} text-white`}>
                   {React.createElement(icon, { size: 24 })}
               </div>
               <h3 className="font-black text-xl text-gray-800 uppercase tracking-wide">{title}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {navItems.filter(i => ids.includes(i.id)).map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`
                            bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center justify-center gap-4 group relative overflow-hidden
                            ${item.locked && !isPremium ? 'opacity-90' : ''}
                        `}
                    >
                        {item.locked && !isPremium && (
                            <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2 bg-black/80 text-white p-1.5 rounded-full z-10">
                                <Lock size={12} />
                            </div>
                        )}
                        
                        <div className={`p-4 rounded-full ${item.color} group-hover:scale-110 transition-transform relative`}>
                            <item.icon size={32} />
                        </div>
                        <span className="font-bold text-gray-800 text-center text-sm md:text-base">{item.label}</span>
                        
                        {item.locked && !isPremium && (
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                                <span className="bg-black text-white text-xs px-3 py-1 rounded-full font-bold">{t.unlockPro}</span>
                            </div>
                        )}
                    </button>
                ))}
          </div>
      </div>
  );

  return (
    <div 
        dir={lang === 'ar' ? 'rtl' : 'ltr'} 
        className={`min-h-screen bg-gray-50 ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}
    >
        {/* Premium Modal */}
        {showPremiumModal && (
            <PremiumModal 
                lang={lang} 
                onClose={() => setShowPremiumModal(false)} 
                onUnlock={handleUnlock}
            />
        )}

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
                        {navItems.filter(i => !i.locked || isPremium).map((item) => (
                            <button 
                                key={item.id}
                                onClick={() => handleTabChange(item.id)}
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

                    {/* EXECUTIVE SUITE (Top Tier) */}
                    <div className="mb-8">
                         <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                             <Crown className="text-black fill-yellow-400" />
                             <h3 className="font-black text-2xl text-gray-800">{t.executiveSuite}</h3>
                         </div>
                         <p className="text-gray-500 text-sm mb-4 text-center md:text-start md:w-2/3">{t.executiveDesc}</p>
                         
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {navItems.filter(i => ['linkedin', 'roadmap', 'cv'].includes(i.id)).map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleTabChange(item.id)}
                                    className={`
                                        p-6 rounded-2xl transition-all duration-300 flex items-center justify-between gap-4 group relative overflow-hidden h-36
                                        ${item.color}
                                    `}
                                >
                                    {item.locked && !isPremium && (
                                        <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2 bg-black/80 text-white p-1.5 rounded-full z-20">
                                            <Lock size={12} />
                                        </div>
                                    )}

                                    <div className="z-10 text-left rtl:text-right">
                                        <span className="font-black text-lg md:text-xl block mb-1">{item.label}</span>
                                        <span className={`text-[9px] opacity-80 font-bold uppercase tracking-widest px-2 py-1 rounded-full ${item.id === 'linkedin' ? 'bg-yellow-900/40 text-yellow-300' : 'bg-gray-800 text-white'}`}>High Value</span>
                                    </div>
                                    <div className="bg-white/10 p-4 rounded-full z-10 backdrop-blur-sm">
                                        <item.icon size={28} />
                                    </div>
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 translate-x-1/2" />
                                </button>
                            ))}
                         </div>
                    </div>
                    
                    {/* ELITE ZONE BANNER */}
                    <div className="mb-12">
                         <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                             <Zap className="text-yellow-500 fill-yellow-500" />
                             <h3 className="font-black text-2xl text-gray-800">{t.eliteZone}</h3>
                         </div>
                         <p className="text-gray-500 text-sm mb-4 text-center md:text-start md:w-2/3">{t.eliteZoneDesc}</p>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {navItems.filter(i => i.id === 'simplifier' || i.id === 'debate').map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleTabChange(item.id)}
                                    className={`
                                        relative p-6 rounded-2xl transition-all duration-300 flex items-center justify-between gap-4 group overflow-hidden h-40 shadow-xl
                                    `}
                                >
                                    {/* Background Image with Overlay */}
                                    <div className="absolute inset-0 z-0">
                                        <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className={`absolute inset-0 opacity-80 ${item.id === 'simplifier' ? 'bg-indigo-900/90 mix-blend-multiply' : 'bg-red-950/90 mix-blend-multiply'}`}></div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    </div>

                                    <div className="z-10 text-left rtl:text-right relative">
                                        <span className="font-black text-2xl block mb-1 text-white drop-shadow-lg">{item.label}</span>
                                        <span className="text-xs font-bold text-white/80 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                            {item.id === 'simplifier' ? 'Quantum Intelligence' : 'Intellectual Arena'}
                                        </span>
                                    </div>
                                    <div className="bg-white/10 p-4 rounded-full z-10 backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-colors">
                                        <item.icon size={32} className="text-white" />
                                    </div>
                                </button>
                            ))}
                         </div>
                    </div>

                    {/* SECTION 1: UNIVERSITY HUB (DEDICATED) */}
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4">
                             <div className="p-2 rounded-lg bg-teal-500 text-white">
                                 <Building2 size={24} />
                             </div>
                             <h3 className="font-black text-xl text-gray-800 uppercase tracking-wide">{t.sectionUniHub}</h3>
                        </div>
                        <button
                            onClick={() => handleTabChange('unihub')}
                            className="w-full bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-teal-100 group relative overflow-hidden flex flex-col items-center justify-center gap-4 text-center"
                        >
                             <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full translate-x-10 -translate-y-10 z-0 opacity-50" />
                             
                             <div className="p-5 rounded-full bg-teal-100 text-teal-600 group-hover:scale-110 transition-transform relative z-10">
                                <Building2 size={48} />
                             </div>
                             <div className="z-10">
                                 <h4 className="text-2xl font-black text-gray-800 mb-2">{t.uniHub}</h4>
                                 <p className="text-gray-500">{t.uniHubDesc}</p>
                             </div>
                             <div className="mt-4 bg-teal-500 text-white px-6 py-2 rounded-full font-bold text-sm group-hover:bg-teal-600 transition z-10">
                                 {lang === 'ar' ? 'تصفح خدمات جامعتك' : 'Explore Campus Services'}
                             </div>
                        </button>
                    </div>

                    {/* SECTION 2: ACADEMIC TOOLS */}
                    {renderGridSection(t.sectionUniServices, School, sectionAcademicIds, 'bg-indigo-500')}

                    {/* SECTION 3: SURVIVAL MODE */}
                    {renderGridSection(t.sectionSurvival, Backpack, sectionSurvivalIds, 'bg-green-500')}

                    {/* SECTION 4: FUN & LIFESTYLE */}
                    {renderGridSection(t.sectionFun, PartyPopper, sectionFunIds, 'bg-pink-500')}

                    {!isPremium && (
                        <div 
                            onClick={() => setShowPremiumModal(true)}
                            className="mt-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-lg text-white flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer transform hover:scale-[1.01] transition"
                        >
                            <div className="text-center md:text-start">
                                <h3 className="text-2xl font-black mb-1 flex items-center gap-2 justify-center md:justify-start">
                                    {t.proPack} <Lock size={20} />
                                </h3>
                                <p className="text-white/90 text-sm">
                                    {lang === 'ar' ? "افتح ميزات حصرية زي الرسام الذكي ومارد المشاريع!" : "Unlock exclusive features like AI Studio & Project Genie!"}
                                </p>
                            </div>
                            <button className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg whitespace-pre">
                                 {t.unlockPro}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* SECTIONS */}
            <div className="animate-fade-in">
                {activeTab !== 'dashboard' && (
                    <div className="flex justify-between items-center mb-6 px-2">
                        {/* Prev Button */}
                        <button 
                            onClick={handlePrev}
                            disabled={currentIndex <= 0}
                            className={`flex items-center gap-1 text-sm font-bold px-3 py-2 rounded-lg transition 
                                ${currentIndex <= 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 hover:text-student-blue'}`}
                        >
                            {lang === 'ar' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                            <span className="hidden md:inline">{t.prevTool}</span>
                        </button>

                        {/* Dashboard Home Button */}
                        <button 
                            onClick={() => setActiveTab('dashboard')}
                            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-gray-50 transition"
                        >
                            <Home size={18} />
                            <span>{t.backToDash}</span>
                        </button>

                        {/* Next Button */}
                        <button 
                            onClick={handleNext}
                            disabled={currentIndex >= navItems.length - 1}
                            className={`flex items-center gap-1 text-sm font-bold px-3 py-2 rounded-lg transition
                                ${currentIndex >= navItems.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 hover:text-student-blue'}`}
                        >
                            <span className="hidden md:inline">{t.nextTool}</span>
                            {lang === 'ar' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                        </button>
                    </div>
                )}

                {activeTab === 'quiz' && <Quiz lang={lang} />}
                {activeTab === 'bingo' && <Bingo lang={lang} />}
                {activeTab === 'studio' && <AIStudio lang={lang} />}
                {activeTab === 'memes' && <MemeGallery lang={lang} />}
                {activeTab === 'guide' && <SurvivalGuide lang={lang} />}
                {activeTab === 'gpa' && <GPACalculator lang={lang} />}
                {activeTab === 'email' && <EmailWizard lang={lang} />}
                {activeTab === 'food' && <FoodRoulette lang={lang} />}
                {activeTab === 'roast' && <ScheduleRoaster lang={lang} />}
                {activeTab === 'chef' && <DormChef lang={lang} />}
                {activeTab === 'unihub' && <UniHub lang={lang} />}
                
                {/* Nerd Corner */}
                {activeTab === 'summarizer' && <SmartSummarizer lang={lang} />}
                {activeTab === 'exam' && <ExamSimulator lang={lang} />}

                {/* Elite Zone */}
                {activeTab === 'simplifier' && <ConceptSimplifier lang={lang} />}
                {activeTab === 'debate' && <DebateArena lang={lang} />}
                
                {/* Executive Suite */}
                {activeTab === 'linkedin' && <LinkedInOptimizer lang={lang} />}
                {activeTab === 'roadmap' && <CareerRoadmap lang={lang} />}

                {/* Premium Views */}
                {activeTab === 'project' && <ProjectGenie lang={lang} />}
                {activeTab === 'crush' && <CrushCalculator lang={lang} />}
                {activeTab === 'outfit' && <OutfitRater lang={lang} />}
                {activeTab === 'cv' && <CVBuilder lang={lang} />}
                {activeTab === 'contract' && <RoommateContract lang={lang} />}
                {activeTab === 'insta' && <InstaCaptions lang={lang} />}
                {activeTab === 'dream' && <DreamInterpreter lang={lang} />}
            </div>
        </main>
    </div>
  );
};

export default App;
