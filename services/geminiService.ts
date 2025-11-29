
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, SurvivalTip } from "../types";

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

export const generateProfEmail = async (topic: string, recipient: string, desperationLevel: number): Promise<string> => {
    if (!process.env.API_KEY) return "Error: No API Key";
    
    const toneDescription = desperationLevel > 50 
        ? "Extremely desperate, pleading, slightly dramatic, mentioning difficult circumstances but polite." 
        : "Professional, formal, respectful, standard university student tone.";
    
    const languageInstruction = "Write the email in Arabic (Formal but natural for a Jordanian student).";

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
