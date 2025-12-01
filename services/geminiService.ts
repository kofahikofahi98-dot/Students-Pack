

import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, SurvivalTip, ExamQuestion } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// System instruction to ensure Jordanian context
const SYSTEM_INSTRUCTION = `You are a hilarious, sarcastic Jordanian university student bot. 
You know everything about student life at UJ, JUST, Yarmouk, etc. 
You use slang like 'Ya Zame', 'Kharafi', 'Taysh'. 
You reference Mansaf, traffic circles, buses (Coaster), coffee, and exams.
Always provide content in both English and Arabic (Jordanian dialect).`;

export const generateQuizQuestions = async (): Promise<QuizQuestion[]> => {
  if (!apiKey) {
    console.warn("No API Key provided, returning mock data simulation.");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate 5 funny personality quiz questions to determine what kind of Jordanian university student someone is (e.g. The Nerd, The Skipper, The Socialite).",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
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
                    score: { type: Type.INTEGER, description: "1 for Nerd, 2 for Socialite, 3 for Reckless" }
                  }
                }
              }
            }
          }
        }
      }
    });
    
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

export const generateSurvivalTip = async (): Promise<SurvivalTip | null> => {
  if (!apiKey) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Give me one funny, sarcastic 'Survival Tip' for a Jordanian university student.",
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
            category: { type: Type.STRING, enum: ['exam', 'food', 'social', 'money'] }
          }
        }
      }
    });

    return JSON.parse(response.text || "null");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const generateMemeCaption = async (topic?: string): Promise<{ topEn: string, bottomEn: string, topAr: string, bottomAr: string } | null> => {
    if(!apiKey) return null;
    try {
        const userTopic = topic ? topic : "failing midterms or being broke in Amman";
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a funny meme caption text (top text and bottom text) about: ${userTopic}. keep it short and punchy.`,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        topEn: { type: Type.STRING },
                        bottomEn: { type: Type.STRING },
                        topAr: { type: Type.STRING },
                        bottomAr: { type: Type.STRING }
                    }
                }
            }
        });
        return JSON.parse(response.text || "null");
    } catch (e) {
        return null;
    }
}

export const generateMemeImage = async (topic: string): Promise<string | null> => {
    if (!process.env.API_KEY) return null;
    try {
      const aiWithKey = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        A funny, expressive meme template image about: ${topic}.
        Context: Funny relatable situation.
        Style: Photorealistic or exaggerated cartoon style typical of memes.
        CRITICAL: Do NOT generate any text inside the image. The image should be clean so I can add text over it later.
      `;
  
      const response = await aiWithKey.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: prompt },
          ],
        },
        config: {
          imageConfig: {
              aspectRatio: "1:1"
          }
        },
      });
  
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Meme Image Generation Error:", error);
      return null;
    }
};

export const generateStudentSketch = async (prompt: string): Promise<string | null> => {
  if (!process.env.API_KEY) return null;
  try {
    const aiWithKey = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Explicitly instructing the model to avoid text to prevent Arabic rendering issues
    const enhancedPrompt = `
      Create a funny, simple cartoon sketch or sticker.
      Context: Jordanian University student life.
      Subject: ${prompt}
      Style: Hand-drawn, colorful, expressive, sticker-like.
      CRITICAL INSTRUCTION: Do NOT generate any text, letters, or words inside the image. 
      The image must be purely visual. If the prompt implies text (e.g., 'a sign'), draw the object blank without writing on it.
    `;

    const response = await aiWithKey.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: enhancedPrompt },
        ],
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1"
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Sketch Generation Error:", error);
    return null;
  }
};

