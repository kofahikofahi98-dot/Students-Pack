import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Calculator, AlertTriangle, CheckCircle, Trophy, Ban } from 'lucide-react';

interface GPACalculatorProps {
    lang: Language;
}

const GPACalculator: React.FC<GPACalculatorProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [currentGPA, setCurrentGPA] = useState<string>('');
    const [passedHours, setPassedHours] = useState<string>('');
    const [status, setStatus] = useState<{ msgEn: string; msgAr: string; icon: any; color: string } | null>(null);

    const calculateStatus = () => {
        const gpa = parseFloat(currentGPA);
        if (isNaN(gpa)) return;

        let result;
        // Assuming 4.0 scale roughly
        if (gpa >= 3.65) {
            result = { 
                msgEn: "Legend (First on the cohort!)", 
                msgAr: "أسطورة (الأول عالدفعة!)", 
                icon: Trophy, 
                color: "text-yellow-500 bg-yellow-50" 
            };
        } else if (gpa >= 3.0) {
            result = { 
                msgEn: "Solid (You actually study)", 
                msgAr: "وضعك لوز (شكلك بتدرس)", 
                icon: CheckCircle, 
                color: "text-green-500 bg-green-50" 
            };
        } else if (gpa >= 2.0) {
            result = { 
                msgEn: "Survival Mode (Just passing)", 
                msgAr: "وضع الطيار الآلي (يا دوب ناجح)", 
                icon: Calculator, 
                color: "text-blue-500 bg-blue-50" 
            };
        } else {
            result = { 
                msgEn: "Danger Zone (Say hi to the Dean)", 
                msgAr: "منطقة الخطر (سلم عالعميد)", 
                icon: AlertTriangle, 
                color: "text-red-500 bg-red-50" 
            };
        }
        setStatus(result);
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                    <Calculator size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{t.gpaCalc}</h3>
            </div>

            <div className="space-y-4 mb-6">
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">{t.currentGpa} (0.0 - 4.2)</label>
                    <input 
                        type="number" 
                        step="0.01"
                        value={currentGPA}
                        onChange={(e) => setCurrentGPA(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none text-lg"
                        placeholder="3.50"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">{t.creditHours}</label>
                    <input 
                        type="number" 
                        value={passedHours}
                        onChange={(e) => setPassedHours(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none text-lg"
                        placeholder="45"
                    />
                </div>
            </div>

            <button 
                onClick={calculateStatus}
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-purple-700 transition shadow-md"
            >
                {t.calculate}
            </button>

            {status && (
                <div className={`mt-6 p-4 rounded-xl border-2 flex items-center gap-4 animate-fade-in-up ${status.color.replace('text', 'border')}`}>
                    <div className={`p-3 rounded-full ${status.color}`}>
                        <status.icon size={32} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-500 text-xs uppercase tracking-wider">{t.studentStatus}</h4>
                        <p className="font-bold text-xl text-gray-800">{lang === 'ar' ? status.msgAr : status.msgEn}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GPACalculator;