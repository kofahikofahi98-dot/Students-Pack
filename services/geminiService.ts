
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, SurvivalTip, ExamQuestion } from "../types";

// API Key Configuration
// We use import.meta.env.VITE_API_KEY for Vite-based projects.
// A fallback key is provided to ensure the app works immediately for testing/demo purposes.
const API_KEY = (import.meta as any).env?.VITE_API_KEY || "AIzaSyBxqRizwduxDlEIGDhY5KsmsfhHiH2vhqA";

const ai = new GoogleGenAI({ apiKey: API_KEY });

// System instruction: The "Brain" of the student
// STRICT INSTRUCTION: No AI robotic talk. Pure Jordanian Student vibes.
const SYSTEM_INSTRUCTION = `
You are NOT an AI. You are 'Hamadeh', a funny, sarcastic, 5th-year senior student at a Jordanian university (like JU, JUST, or Yarmouk).
- You speak in a mix of English and Jordanian Arabic (Ammani/Falla7i mix).
- You use slang like: 'Ya Zame', 'Kharafi', 'Taysh', 'Haram', 'Dawweer', 'Skoct', 'Inshallah', 'Habibi'.
- You hate 8 AM classes, love Mansaf, and live on coffee.
- CRITICAL: Never start with "Here is..." or "Sure!". Just say the answer directly.
- Be savage but funny. Roast friendly.
`;

// Safety Settings - BLOCK_NONE to allow jokes and roasts
const SAFETY_SETTINGS: any = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
];

export const generateQuizQuestions = async (): Promise<QuizQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate 5 hilarious, culturally accurate personality quiz questions for Jordanian students. Focus on: Transportation, Cafeteria food, Exams, and Professors.",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        safetySettings: SAFETY_SETTINGS,
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
                    score: { type: Type.INTEGER, description: "1 for Nerd/Da7ee7, 2 for Social/Mukhtar, 3 for Taysh/Reckless" }
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
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Give me one short, savage 'Survival Tip' for university. Real street smarts only.",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        safetySettings: SAFETY_SETTINGS,
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
    try {
        const userTopic = topic ? topic : "being broke or failing exams";
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a savage meme caption (Top Text & Bottom Text) about: ${userTopic}. It must be relatable to Jordanian students. Short and punchy.`,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                safetySettings: SAFETY_SETTINGS,
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
    try {
      const prompt = `
        A funny, expressive cartoon/meme image about: ${topic}.
        Style: Exaggerated facial expressions, colorful, 2D vector art style.
        Background: Simple or solid color.
        NO TEXT in the image.
      `;
  
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: prompt },
          ],
        },
        config: {
          safetySettings: SAFETY_SETTINGS,
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
  try {
    // FIX: Optimized prompt for better "Student Sketch" results
    const enhancedPrompt = `
      Draw a funny, hand-drawn doodle style sketch about: ${prompt}.
      Style: Marker on white paper, cartoonish, thick lines, messy but cute.
      Like a doodle a student draws in their notebook during a boring lecture.
      NO TEXT inside the drawing. White background.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: enhancedPrompt },
        ],
      },
      config: {
        safetySettings: SAFETY_SETTINGS,
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
    
    const toneDescription = desperationLevel > 50 
        ? "Extremely dramatic, begging, using phrases like 'my future depends on this', 'I will clean your office', but technically polite." 
        : "Standard student email, but slightly lazy.";
    
    const langInstr = contentLang === 'ar' ? "Arabic (Student Dialect mixed with fake formal)" : "English (Student style)";

    const prompt = `
        Write an email to ${recipient} about: ${topic}.
        Tone: ${toneDescription}
        Language: ${langInstr}.
        Do NOT write "Subject:" or placeholders. Just the email body.
        Make it sound like a real student wrote it (maybe one typo).
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                safetySettings: SAFETY_SETTINGS,
            }
        });
        return response.text || "Error generating email.";
    } catch (e) {
        return "Sorry, the AI is taking a coffee break. Try again.";
    }
}

export const generateProjectIdeas = async (major: string, interests: string, contentLang: 'en' | 'ar'): Promise<string> => {

    const langInstr = contentLang === 'ar' ? "Arabic (Academic but practical)" : "English (Academic)";

    const prompt = `
        Act as a Project Advisor.
        Major: ${major}. Interests: ${interests}.
        Give 3 solid Graduation Project ideas.
        Format:
        1. Title
        2. What is it? (1 sentence)
        3. Tech needed.
        
        Language: ${langInstr}.
        Make them sound smart enough to get approved but easy enough to finish in 3 months.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION, // Use the smart persona
                safetySettings: SAFETY_SETTINGS,
            }
        });
        return response.text || "Could not generate ideas.";
    } catch (e) {
        return "The Genie is brainstorming... try again.";
    }
}