export const generateProfEmail = async (topic: string, recipient: string, desperationLevel: number, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "Error: No API Key";
    
    const toneDescription = desperationLevel > 50 
        ? "Extremely desperate, pleading, slightly dramatic, mentioning difficult circumstances but polite." 
        : "Professional, formal, respectful, standard university student tone.";
    
    const languageInstruction = contentLang === 'ar' ? "Arabic (Formal but natural for a Jordanian student)" : "English (Professional)";

    const prompt = `
        Write an email to Professor ${recipient} regarding: ${topic}.
        Tone: ${toneDescription}
        Language: ${languageInstruction}
        Structure: Subject line, Salutation, Body, Closing.
        Keep it concise.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "Error generating email.";
    } catch (e) {
        return "Sorry, the AI is taking a coffee break. Try again.";
    }
}

export const generateProjectIdeas = async (major: string, interests: string, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "System Error";

    const langInstr = contentLang === 'ar' ? "Arabic (Academic but clear)" : "English (Academic)";

    const prompt = `
        Act as a Senior University Project Advisor.
        Student Major: ${major}
        Interests: ${interests}
        
        Generate 3 unique, impressive Graduation Project (Capstone) ideas.
        For each idea, provide:
        1. Title (Catchy & Professional)
        2. Brief Description (What problem does it solve?)
        3. Suggested Tech Stack / Tools
        
        Language: ${langInstr}.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "Could not generate ideas.";
    } catch (e) {
        console.error(e);
        return "The Genie is brainstorming... try again.";
    }
}

export const calculateCrush = async (name1: string, name2: string, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "Error";
    const langInstr = contentLang === 'ar' ? "Jordanian Arabic" : "English (Sarcastic)";
    const prompt = `
        Act as a funny Jordanian 'Matchmaker' or 'Khattabeh'.
        Analyze the names ${name1} and ${name2}.
        Give a random compatibility percentage (0-100%).
        Write a funny, sarcastic comment about why they work or fail.
        Mention things like 'differences in major', 'one lives in Irbid one in Amman', 'family issues'.
        Keep it short (2 sentences max).
        Language: ${langInstr}.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "الذكاء مش عارف يقرر.";
    } catch (e) {
        return "جرب مرة ثانية";
    }
}

export const rateOutfit = async (imageBase64: string, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "Error";
    const langInstr = contentLang === 'ar' ? "Jordanian Arabic" : "English";
    const prompt = `
        Analyze this outfit for a Jordanian university student.
        Give a score out of 10.
        Roast it or Compliment it sarcastically.
        Mention if it looks like they are going to a wedding, the gym, or actually studying.
        Keep it short.
        Language: ${langInstr}.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
                    { text: prompt }
                ]
            }
        });
        return response.text || "مش واضح، غير الإضاءة.";
    } catch (e) {
        return "الكاميرا خربانة شكلو.";
    }
}

