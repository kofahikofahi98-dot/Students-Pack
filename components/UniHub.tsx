
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, UNIVERSITIES, UNI_SERVICES_DATA, GENERIC_SERVICES } from '../constants';
import { Phone, Coffee, Utensils, AlertCircle, Bus, Building2, Calculator, CheckCircle, AlertTriangle, XCircle, CheckSquare, Plus, Trash2, Store, CreditCard, TrendingUp, Eye, Image } from 'lucide-react';

interface UniHubProps {
    lang: Language;
}

type Tab = 'food' | 'contacts' | 'transport' | 'tools';

interface Task {
    id: number;
    text: string;
    done: boolean;
}

const UniHub: React.FC<UniHubProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [selectedUniId, setSelectedUniId] = useState<string>('');
    const [activeTab, setActiveTab] = useState<Tab>('food');
    
    // Absence Calculator State
    const [lecturesPerWeek, setLecturesPerWeek] = useState<number>(3);
    const [missedLectures, setMissedLectures] = useState<number>(0);
    const [absenceStatus, setAbsenceStatus] = useState<'safe' | 'warning' | 'danger' | null>(null);

    // CGPA Forecaster State
    const [oldCgpa, setOldCgpa] = useState<string>('');
    const [oldHours, setOldHours] = useState<string>('');
    const [semGpa, setSemGpa] = useState<string>('');
    const [semHours, setSemHours] = useState<string>('');
    const [newCgpaResult, setNewCgpaResult] = useState<string | null>(null);

    // Todo List State
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');

    // Business Listing Modal
    const [showBizModal, setShowBizModal] = useState(false);
    const [bizName, setBizName] = useState('');
    const [bizPhone, setBizPhone] = useState('');
    const [bizType, setBizType] = useState('');
    const [bizMenu, setBizMenu] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Menu Viewer Modal
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const selectedUni = UNIVERSITIES.find(u => u.id === selectedUniId);
    
    // Fallback to generic if specific data not found
    const uniData = selectedUniId ? (UNI_SERVICES_DATA[selectedUniId] || GENERIC_SERVICES) : null;

    const handleCalculateAbsence = () => {
        // Simple logic: 15% rule usually
        const totalWeeks = 16;
        const totalLectures = lecturesPerWeek * totalWeeks;
        const maxAbsence = Math.floor(totalLectures * 0.15); // 15%
        
        if (missedLectures >= maxAbsence) {
            setAbsenceStatus('danger');
        } else if (missedLectures >= maxAbsence - 2) {
            setAbsenceStatus('warning');
        } else {
            setAbsenceStatus('safe');
        }
    };

    const handleCalculateCGPA = () => {
        const cGPA = parseFloat(oldCgpa);
        const cHours = parseFloat(oldHours);
        const sGPA = parseFloat(semGpa);
        const sHours = parseFloat(semHours);

        if (isNaN(cGPA) || isNaN(cHours) || isNaN(sGPA) || isNaN(sHours) || cHours + sHours === 0) return;

        // Weighted Average Formula
        const totalPoints = (cGPA * cHours) + (sGPA * sHours);
        const totalHours = cHours + sHours;
        const newGPA = totalPoints / totalHours;

        setNewCgpaResult(newGPA.toFixed(2));
    };

    const addTask = () => {
        if (!newTask.trim()) return;
        setTasks([...tasks, { id: Date.now(), text: newTask, done: false }]);
        setNewTask('');
    };

    const toggleTask = (id: number) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, done: !task.done } : task));
    };

    const removeTask = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const handleBizSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate payment delay
        setTimeout(() => {
            setIsSubmitting(false);
            setPaymentSuccess(true);
        }, 1500);
    };

    if (!selectedUniId) {
        return (
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center animate-fade-in-up">
                <div className="bg-student-blue/10 p-4 rounded-full inline-block mb-4">
                    <Building2 size={40} className="text-student-blue" />
                </div>
                <h3 className="text-3xl font-black text-gray-800 mb-2">{t.selectUni}</h3>
                <p className="text-gray-500 mb-8 max-w-lg mx-auto">{lang === 'ar' ? 'اختر جامعتك للوصول إلى الخدمات والمطاعم المخصصة لك' : 'Select your campus to access customized services and restaurant guides'}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {UNIVERSITIES.map(uni => (
                        <button
                            key={uni.id}
                            onClick={() => setSelectedUniId(uni.id)}
                            className="bg-gray-50 hover:bg-white p-6 border-2 border-transparent hover:border-student-blue rounded-2xl transition-all shadow-sm hover:shadow-lg flex flex-col items-center gap-4 group h-44 justify-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center p-2 shadow-sm group-hover:scale-110 transition-transform overflow-hidden border border-gray-100">
                                {uni.logo ? (
                                    <img 
                                        src={uni.logo} 
                                        alt={uni.nameEn} 
                                        className="w-full h-full object-contain" 
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${uni.nameEn}&background=random`;
                                        }}
                                    />
                                ) : (
                                    <Building2 className="text-gray-300" />
                                )}
                            </div>
                            <span className="font-bold text-gray-800 text-sm group-hover:text-student-blue transition-colors leading-tight">
                                {lang === 'ar' ? uni.nameAr : uni.nameEn}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto relative">
            {/* Menu Viewer Modal */}
            {activeMenu && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" onClick={() => setActiveMenu(null)}>
                    <div className="relative max-w-2xl w-full max-h-[90vh] overflow-auto rounded-lg bg-white" onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => setActiveMenu(null)}
                            className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black transition z-10"
                        >
                            ✕
                        </button>
                        <img src={activeMenu} alt="Menu" className="w-full h-auto" />
                        <div className="p-4 text-center bg-white border-t">
                            <h4 className="font-bold text-gray-800">{t.menu}</h4>
                        </div>
                    </div>
                </div>
            )}

            {/* Business Listing Modal */}
            {showBizModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-fade-in-up">
                        {!paymentSuccess ? (
                            <form onSubmit={handleBizSubmit}>
                                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white relative">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowBizModal(false)}
                                        className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-gray-400 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                    <h3 className="text-xl font-black flex items-center gap-2 mb-1">
                                        <Store className="text-yellow-400" />
                                        {t.bizFormTitle}
                                    </h3>
                                    <p className="text-sm opacity-80">{t.listYourBiz}</p>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{t.bizNameLabel}</label>
                                        <input 
                                            required
                                            value={bizName}
                                            onChange={(e) => setBizName(e.target.value)}
                                            className="w-full p-3 border rounded-xl bg-gray-50" 
                                            placeholder="My Awesome Cafe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{t.bizPhoneLabel}</label>
                                        <input 
                                            required
                                            value={bizPhone}
                                            onChange={(e) => setBizPhone(e.target.value)}
                                            className="w-full p-3 border rounded-xl bg-gray-50" 
                                            placeholder="079xxxxxxx"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{t.bizTypeLabel}</label>
                                        <input 
                                            required
                                            value={bizType}
                                            onChange={(e) => setBizType(e.target.value)}
                                            className="w-full p-3 border rounded-xl bg-gray-50" 
                                            placeholder="Coffee House"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">{t.uploadMenu}</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 relative">
                                            <input 
                                                type="file" 
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                accept="image/*"
                                                onChange={(e) => setBizMenu(e.target.files?.[0] || null)}
                                            />
                                            <div className="flex flex-col items-center gap-1 text-gray-400">
                                                <Image size={24} />
                                                <span className="text-xs">{bizMenu ? bizMenu.name : t.uploadMenu}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 flex justify-between items-center">
                                        <span className="font-bold text-yellow-800">{t.subscriptionPrice}</span>
                                        <div className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded text-xs font-bold">Premium</div>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        {isSubmitting ? <div className="animate-spin w-5 h-5 border-2 border-white rounded-full border-t-transparent"/> : <CreditCard size={18} />}
                                        {t.payAndPublish}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-800 mb-2">{t.listingSuccess}</h3>
                                <p className="text-gray-600 mb-6">{t.listingSuccessMsg}</p>
                                <button 
                                    onClick={() => {
                                        setPaymentSuccess(false);
                                        setShowBizModal(false);
                                        setBizName('');
                                        setBizMenu(null);
                                    }}
                                    className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition"
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-md mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white shadow-md border border-gray-100 p-2 overflow-hidden flex items-center justify-center">
                        {selectedUni?.logo ? (
                            <img src={selectedUni.logo} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                             <Building2 className="text-gray-300" />
                        )}
                    </div>
                    <div className="text-center md:text-start">
                        <h3 className="font-black text-2xl text-gray-800 leading-tight">{lang === 'ar' ? selectedUni?.nameAr : selectedUni?.nameEn}</h3>
                        <p className="text-sm text-gray-500 font-bold">{t.uniHubDesc}</p>
                    </div>
                </div>
                <button 
                    onClick={() => setSelectedUniId('')}
                    className="text-sm font-bold text-student-blue bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
                >
                    Change
                </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-200 p-1 rounded-xl mb-6 overflow-x-auto">
                {[
                    { id: 'food', label: t.foodCoffee, icon: Utensils },
                    { id: 'contacts', label: t.contacts, icon: Phone },
                    { id: 'transport', label: t.transport, icon: Bus },
                    { id: 'tools', label: t.tools, icon: Calculator },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition whitespace-nowrap px-4
                            ${activeTab === tab.id ? 'bg-white text-student-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}
                        `}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="space-y-4 animate-fade-in">
                {/* FOOD TAB */}
                {activeTab === 'food' && uniData && (
                    <div className="space-y-4">
                        {/* Add Business Banner */}
                        <div className="bg-gradient-to-r from-gray-900 to-black text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
                            <div>
                                <h4 className="font-black text-lg flex items-center gap-2 text-yellow-400">
                                    <Store size={20} /> {t.areYouOwner}
                                </h4>
                                <p className="text-sm opacity-80">{t.listYourBiz}</p>
                            </div>
                            <button 
                                onClick={() => setShowBizModal(true)}
                                className="bg-yellow-400 text-black px-6 py-2 rounded-full font-bold hover:bg-yellow-500 transition shadow-md whitespace-nowrap"
                            >
                                {t.addBusiness}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {uniData.restaurants.map((rest, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-md transition flex flex-col gap-3">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                            {rest.logo ? (
                                                <img src={rest.logo} alt="Logo" className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                                            ) : (
                                                <div className={`p-3 rounded-full ${rest.type === 'coffee' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                                                    {rest.type === 'coffee' ? <Coffee size={20} /> : <Utensils size={20} />}
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-bold text-gray-800">{lang === 'ar' ? rest.nameAr : rest.nameEn}</h4>
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{rest.rating}</span>
                                            </div>
                                        </div>
                                        {rest.phone && rest.phone !== 'N/A' && (
                                            <a href={`tel:${rest.phone}`} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition">
                                                <Phone size={18} />
                                            </a>
                                        )}
                                    </div>
                                    
                                    {/* Menu Button */}
                                    <div className="w-full pt-2 border-t border-gray-50">
                                        {rest.menu ? (
                                            <button 
                                                onClick={() => setActiveMenu(rest.menu || null)}
                                                className="w-full flex items-center justify-center gap-2 text-student-blue bg-blue-50 hover:bg-blue-100 py-2 rounded-lg font-bold text-sm transition"
                                            >
                                                <Eye size={16} /> {t.viewMenu}
                                            </button>
                                        ) : (
                                            <button disabled className="w-full text-gray-400 bg-gray-50 py-2 rounded-lg font-bold text-sm cursor-not-allowed">
                                                {t.noMenu}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CONTACTS TAB */}
                {activeTab === 'contacts' && uniData && (
                    <div className="space-y-3">
                        {uniData.contacts.map((contact, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="text-red-500" />
                                    <span className="font-bold text-gray-800">{lang === 'ar' ? contact.nameAr : contact.nameEn}</span>
                                </div>
                                <a href={`tel:${contact.phone}`} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-bold transition">
                                    <Phone size={16} /> {contact.phone}
                                </a>
                            </div>
                        ))}
                    </div>
                )}

                {/* TRANSPORT TAB */}
                {activeTab === 'transport' && uniData && (
                     <div className="space-y-3">
                        {uniData.busRoutes.map((route, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <Bus className="text-student-blue" />
                                    <h4 className="font-bold text-lg">{lang === 'ar' ? route.nameAr : route.nameEn}</h4>
                                </div>
                                <p className="text-gray-500 text-sm pl-9">{route.stops}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* TOOLS TAB */}
                {activeTab === 'tools' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Absence Calculator */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <Calculator className="text-purple-500" />
                                <h4 className="font-bold text-gray-800 text-lg">{t.absenceCalc}</h4>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">{t.lecturesPerWeek}</label>
                                    <input 
                                        type="number" 
                                        value={lecturesPerWeek}
                                        onChange={(e) => setLecturesPerWeek(Number(e.target.value))}
                                        className="w-full p-2 border rounded-lg bg-gray-50 font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">{t.missedLectures}</label>
                                    <input 
                                        type="number" 
                                        value={missedLectures}
                                        onChange={(e) => setMissedLectures(Number(e.target.value))}
                                        className="w-full p-2 border rounded-lg bg-gray-50 font-bold"
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={handleCalculateAbsence}
                                className="w-full bg-purple-600 text-white py-2 rounded-xl font-bold hover:bg-purple-700 transition"
                            >
                                {t.calcAbsence}
                            </button>

                            {absenceStatus && (
                                <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 font-bold text-sm border-2
                                    ${absenceStatus === 'safe' ? 'bg-green-50 border-green-200 text-green-700' : ''}
                                    ${absenceStatus === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : ''}
                                    ${absenceStatus === 'danger' ? 'bg-red-50 border-red-200 text-red-700' : ''}
                                `}>
                                    {absenceStatus === 'safe' && <CheckCircle size={16} />}
                                    {absenceStatus === 'warning' && <AlertTriangle size={16} />}
                                    {absenceStatus === 'danger' && <XCircle size={16} />}
                                    
                                    <span>
                                        {absenceStatus === 'safe' && t.safe}
                                        {absenceStatus === 'warning' && t.warning}
                                        {absenceStatus === 'danger' && t.danger}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* CGPA Forecaster */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="text-student-blue" />
                                <h4 className="font-bold text-gray-800 text-lg">{t.cgpaForecaster}</h4>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">{t.currentCGPA}</label>
                                    <input 
                                        type="number" 
                                        value={oldCgpa}
                                        onChange={(e) => setOldCgpa(e.target.value)}
                                        className="w-full p-2 border rounded-lg bg-gray-50 font-bold text-sm"
                                        placeholder="2.5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">{t.passedHoursLabel}</label>
                                    <input 
                                        type="number" 
                                        value={oldHours}
                                        onChange={(e) => setOldHours(e.target.value)}
                                        className="w-full p-2 border rounded-lg bg-gray-50 font-bold text-sm"
                                        placeholder="60"
                                    />
                                </div>
                            </div>
                             <div className="grid grid-cols-2 gap-3 mb-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">{t.semesterGPA}</label>
                                    <input 
                                        type="number" 
                                        value={semGpa}
                                        onChange={(e) => setSemGpa(e.target.value)}
                                        className="w-full p-2 border rounded-lg bg-gray-50 font-bold text-sm"
                                        placeholder="3.0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">{t.semesterHoursLabel}</label>
                                    <input 
                                        type="number" 
                                        value={semHours}
                                        onChange={(e) => setSemHours(e.target.value)}
                                        className="w-full p-2 border rounded-lg bg-gray-50 font-bold text-sm"
                                        placeholder="15"
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={handleCalculateCGPA}
                                className="w-full bg-student-blue text-white py-2 rounded-xl font-bold hover:bg-blue-700 transition"
                            >
                                {t.calculateEffect}
                            </button>

                            {newCgpaResult && (
                                <div className="mt-4 p-3 rounded-xl bg-blue-50 border-2 border-blue-100 text-blue-900 text-center">
                                    <span className="block text-xs font-bold uppercase tracking-wider mb-1">{t.newCGPA}</span>
                                    <span className="text-2xl font-black">{newCgpaResult}</span>
                                </div>
                            )}
                        </div>

                        {/* Todo List */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
                             <div className="flex items-center gap-2 mb-4">
                                <CheckSquare className="text-green-500" />
                                <h4 className="font-bold text-gray-800 text-lg">{t.todoList}</h4>
                            </div>

                            <div className="flex gap-2 mb-4">
                                <input 
                                    type="text" 
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                                    className="flex-1 p-3 border rounded-xl bg-gray-50"
                                    placeholder={lang === 'ar' ? "مثلاً: تسليم الواجب..." : "e.g. Assignment due..."}
                                />
                                <button 
                                    onClick={addTask}
                                    className="bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {tasks.length === 0 && <p className="text-gray-400 text-center text-sm py-4">No tasks yet.</p>}
                                {tasks.map(task => (
                                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => toggleTask(task.id)}
                                                className={`w-5 h-5 rounded border flex items-center justify-center transition ${task.done ? 'bg-green-500 border-green-500 text-white' : 'border-gray-400 bg-white'}`}
                                            >
                                                {task.done && <CheckCircle size={14} />}
                                            </button>
                                            <span className={`font-medium ${task.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.text}</span>
                                        </div>
                                        <button onClick={() => removeTask(task.id)} className="text-gray-400 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UniHub;