export const calculateCrush = async (name1: string, name2: string, contentLang: 'en' | 'ar'): Promise<string> => {
    const langInstr = contentLang === 'ar' ? "Jordanian Arabic (Sarcastic)" : "English (Sarcastic)";
    const prompt = `
        You are a matchmaker (Khattabeh).
        Names: ${name1} + ${name2}.
        Give a random % score.
        Then give a ONE sentence roast about why it will fail or succeed.
        Mention specific Jordanian things (Same bus route, dad is rich, supports Wihdat/Faisaly).
        Language: ${langInstr}.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                safetySettings: SAFETY_SETTINGS,
            }
        });
        return response.text || "الذكاء مش عارف يقرر.";
    } catch (e) {
        return "جرب مرة ثانية";
    }
}

export const rateOutfit = async (imageBase64: string, contentLang: 'en' | 'ar'): Promise<string> => {
    const langInstr = contentLang === 'ar' ? "Jordanian Arabic (Funny)" : "English (Funny)";
    const prompt = `
        Look at this outfit.
        Rate it /10.
        Roast it like a best friend.
        Is it "Engineering style" (Bad)? "Business style" (Fancy)?
        Be savage but funny.
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
            },
            config: {
                safetySettings: SAFETY_SETTINGS,
            }
        });
        return response.text || "مش واضح، غير الإضاءة.";
    } catch (e) {
        return "الكاميرا خربانة شكلو.";
    }
}

export const generateCVSummary = async (major: string, skills: string, contentLang: 'en' | 'ar'): Promise<string> => {
    const langInstr = contentLang === 'ar' ? "Arabic (Fancy Corporate)" : "English (Fancy Corporate)";
    const prompt = `
        Take these student skills: "${skills}" and Major: "${major}".
        Rewrite them into a CEO-level CV summary.
        Exaggerate everything.
        "Sleeping" -> "Time Management & Restoration Expert".
        "Argue" -> "High-stakes Negotiation".
        Language: ${langInstr}.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                safetySettings: SAFETY_SETTINGS,
            }
        });
        return response.text || "Error generating CV.";
    } catch (e) {
        return "AI is on a lunch break.";
    }
}

export const roastSchedule = async (schedule: string, contentLang: 'en' | 'ar'): Promise<string> => {
  const langInstr = contentLang === 'ar' ? "Jordanian Arabic (Savage)" : "English (Savage)";
  const prompt = `
    Roast this university schedule: "${schedule}".
    Be mean. Talk about the gaps (Borj), the early classes, the heat, the walking.
    Make the user regret registering.
    Language: ${langInstr}.
  `;
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            safetySettings: SAFETY_SETTINGS,
        }
    });
    return response.text || "جدولك بخزي لدرجة إني مش عارف شو أحكي.";
  } catch (e) {
    return "الجدول سيء لدرجة إنه علّق النظام.";
  }
}

export const generateDormRecipe = async (ingredients: string, contentLang: 'en' | 'ar'): Promise<string> => {
  const langInstr = contentLang === 'ar' ? "Arabic (Chef)" : "English (Chef)";
  const prompt = `
    Ingredients: "${ingredients}".
    Create a "Gourmet" meal name and description.
    Make it sound like a 5-star restaurant dish, but admit it's trash at the end.
    Language: ${langInstr}.
  `;
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            safetySettings: SAFETY_SETTINGS,
        }
    });
    return response.text || "اخلطهم وكل وانت ساكت.";
  } catch (e) {
    return "المطبخ مغلق.";
  }
}

// ---------------- NERD CORNER SERVICES ----------------

export const summarizeLecture = async (text: string, contentLang: 'en' | 'ar'): Promise<string> => {
    const langInstr = contentLang === 'ar' ? "Arabic" : "English";
    const prompt = `
        Summarize this lecture notes simply.
        Bullet points.
        Key definitions.
        No fluff.
        Language: ${langInstr}.
        Text: "${text}"
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                safetySettings: SAFETY_SETTINGS,
            }
        });
        return response.text || "فش اشي يتلخص.";
    } catch (e) {
        return "المخ ضرب، جرب كمان مرة.";
    }
}