export const generateCVSummary = async (major: string, skills: string, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "Error";
    const langInstr = contentLang === 'ar' ? "Arabic (Jordanian Professional Standard)" : "English (Professional Corporate Standard)";
    const prompt = `
        Act as an Expert Resume Writer and Career Coach for a fresh Jordanian university graduate.
        User's Major: ${major}.
        User's Actual (Casual) Skills: ${skills}.

        Task: Create a **FULL Professional CV** content (not just a summary).
        Translate the user's "lazy" or simple skills into powerful, high-end corporate terminology (e.g., "Good at arguing" -> "Negotiation & Conflict Resolution").

        Structure the CV clearly as follows:
        1. **Professional Profile**: A strong, ambitious 3-line summary tailored to the major.
        2. **Education**: ${major} (Bachelor's Degree). Add a generic placeholder for University Name and Graduation Year.
        3. **Core Competencies**: List 5-7 professional hard and soft skills derived from the user's input, sounded very impressive.
        4. **Academic Projects / Experience**: Invent 2 realistic, impressive-sounding academic projects or entry-level roles related to the major. Describe them with bullet points using action verbs.
        5. **Languages**: Arabic (Native), English (Professional Working Proficiency).

        Tone: Extremely professional, polished, high-end.
        Language: ${langInstr}.
        Format: Clean text with headings, bullet points, and spacing.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "Error generating CV.";
    } catch (e) {
        return "AI is on a lunch break.";
    }
}

export const roastSchedule = async (schedule: string, contentLang: 'en' | 'ar'): Promise<string> => {
  if (!process.env.API_KEY) return "Error";
  const langInstr = contentLang === 'ar' ? "Jordanian Arabic" : "English (Sarcastic)";
  const prompt = `
    Act as a grumpy senior Jordanian student who has seen it all.
    Analyze this university schedule description: "${schedule}".
    Roast it mercilessly.
    Point out: 
    - 8 AM classes (cruel).
    - Long gaps (Borj 3a'da).
    - Late classes (Thursday 5 PM).
    - No lunch breaks.
    Keep it funny and sarcastic.
    Language: ${langInstr}.
  `;
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    return response.text || "جدولك بخزي لدرجة إني مش عارف شو أحكي.";
  } catch (e) {
    return "الجدول سيء لدرجة إنه علّق النظام.";
  }
}

export const generateDormRecipe = async (ingredients: string, contentLang: 'en' | 'ar'): Promise<string> => {
  if (!process.env.API_KEY) return "Error";
  const langInstr = contentLang === 'ar' ? "Arabic (Sarcastic)" : "English (Sarcastic Fancy)";
  const prompt = `
    Act as a fancy chef (like Gordon Ramsay) but for broke Jordanian students in a dorm.
    The user has these random ingredients: "${ingredients}".
    Create a "Gourmet" dish name and description for these items.
    Example: Indomie + Yogurt -> "Pasta a la Laban with Oriental Spices".
    Make it sound expensive but acknowledge it's poverty food.
    Language: ${langInstr}.
  `;
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    return response.text || "اخلطهم وكل وانت ساكت.";
  } catch (e) {
    return "المطبخ مغلق.";
  }
}

// ---------------- NERD CORNER SERVICES ----------------

export const summarizeLecture = async (text: string, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "Error";
    const langInstr = contentLang === 'ar' ? "Arabic (Academic but easy)" : "English (Academic)";
    const prompt = `
        You are an 'A' Student (Da7ee7). 
        Summarize the following lecture notes/text into a clean, structured study guide.
        - Use bullet points.
        - Highlight 3-5 'Key Terms' at the beginning.
        - Keep the tone helpful but smart.
        - Language: ${langInstr}.
        
        Text to summarize: "${text}"
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "فش اشي يتلخص.";
    } catch (e) {
        return "المخ ضرب، جرب كمان مرة.";
    }
}

export const generateMockExam = async (topic: string, difficulty: 'easy' | 'medium' | 'hard', contentLang: 'en' | 'ar'): Promise<ExamQuestion[]> => {
    if (!process.env.API_KEY) return [];
    
    let difficultyDesc = "Medium difficulty";
    if (difficulty === 'easy') difficultyDesc = "Easy, straightforward questions";
    if (difficulty === 'hard') difficultyDesc = "Extremely difficult, tricky questions for top students";

    const langInstr = contentLang === 'ar' ? "Arabic" : "English";

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
                Generate 3 multiple-choice questions about: ${topic}.
                Difficulty: ${difficultyDesc}.
                Context: University level exam.
                Language: ${langInstr}.
            `,
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
            }
        });
        return JSON.parse(response.text || "[]");
    } catch (e) {
        console.error(e);
        return [];
    }
}

// ---------------- ELITE ZONE SERVICES ----------------

export const simplifyConcept = async (concept: string, level: number, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "Error";
    
    let targetAudience = "University Student";
    if (level <= 33) targetAudience = "5 year old child (very simple, use analogies)";
    else if (level >= 67) targetAudience = "PhD Expert (Technical, precise, academic)";

    const langInstr = contentLang === 'ar' ? "Arabic (Clear and Educational)" : "English (Clear and Educational)";

    const prompt = `
        Explain the concept: "${concept}".
        Target Audience: ${targetAudience}.
        Language: ${langInstr}.
        Goal: Make the user truly understand the core idea.
        Structure: 
        1. One sentence definition.
        2. A real-world analogy/example.
        3. Why it matters.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "المفهوم معقد جداً حتى علي.";
    } catch (e) {
        return "حدث خطأ في التبسيط.";
    }
}

