
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, SurvivalTip, ExamQuestion } from "../types";

// UPDATED: Use process.env.API_KEY exclusively as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction to ensure Jordanian context
const SYSTEM_INSTRUCTION = `You are a hilarious, sarcastic Jordanian university student bot. 
You know everything about student life at UJ, JUST, Yarmouk, etc. 
You use slang like 'Ya Zame', 'Kharafi', 'Taysh'. 
You reference Mansaf, traffic circles, buses (Coaster), coffee, and exams.
Always provide content in both English and Arabic (Jordanian dialect).`;

export const generateQuizQuestions = async (): Promise<QuizQuestion[]> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key provided.");
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
  if (!process.env.API_KEY) return null;

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
    if(!process.env.API_KEY) return null;
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
      const prompt = `
        A funny, expressive meme template image about: ${topic}.
        Context: Funny relatable situation.
        Style: Photorealistic or exaggerated cartoon style typical of memes.
        CRITICAL: Do NOT generate any text inside the image. The image should be clean so I can add text over it later.
      `;
  
      const response = await ai.models.generateContent({
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
    const enhancedPrompt = `
      Create a funny, simple cartoon sketch or sticker.
      Context: Jordanian University student life.
      Subject: ${prompt}
      Style: Hand-drawn, colorful, expressive, sticker-like.
      CRITICAL INSTRUCTION: Do NOT generate any text, letters, or words inside the image. 
      The image must be purely visual. If the prompt implies text (e.g., 'a sign'), draw the object blank without writing on it.
    `;

    const response = await ai.models.generateContent({
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
        return response.text || "Could not explain.";
    } catch (e) {
        return "Error.";
    }
};

export const generateDebateCounterpoint = async (topic: string, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "Error";
    
    const langInstr = contentLang === 'ar' ? "Arabic" : "English";

    const prompt = `
        You are a master debater and critical thinker.
        User's Argument: "${topic}".
        Task: Provide a strong, logical counter-argument to challenge this view.
        Tone: Intellectual, respectful, but challenging (Devil's Advocate).
        Language: ${langInstr}.
        Keep it to 2-3 paragraphs.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "I agree with you (Error).";
    } catch (e) {
        return "Thinking error.";
    }
};

export const optimizeLinkedIn = async (role: string, ambition: string, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "Error";
    
    const langInstr = contentLang === 'ar' ? "Arabic (Business Professional)" : "English (Business Professional)";

    const prompt = `
        Act as a LinkedIn Profile Expert.
        Current Role: ${role}
        Ambition: ${ambition}
        
        Generate:
        1. A catchy **Headline** (Use emojis and vertical bars |).
        2. A compelling **About Section** (Summary) that connects the current role to the ambition using keywords.
        
        Language: ${langInstr}.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "Profile optimization failed.";
    } catch (e) {
        return "Error.";
    }
};

export const generateCareerRoadmap = async (major: string, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "Error";
    
    const langInstr = contentLang === 'ar' ? "Arabic (Strategic)" : "English (Strategic)";

    const prompt = `
        Create a 4-year strategic career roadmap for a ${major} student.
        Focus on employability and high-value skills.
        Structure:
        - Year 1: Foundations & Exploration
        - Year 2: Skill Building & Internships
        - Year 3: Advanced Projects & Networking
        - Year 4: Job Hunting & Specialization
        
        Language: ${langInstr}.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "Roadmap generation failed.";
    } catch (e) {
        return "Error.";
    }
};

export const generateRoommateContract = async (habits: string, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "Error";
    const langInstr = contentLang === 'ar' ? "Arabic (Legal but Funny)" : "English (Legal but Funny)";
    const prompt = `
        Draft a "Roommate Agreement" based on these bad habits: "${habits}".
        Tone: Pseudo-legal, funny, strict but fair.
        Include "Articles" for Cleaning, Noise, Guests, and Food.
        Language: ${langInstr}.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "Contract void.";
    } catch (e) {
        return "Error.";
    }
};

export const generateInstaCaption = async (desc: string, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "Error";
    const langInstr = contentLang === 'ar' ? "Arabic (Gulf/Levant mix, Trendy)" : "English (Gen Z/Aesthetic)";
    const prompt = `
        Generate 3 Instagram captions for a photo about: "${desc}".
        Styles:
        1. Short & Aesthetic
        2. Funny/Relatable
        3. Quote/Deep
        Add hashtags.
        Language: ${langInstr}.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "No captions found.";
    } catch (e) {
        return "Error.";
    }
};

export const interpretDream = async (dream: string, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "Error";
    const langInstr = contentLang === 'ar' ? "Arabic (Mystical but Student Context)" : "English (Mystical but Student Context)";
    const prompt = `
        Interpret this university student's dream: "${dream}".
        Relate it to exam stress, fear of failure, or social anxiety.
        Give a "Prophecy".
        Language: ${langInstr}.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "Dream unclear.";
    } catch (e) {
        return "Error.";
    }
};

export const analyzeCoffeeCup = async (imageBase64: string, contentLang: 'en' | 'ar'): Promise<string> => {
    if (!process.env.API_KEY) return "Error: No API Key";
    
    const langInstr = contentLang === 'ar' ? "Jordanian Arabic" : "English";
    const prompt = `
        Act as a fortune teller reading coffee grounds.
        Analyze the patterns in this coffee cup image.
        Provide a short, mystical, and slightly funny fortune.
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
        return response.text || "The future is cloudy.";
    } catch (e) {
        console.error(e);
        return "Could not read fortune.";
    }
};