export const generateMockExam = async (topic: string, difficulty: 'easy' | 'medium' | 'hard', contentLang: 'en' | 'ar'): Promise<ExamQuestion[]> => {
    const langInstr = contentLang === 'ar' ? "Arabic" : "English";
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
                Create 3 multiple choice questions about: ${topic}.
                Difficulty: ${difficulty}.
                Language: ${langInstr}.
                JSON format only.
            `,
            config: {
                safetySettings: SAFETY_SETTINGS,
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
        return [];
    }
}

// ---------------- ELITE ZONE SERVICES ----------------

export const simplifyConcept = async (concept: string, level: number, contentLang: 'en' | 'ar'): Promise<string> => {
    const langInstr = contentLang === 'ar' ? "Arabic" : "English";
    let target = level < 33 ? "a toddler" : level > 66 ? "a PhD student" : "a normal student";

    const prompt = `
        Explain "${concept}" to ${target}.
        Use an analogy.
        Keep it clear.
        Language: ${langInstr}.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                safetySettings: SAFETY_SETTINGS,
            }
        });
        return response.text || "Could not explain.";
    } catch (e) {
        return "Error.";
    }
};

export const generateDebateCounterpoint = async (topic: string, contentLang: 'en' | 'ar'): Promise<string> => {
    const langInstr = contentLang === 'ar' ? "Arabic" : "English";
    const prompt = `
        Argument: "${topic}".
        Destroy this argument logically. Play Devil's Advocate.
        Be smart, factual, and persuasive.
        Language: ${langInstr}.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                safetySettings: SAFETY_SETTINGS,
            }
        });
        return response.text || "I agree with you (Error).";
    } catch (e) {
        return "Thinking error.";
    }
};

export const optimizeLinkedIn = async (role: string, ambition: string, contentLang: 'en' | 'ar'): Promise<string> => {
    const langInstr = contentLang === 'ar' ? "Arabic" : "English";
    const prompt = `
        Role: ${role}. Ambition: ${ambition}.
        Write a LinkedIn Headline (punchy, use | ) and a Summary (2 paragraphs).
        Make them sound like a Top 1% Talent.
        Language: ${langInstr}.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                safetySettings: SAFETY_SETTINGS,
            }
        });
        return response.text || "Profile optimization failed.";
    } catch (e) {
        return "Error.";
    }
};

export const generateCareerRoadmap = async (major: string, contentLang: 'en' | 'ar'): Promise<string> => {
    const langInstr = contentLang === 'ar' ? "Arabic" : "English";
    const prompt = `
        Major: ${major}.
        Give me a 4-year strategic plan to dominate this field.
        Focus on money and high status.
        Language: ${langInstr}.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                safetySettings: SAFETY_SETTINGS,
            }
        });
        return response.text || "Roadmap generation failed.";
    } catch (e) {
        return "Error.";
    }
};

export const generateRoommateContract = async (habits: string, contentLang: 'en' | 'ar'): Promise<string> => {
    const langInstr = contentLang === 'ar' ? "Arabic (Funny Legal)" : "English (Funny Legal)";
    const prompt = `
        Bad Habits: "${habits}".
        Write a strict Roommate Agreement.
        Use "Article 1", "Article 2".
        Punishments for breaking rules should be funny (e.g. buying dinner).
        Language: ${langInstr}.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                safetySettings: SAFETY_SETTINGS,
            }
        });
        return response.text || "Contract void.";
    } catch (e) {
        return "Error.";
    }
};

export const generateInstaCaption = async (desc: string, contentLang: 'en' | 'ar'): Promise<string> => {
    const langInstr = contentLang === 'ar' ? "Arabic (Trendy)" : "English (Trendy)";
    const prompt = `
        Photo: "${desc}".
        Give 3 captions: 
        1. Deep/Cringe
        2. Funny/Short
        3. One word + Emoji
        Language: ${langInstr}.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                safetySettings: SAFETY_SETTINGS,
            }
        });
        return response.text || "No captions found.";
    } catch (e) {
        return "Error.";
    }
};

export const interpretDream = async (dream: string, contentLang: 'en' | 'ar'): Promise<string> => {
    const langInstr = contentLang === 'ar' ? "Arabic (Mystical)" : "English (Mystical)";
    const prompt = `
        Dream: "${dream}".
        Interpret it. Relate it to GPA or exams.
        Give a funny prophecy.
        Language: ${langInstr}.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                safetySettings: SAFETY_SETTINGS,
            }
        });
        return response.text || "Dream unclear.";
    } catch (e) {
        return "Error.";
    }
};

export const analyzeCoffeeCup = async (imageBase64: string, contentLang: 'en' | 'ar'): Promise<string> => {
    const langInstr = contentLang === 'ar' ? "Jordanian Arabic (Old Woman style)" : "English (Mystical)";
    const prompt = `
        Read this coffee cup.
        Be dramatic. Mention a "trip", a "letter", or a "tall dark stranger".
        Mention an exam or money.
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
            },
            config: {
                safetySettings: SAFETY_SETTINGS,
            }
        });
        return response.text || "The future is cloudy.";
    } catch (e) {
        console.error(e);
        return "Could not read fortune.";
    }
};