export const generateDebateCounterpoint = async (topic: string, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "Error";
    const langInstr = contentLang === 'ar' ? "Arabic" : "English";

    const prompt = `
        The user believes: "${topic}".
        Act as a highly intelligent Debater.
        Provide a strong, logical counter-argument to challenge their view.
        Point out potential flaws, logical fallacies, or alternative perspectives.
        Tone: Intellectual, challenging, but respectful.
        Language: ${langInstr}.
        Keep it concise (100 words max).
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "لا يوجد رد حالياً.";
    } catch (e) {
        return "الذكاء في استراحة.";
    }
}

// ---------------- EXECUTIVE SUITE SERVICES ----------------

export const optimizeLinkedIn = async (role: string, ambition: string, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "Error";
    const langInstr = contentLang === 'ar' ? "Arabic (Professional)" : "English (Professional)";
    const prompt = `
        Act as a high-end Career Consultant for university students.
        User's Current Role/Major: ${role}
        User's Ambition/Dream Job: ${ambition}
        
        Generate a "Diamond Standard" LinkedIn Profile section in ${langInstr}.
        Include:
        1. A powerful, catchy Headline (max 20 words).
        2. A professional, engaging About Summary (max 100 words).
        
        Tone: Corporate, ambitious, professional, polished.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "Profile optimization failed.";
    } catch (e) {
        return "Consultant unavailable.";
    }
}

export const generateCareerRoadmap = async (major: string, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "Error";
    const langInstr = contentLang === 'ar' ? "Arabic (Professional & Motivational)" : "English (Professional & Motivational)";
    const prompt = `
        Create a high-value "Executive Career Roadmap" for a university student majoring in: ${major}.
        Structure it year by year (Year 1 to Year 4).
        Focus on:
        - High-impact certifications to get.
        - Type of internships to aim for.
        - Soft skills to master.
        - Strategic networking moves.
        
        Tone: Strategic, high-performance, mentorship.
        Language: ${langInstr}.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "Roadmap generation failed.";
    } catch (e) {
        return "Strategy team is busy.";
    }
}

// ---------------- NEW PREMIUM SERVICES ----------------

export const generateRoommateContract = async (badHabits: string, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "Error";
    const langInstr = contentLang === 'ar' ? "Arabic (Jordanian, Funny but official looking)" : "English (Funny but official)";
    const prompt = `
        Create a "Roommate Agreement Contract" for university students living in a dorm.
        The user complains about these bad habits: "${badHabits}".
        Generate 5 funny but firm rules to address these habits.
        Format it like a legal contract with "Article 1", "Article 2".
        Tone: Sarcastic, funny, but useful.
        Language: ${langInstr}.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "Contract generation failed.";
    } catch (e) {
        return "Lawyer is asleep.";
    }
}

export const generateInstaCaption = async (photoDesc: string, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "Error";
    const langInstr = contentLang === 'ar' ? "Arabic (Jordanian slang + Aesthetic)" : "English (Aesthetic + Funny)";
    const prompt = `
        Generate 3 Instagram captions for a photo described as: "${photoDesc}".
        Context: University student life.
        Styles:
        1. Funny/Sarcastic
        2. Deep/Inspirational (Cringe)
        3. Short/Cool
        Language: ${langInstr}.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "Caption machine broken.";
    } catch (e) {
        return "No captions today.";
    }
}

export const interpretDream = async (dream: string, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "Error";
    const langInstr = contentLang === 'ar' ? "Arabic (Mystical yet student-focused)" : "English (Mystical student focus)";
    const prompt = `
        Interpret this student's dream: "${dream}".
        Relate the interpretation to university anxiety, grades, professors, or social life.
        Be funny and slightly dramatic.
        Language: ${langInstr}.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "Dream is too weird.";
    } catch (e) {
        return "Interpreter is sleeping.";
    }
}

export const analyzeCoffeeCup = async (imageBase64: string, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "Error";
    const langInstr = contentLang === 'ar' ? "Jordanian Arabic (Fortune Teller)" : "English (Mystical)";
    const prompt = `
        Act as a fortune teller reading a coffee cup.
        Analyze the image provided.
        Predict the user's future regarding academic success and social life.
        Be funny and slightly dramatic.
        Language: ${langInstr}.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
                    { text: prompt }
                ]
            }
        });
        return response.text || "Cannot read fortune.";
    } catch (e) {
        return "The cup is too cloudy.";
    }
}
