
import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateStudentSketch } from '../services/geminiService';
import { Image as ImageIcon, Loader2, Info, Plus, Trash2, Move, Type, Save } from 'lucide-react';

interface StudioProps {
    lang: Language;
}

interface TextLayer {
    id: number;
    text: string;
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100
    color: string;
    bgStyle: 'none' | 'white' | 'glass';
}

const AIStudio: React.FC<StudioProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);
    
    // Multi-text state
    const [layers, setLayers] = useState<TextLayer[]>([]);
    const [activeLayerId, setActiveLayerId] = useState<number | null>(null);
    
    // Dragging state
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setResultImage(null);
        setLayers([]);
        
        const img = await generateStudentSketch(prompt);
        setResultImage(img);
        setLoading(false);
    };

    const addTextLayer = () => {
        const newLayer: TextLayer = {
            id: Date.now(),
            text: lang === 'ar' ? 'نص جديد' : 'New Text',
            x: 50, // Center
            y: 50, // Center
            color: '#000000',
            bgStyle: 'white'
        };
        setLayers([...layers, newLayer]);
        setActiveLayerId(newLayer.id);
    };

    const updateLayer = (id: number, updates: Partial<TextLayer>) => {
        setLayers(layers.map(l => l.id === id ? { ...l, ...updates } : l));
    };

    const deleteLayer = (id: number) => {
        setLayers(layers.filter(l => l.id !== id));
        if (activeLayerId === id) setActiveLayerId(null);
    };

    // Drag Logic
    const handlePointerDown = (e: React.PointerEvent, id: number) => {
        e.stopPropagation();
        const layer = layers.find(l => l.id === id);
        if (!layer || !containerRef.current) return;

        setActiveLayerId(id);
        setIsDragging(true);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || activeLayerId === null || !containerRef.current) return;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        const y = ((e.clientY - containerRect.top) / containerRect.height) * 100;

        // Clamp to 0-100
        const clampedX = Math.max(0, Math.min(100, x));
        const clampedY = Math.max(0, Math.min(100, y));

        updateLayer(activeLayerId, { x: clampedX, y: clampedY });
    };

    const handlePointerUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const handleGlobalUp = () => setIsDragging(false);
        window.addEventListener('pointerup', handleGlobalUp);
        return () => window.removeEventListener('pointerup', handleGlobalUp);
    }, []);

    const handleDownload = () => {
        if (!resultImage) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = resultImage;

        img.onload = () => {
            if (!ctx) return;
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw Base Image
            ctx.drawImage(img, 0, 0);

            // Draw Layers
            layers.forEach(layer => {
                const x = (layer.x / 100) * canvas.width;
                const y = (layer.y / 100) * canvas.height;

                // Font Config (Scale relative to canvas)
                const fontSize = canvas.width * 0.05; // 5% of width
                ctx.font = `bold ${fontSize}px 'Cairo', sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                const metrics = ctx.measureText(layer.text);
                const textWidth = metrics.width;
                const padding = fontSize * 0.4;
                const boxHeight = fontSize * 1.5;

                // Draw Background
                if (layer.bgStyle !== 'none') {
                    ctx.fillStyle = layer.bgStyle === 'white' 
                        ? 'rgba(255, 255, 255, 0.9)' 
                        : 'rgba(0, 0, 0, 0.5)';
                    
                    // Draw rounded rect equivalent
                    ctx.fillRect(
                        x - textWidth/2 - padding, 
                        y - boxHeight/2, 
                        textWidth + padding*2, 
                        boxHeight
                    );
                }

                // Draw Text
                ctx.fillStyle = layer.bgStyle === 'glass' ? '#FFFFFF' : layer.color;
                
                // Add simple shadow for legibility if no background
                if (layer.bgStyle === 'none') {
                    ctx.shadowColor = "rgba(0,0,0,0.5)";
                    ctx.shadowBlur = 4;
                    ctx.shadowOffsetX = 2;
                    ctx.shadowOffsetY = 2;
                } else {
                    ctx.shadowColor = "transparent";
                }

                ctx.fillText(layer.text, x, y);
            });

            const link = document.createElement('a');
            link.download = `student-sketch-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
    };

    // Text Styles
    const colors = ['#000000', '#FFFFFF', '#CE1126', '#0077E6', '#FFD700', '#10B981'];
    
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
                <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                    <ImageIcon className="text-student-blue w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    {t.sketchGen}
                </h3>
                
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t.enterPrompt}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-student-blue focus:ring-0 transition-colors bg-gray-50 text-gray-800 mb-2"
                    rows={3}
                />

                <div className="flex items-start gap-2 text-xs md:text-sm text-gray-500 mb-6 text-start bg-gray-50 p-3 rounded-lg">
                    <Info size={16} className="mt-0.5 shrink-0" />
                    <p>
                        {lang === 'ar' 
                            ? "ملاحظة: الرسام الذكي يرسم فقط. استخدم أدوات النص أدناه لإضافة نصوصك الخاصة على الرسمة."
                            : "Note: The AI draws the scene. Use the text tools below to add your own captions on top."}
                    </p>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className="w-full md:w-auto bg-jordan-red disabled:bg-gray-300 text-white px-12 py-3 rounded-full font-bold inline-flex items-center justify-center gap-2 transition hover:bg-red-700 shadow-lg transform hover:-translate-y-1"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            {t.generating}
                        </>
                    ) : (
                        <>
                            <span className="text-xl">✨</span> {t.generate}
                        </>
                    )}
                </button>
            </div>

            {/* Results Display */}
            {resultImage && (
                <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border-4 border-highlight-yellow animate-fade-in-up">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xl font-bold text-gray-800">{t.results}</h4>
                        <div className="flex gap-2">
                            <button 
                                onClick={addTextLayer}
                                className="bg-student-blue text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold hover:bg-blue-600 transition"
                            >
                                <Plus size={16} /> {t.addTextLayer}
                            </button>
                            <button 
                                onClick={handleDownload}
                                className="bg-gray-800 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold hover:bg-black transition"
                                title={t.saveImage}
                            >
                                <Save size={16} /> {t.saveImage}
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Image Canvas */}
                        <div className="lg:col-span-2">
                            <div 
                                ref={containerRef}
                                className="relative w-full rounded-xl overflow-hidden shadow-md border-2 border-gray-100 bg-gray-50 touch-none select-none"
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                                style={{ aspectRatio: '1/1' }}
                            >
                                <img 
                                    src={resultImage} 
                                    alt="Generated Sketch" 
                                    className="w-full h-full object-contain pointer-events-none" 
                                />
                                
                                {layers.map((layer) => (
                                    <div
                                        key={layer.id}
                                        onPointerDown={(e) => handlePointerDown(e, layer.id)}
                                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move p-2 rounded-lg border-2 transition-all group
                                            ${activeLayerId === layer.id ? 'border-student-blue z-20' : 'border-transparent z-10 hover:border-gray-300'}
                                        `}
                                        style={{ 
                                            left: `${layer.x}%`, 
                                            top: `${layer.y}%`,
                                        }}
                                    >
                                        <span 
                                            className={`
                                                font-bold text-lg md:text-2xl whitespace-nowrap px-3 py-1 rounded-md
                                                ${layer.bgStyle === 'white' ? 'bg-white/90 shadow-sm' : ''}
                                                ${layer.bgStyle === 'glass' ? 'bg-black/30 backdrop-blur-md text-white' : ''}
                                            `}
                                            style={{ 
                                                fontFamily: 'Cairo, sans-serif',
                                                color: layer.bgStyle === 'glass' ? '#FFF' : layer.color,
                                                textShadow: layer.bgStyle === 'none' ? '2px 2px 2px rgba(0,0,0,0.5)' : 'none'
                                            }}
                                        >
                                            {layer.text}
                                        </span>
                                        {/* Drag Handle Indicator for Active Item */}
                                        {activeLayerId === layer.id && (
                                            <div className="absolute -top-3 -right-3 bg-student-blue text-white rounded-full p-1 shadow-sm">
                                                <Move size={12} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                
                                {layers.length === 0 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
                                        {t.addCaption}
                                    </div>
                                )}
                            </div>
                            <p className="text-center text-xs text-gray-400 mt-2">{t.dragToMove}</p>
                        </div>

                        {/* Controls Panel */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 h-fit">
                            <h5 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <Type size={18} /> {t.textControls}
                            </h5>
                            
                            {activeLayerId ? (
                                <div className="space-y-4">
                                    {layers.map(layer => layer.id === activeLayerId && (
                                        <div key={layer.id} className="animate-fade-in">
                                            <label className="text-xs font-semibold text-gray-500 mb-1 block">{t.captionPlaceholder}</label>
                                            <input 
                                                type="text"
                                                value={layer.text}
                                                onChange={(e) => updateLayer(layer.id, { text: e.target.value })}
                                                className="w-full p-2 border rounded-lg mb-4 text-gray-800"
                                                autoFocus
                                            />
                                            
                                            <label className="text-xs font-semibold text-gray-500 mb-2 block">{t.textColor}</label>
                                            <div className="flex gap-2 mb-4 flex-wrap">
                                                {colors.map(c => (
                                                    <button
                                                        key={c}
                                                        onClick={() => updateLayer(layer.id, { color: c })}
                                                        className={`w-8 h-8 rounded-full border-2 ${layer.color === c ? 'border-gray-600 scale-110' : 'border-gray-200'}`}
                                                        style={{ backgroundColor: c }}
                                                    />
                                                ))}
                                            </div>

                                            <label className="text-xs font-semibold text-gray-500 mb-2 block">{t.textBg}</label>
                                            <div className="flex gap-2 mb-6">
                                                <button 
                                                    onClick={() => updateLayer(layer.id, { bgStyle: 'none' })}
                                                    className={`px-3 py-1 rounded text-sm ${layer.bgStyle === 'none' ? 'bg-gray-200 font-bold' : 'bg-white border'}`}
                                                >
                                                    Aa
                                                </button>
                                                <button 
                                                    onClick={() => updateLayer(layer.id, { bgStyle: 'white' })}
                                                    className={`px-3 py-1 rounded text-sm ${layer.bgStyle === 'white' ? 'bg-gray-200 font-bold' : 'bg-white border'}`}
                                                >
                                                    <span className="bg-white px-1">Aa</span>
                                                </button>
                                                <button 
                                                    onClick={() => updateLayer(layer.id, { bgStyle: 'glass' })}
                                                    className={`px-3 py-1 rounded text-sm ${layer.bgStyle === 'glass' ? 'bg-gray-200 font-bold' : 'bg-white border'}`}
                                                >
                                                    <span className="bg-black/50 text-white px-1">Aa</span>
                                                </button>
                                            </div>

                                            <button 
                                                onClick={() => deleteLayer(layer.id)}
                                                className="w-full flex items-center justify-center gap-2 text-red-500 bg-red-50 py-2 rounded-lg hover:bg-red-100 transition"
                                            >
                                                <Trash2 size={16} /> {t.deleteLayer}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-400 py-8 text-sm">
                                    {layers.length > 0 
                                        ? (lang === 'ar' ? 'اضغط على أي نص لتعديله' : 'Tap text to edit')
                                        : (lang === 'ar' ? 'لا يوجد نصوص' : 'No text layers yet')
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIStudio;
