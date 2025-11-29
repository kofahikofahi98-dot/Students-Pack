import React, { useState } from 'react';
import { SurvivalTip, Language } from '../types';
import { INITIAL_TIPS, TRANSLATIONS } from '../constants';
import { generateSurvivalTip } from '../services/geminiService';
import { Lightbulb, Coffee, BookOpen, Wallet, Users } from 'lucide-react';

interface GuideProps {
  lang: Language;
}

const SurvivalGuide: React.FC<GuideProps> = ({ lang }) => {
  const [tips, setTips] = useState<SurvivalTip[]>(INITIAL_TIPS);
  const [loading, setLoading] = useState(false);
  const t = TRANSLATIONS[lang];

  const getIcon = (cat: string) => {
      switch(cat) {
          case 'food': return <Coffee className="text-orange-500" />;
          case 'exam': return <BookOpen className="text-blue-500" />;
          case 'money': return <Wallet className="text-green-500" />;
          default: return <Users className="text-purple-500" />;
      }
  }

  const handleAddTip = async () => {
    setLoading(true);
    const newTip = await generateSurvivalTip();
    if (newTip) {
        setTips([newTip, ...tips]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.survivalGuide}</h2>
            <button 
                onClick={handleAddTip}
                disabled={loading}
                className="bg-black text-white px-6 py-2 rounded-full flex items-center gap-2 mx-auto hover:bg-gray-800 transition disabled:opacity-50"
            >
                {loading ? <div className="animate-spin w-4 h-4 border-2 border-white rounded-full border-t-transparent"></div> : <Lightbulb size={18} />}
                {t.generateNew}
            </button>
        </div>

        <div className="space-y-4">
            {tips.map((tip, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-student-blue hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-50 rounded-full shrink-0">
                            {getIcon(tip.category)}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 mb-1">
                                {lang === 'ar' ? tip.titleAr : tip.titleEn}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {lang === 'ar' ? tip.contentAr : tip.contentEn}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default SurvivalGuide;