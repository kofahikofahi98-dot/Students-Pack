
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Calculator, AlertTriangle, CheckCircle, Trophy, Ban, Share2 } from 'lucide-react';

interface GPACalculatorProps {
    lang: Language;
}

const GPACalculator: React.FC<GPACalculatorProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [currentGPA, setCurrentGPA] = useState<string>('');
    const [passedHours, setPassedHours] = useState<string>('');
    const [status, setStatus] = useState<{ msgEn: string; msgAr: string; icon: any; color: string; percent: number } | null>(null);

    const calculateStatus = () => {
        const gpa = parseFloat(currentGPA);
        if (isNaN(gpa)) return;

        const percent = Math.min(100, Math.max(0, (gpa / 4.2) * 100)); // Normalized for Gauge

        let result;
        if (gpa >= 3.65) {
            result = { 
                msgEn: "Legendary! (Dean's List)", 
                msgAr: "أسطورة! (لوحة الشرف)", 
                icon: Trophy, 
                color: "text-yellow-500",
                percent
            };
        } else if (gpa >= 3.0) {
            result = { 
                msgEn: "Solid (Safe Zone)", 
                msgAr: "وضعك لوز (بالسليم)", 
                icon: CheckCircle, 
                color: "text-green-500",
                percent
            };
        } else if (gpa >= 2.0) {
            result = { 
                msgEn: "Survival Mode", 
                msgAr: "وضع النجاة (يا دوب)", 
                icon: Calculator, 
                color: "text-blue-500",
                percent
            };
        } else {
            result = { 
                msgEn: "Academic Probation Warning", 
                msgAr: "إنذار أكاديمي بالطريق", 
                icon: AlertTriangle, 
                color: "text-red-500",
                percent
            };
        }
        setStatus(result);
    };

    const handleShare = async () => {
        if (!status) return;
        const msg = lang === 'ar' ? status.msgAr : status.msgEn;
        const text = `My GPA Status: ${msg} (${currentGPA}) - Calculated by Fun Student Pack!`;
        if (navigator.share) {
            await navigator.share({
                title: 'GPA Status',
                text: text,
            }).catch(console.error);
        } else {
             navigator.clipboard.writeText(text);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-purple-100 p-3 rounded-2xl text-purple-600">
                    <Calculator size={32} />
                </div>
                <div>
                    <h3 className="text-3xl font-black text-gray-800">{t.gpaCalc}</h3>
                    <p className="text-gray-500 text-sm">{lang === 'ar' ? 'حاسبة المعدل الواقعية' : 'The Realistic GPA Calculator'}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">{t.currentGpa}</label>
                    <input 
                        type="number" 
                        step="0.01"
                        value={currentGPA}
                        onChange={(e) => setCurrentGPA(e.target.value)}
                        className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-purple-500 outline-none text-2xl font-bold text-center bg-gray-50"
                        placeholder="0.00"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">{t.creditHours}</label>
                    <input 
                        type="number" 
                        value={passedHours}
                        onChange={(e) => setPassedHours(e.target.value)}
                        className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-purple-500 outline-none text-2xl font-bold text-center bg-gray-50"
                        placeholder="0"
                    />
                </div>
            </div>

            <button 
                onClick={calculateStatus}
                className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-purple-700 transition shadow-lg transform active:scale-95"
            >
                {t.calculate}
            </button>

            {status && (
                <div className="mt-8 animate-fade-in-up relative group">
                    <button 
                        onClick={handleShare}
                        className="absolute top-0 right-0 p-2 text-gray-400 hover:text-purple-600 transition"
                    >
                        <Share2 size={20} />
                    </button>
                    {/* Gauge Visualization */}
                    <div className="relative w-48 h-24 mx-auto mb-4 overflow-hidden">
                        <div className="absolute w-48 h-48 rounded-full border-[20px] border-gray-100 top-0 left-0 box-border"></div>
                        <div 
                            className={`absolute w-48 h-48 rounded-full border-[20px] ${status.color.replace('text', 'border')} top-0 left-0 box-border origin-bottom transition-transform duration-1000 ease-out`}
                            style={{ transform: `rotate(${(status.percent / 100) * 180 - 180}deg)` }}
                        ></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-2xl font-black text-gray-800">
                           {currentGPA}
                        </div>
                    </div>

                    <div className="text-center bg-gray-50 p-6 rounded-2xl border border-gray-200">
                        <div className={`inline-flex items-center justify-center p-3 rounded-full bg-white shadow-sm mb-3 ${status.color}`}>
                            <status.icon size={28} />
                        </div>
                        <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-1">{t.studentStatus}</h4>
                        <p className="font-black text-xl text-gray-800">{lang === 'ar' ? status.msgAr : status.msgEn}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GPACalculator;
