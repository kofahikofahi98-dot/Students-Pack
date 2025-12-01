

import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, SurvivalTip, ExamQuestion } from "../types";

// DIRECT API KEY INTEGRATION FOR GITHUB PAGES
const API_KEY = "AIzaSyAlNahJw1UOp2yAAyk8QGCcesrcFl0qcFU";

const ai = new GoogleGenAI({ apiKey: API_KEY });

// System instruction to ensure Jordanian context
const SYSTEM_INSTRUCTION = `You are a hilarious, sarcastic Jordanian university student bot. 
You know everything about student life at UJ, JUST, Yarmouk, etc. 
You use slang like 'Ya Zame', 'Kharafi', 'Taysh', 'Haram', 'Dawweer'. 
You reference Mansaf, traffic circles, buses (Coaster), coffee, and exams.
Always provide content in both English and Arabic (Jordanian dialect).`;

// --- QUIZ ---
export const generateQuizQuestions = async (): Promise<QuizQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.NUMBER },
              questionEn: { type: Type.STRING },
              questionAr: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    textEn: { type: Type.STRING },
                    textAr: { type: Type.STRING },
                    score: { type: Type.NUMBER },
                  }
                }
              }
            }
          }
        }
      },
      contents: [
        {
          role: "user",
          parts: [{ text: "Generate 2 funny, relatable personality test questions for a Jordanian student. Scores should range 1-3 (1=Nerd, 2=Normal, 3=Chaos)." }]
        }
      ],
    });

    const jsonText = response.text || "[]";
    return JSON.parse(jsonText) as QuizQuestion[];
  } catch (error) {
    console.error("Quiz Error:", error);
    return [];
  }
};

// --- SURVIVAL GUIDE ---
export const generateSurvivalTip = async (): Promise<SurvivalTip | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titleEn: { type: Type.STRING },
            titleAr: { type: Type.STRING },
            contentEn: { type: Type.STRING },
            contentAr: { type: Type.STRING },
            category: { type: Type.STRING, enum: ["food", "exam", "money", "social"] }
          }
        }
      },
      contents: [{ role: "user", parts: [{ text: "Give me one funny survival tip for a university student in Jordan." }] }],
    });
    return JSON.parse(response.text || "{}") as SurvivalTip;
  } catch (error) {
    console.error("Tip Error:", error);
    return null;
  }
};

// --- MEMES ---
export const generateMemeCaption = async (topic?: string): Promise<{ topEn: string, bottomEn: string, topAr: string, bottomAr: string } | null> => {
  try {
    const prompt = topic 
      ? `Create a funny meme caption about: ${topic}.` 
      : "Create a random funny meme caption about university life.";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topEn: { type: Type.STRING },
            bottomEn: { type: Type.STRING },
            topAr: { type: Type.STRING },
            bottomAr: { type: Type.STRING },
          }
        }
      },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Meme Caption Error:", error);
    return null;
  }
};

export const generateMemeImage = async (topic: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: [
                { role: 'user', parts: [{ text: `A funny cartoon style meme background image about ${topic}. No text in image.` }] }
            ],
        });
        
        // Extract base64 image
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (e) {
        console.error("Meme Image Error", e);
        return null;
    }
}

// --- SKETCH (AI STUDIO) ---
export const generateStudentSketch = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          role: "user",
          parts: [{ text: `Create a funny, simple cartoon/doodle sketch about: ${prompt}. Jordanian university context. IMPORTANT: DO NOT WRITE ANY TEXT OR LETTERS IN THE IMAGE.` }]
        }
      ],
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Sketch Error:", error);
    return null;
  }
};

// --- EMAIL WIZARD ---
export const generateProfEmail = async (topic: string, recipient: string, desperation: number, lang: 'en' | 'ar'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: "You are an expert student email drafter.",
      },
      contents: [
        {
          role: "user",
          parts: [{ text: `Write an email to ${recipient} about ${topic}. Desperation level: ${desperation}% (0=Formal, 100=Begging). Language: ${lang === 'ar' ? 'Arabic' : 'English'}. Keep it concise.` }]
        }
      ],
    });
    return response.text || "";
  } catch (error) {
    console.error("Email Error:", error);
    return "Error generating email.";
  }
};

// --- CRUSH CALCULATOR ---
export const calculateCrush = async (name1: string, name2: string, lang: 'en' | 'ar'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: { systemInstruction: SYSTEM_INSTRUCTION },
            contents: [{ role: 'user', parts: [{ text: `Calculate a funny love compatibility score between ${name1} and ${name2}. Give a percentage and a sarcastic 1-sentence reason. Output language: ${lang}.` }] }]
        });
        return response.text || "0% - Error";
    } catch (e) { return "Error calculating love."; }
}

// --- OUTFIT RATER ---
export const rateOutfit = async (base64Image: string, lang: 'en' | 'ar'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                { role: 'user', parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                    { text: `Rate this outfit for a Jordanian university student. Be funny and slightly judgmental. Language: ${lang}.` }
                ]}
            ]
        });
        return response.text || "Nice fit!";
    } catch (e) { return "Error analyzing outfit."; }
}

// --- CV BUILDER ---
export const generateFullCV = async (major: string, skills: string, lang: 'en' | 'ar'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: 'user', parts: [{ text: `Create a full structured professional CV (Resume) for a student majoring in ${major}. They claim to have these skills (turn them into professional ones): ${skills}. Include: Profile, Education, Skills, and Fake but realistic Academic Projects. Language: ${lang}. Output plain text formatted nicely.` }] }]
        });
        return response.text || "Error generating CV.";
    } catch (e) { return "Error."; }
}

// Compatibility wrapper for existing component
export const generateCVSummary = generateFullCV;

// --- SCHEDULE ROASTER ---
export const roastSchedule = async (schedule: string, lang: 'en' | 'ar'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: { systemInstruction: SYSTEM_INSTRUCTION },
            contents: [{ role: 'user', parts: [{ text: `Roast this student schedule: ${schedule}. Be mean but funny. Language: ${lang}.` }] }]
        });
        return response.text || "Your schedule is too sad to roast.";
    } catch (e) { return "Error."; }
}

// --- DORM CHEF ---
export const generateDormRecipe = async (ingredients: string, lang: 'en' | 'ar'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: { systemInstruction: SYSTEM_INSTRUCTION },
            contents: [{ role: 'user', parts: [{ text: `Create a 'gourmet' sounding recipe using only these ingredients: ${ingredients}. Give it a fancy name and sarcastic instructions. Language: ${lang}.` }] }]
        });
        return response.text || "Just order Shawerma.";
    } catch (e) { return "Error."; }
}

// --- SMART SUMMARIZER ---
export const summarizeLecture = async (notes: string, lang: 'en' | 'ar'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: 'user', parts: [{ text: `Summarize these messy lecture notes into clean, structured bullet points. Highlight key terms. Language: ${lang}. Notes: ${notes}` }] }]
        });
        return response.text || "Error summarizing.";
    } catch (e) { return "Error."; }
}

// --- EXAM SIMULATOR ---
export const generateMockExam = async (topic: string, difficulty: 'easy'|'medium'|'hard', lang: 'en'|'ar'): Promise<ExamQuestion[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } },
                            answer: { type: Type.STRING }
                        }
                    }
                }
            },
            contents: [{ role: 'user', parts: [{ text: `Generate 3 ${difficulty} multiple choice questions about ${topic} for university students. Language: ${lang}.` }] }]
        });
        return JSON.parse(response.text || "[]");
    } catch (e) { return []; }
}

// --- CONCEPT SIMPLIFIER ---
export const simplifyConcept = async (concept: string, level: number, lang: 'en'|'ar'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: 'user', parts: [{ text: `Explain the concept "${concept}". Complexity level: ${level}/100 (0=Toddler, 100=PhD). Language: ${lang}. Use analogies.` }] }]
        });
        return response.text || "Error.";
    } catch (e) { return "Error."; }
}

// --- DEBATE ARENA ---
export const generateDebateCounterpoint = async (argument: string, lang: 'en'|'ar'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: { systemInstruction: "You are a formidable debate opponent. Challenge arguments logically." },
            contents: [{ role: 'user', parts: [{ text: `Counter this argument: "${argument}". Be sharp and critical. Language: ${lang}.` }] }]
        });
        return response.text || "Error.";
    } catch (e) { return "Error."; }
}

// --- LINKEDIN OPTIMIZER ---
export const optimizeLinkedIn = async (role: string, ambition: string, lang: 'en'|'ar'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: 'user', parts: [{ text: `Write a professional LinkedIn Headline and About Section for a student currently: ${role}, aspiring to be: ${ambition}. Use emojis and strong keywords. Language: ${lang}.` }] }]
        });
        return response.text || "Error.";
    } catch (e) { return "Error."; }
}

// --- CAREER ROADMAP ---
export const generateCareerRoadmap = async (major: string, lang: 'en'|'ar'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: 'user', parts: [{ text: `Create a strategic 4-year career roadmap for a ${major} student. Year 1 to Year 4 + Graduation. Focus on skills, internships, and networking. Language: ${lang}.` }] }]
        });
        return response.text || "Error.";
    } catch (e) { return "Error."; }
}

// --- ROOMMATE CONTRACT ---
export const generateRoommateContract = async (habits: string, lang: 'en'|'ar'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: { systemInstruction: SYSTEM_INSTRUCTION },
            contents: [{ role: 'user', parts: [{ text: `Draft a funny roommate contract addressing these bad habits: ${habits}. Make it sound official but ridiculous. Language: ${lang}.` }] }]
        });
        return response.text || "Error.";
    } catch (e) { return "Error."; }
}

// --- INSTA CAPTIONS ---
export const generateInstaCaption = async (desc: string, lang: 'en'|'ar'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: 'user', parts: [{ text: `Generate 3 Instagram captions for this photo description: "${desc}". Styles: 1. Funny/Sarcastic, 2. Deep/Aesthetic, 3. Short. Language: ${lang}.` }] }]
        });
        return response.text || "Error.";
    } catch (e) { return "Error."; }
}

// --- DREAM INTERPRETER ---
export const interpretDream = async (dream: string, lang: 'en'|'ar'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: { systemInstruction: SYSTEM_INSTRUCTION },
            contents: [{ role: 'user', parts: [{ text: `Interpret this student's dream: "${dream}". Relate it to academic stress or student life humorously. Language: ${lang}.` }] }]
        });
        return response.text || "Error.";
    } catch (e) { return "Error."; }
}

// --- PROJECT GENIE ---
export const generateProjectIdeas = async (major: string, interests: string, lang: 'en'|'ar'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: 'user', parts: [{ text: `Suggest 3 unique graduation project ideas for a ${major} student interested in: ${interests}. Include Title, Brief Description, and Tools needed. Language: ${lang}.` }] }]
        });
        return response.text || "Error.";
    } catch (e) { return "Error."; }
}

// --- COFFEE READER ---
export const analyzeCoffeeCup = async (base64Image: string, lang: 'en' | 'ar'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: { systemInstruction: "You are a mystical fortune teller reading coffee cups." },
            contents: [
                { role: 'user', parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                    { text: `Read this coffee cup fortune. Be mysterious but link it to university luck (exams, love, money). Language: ${lang}.` }
                ]}
            ]
        });
        return response.text || "I see a lot of caffeine in your future.";
    } catch (e) { return "The cup is cloudy..."; }
}