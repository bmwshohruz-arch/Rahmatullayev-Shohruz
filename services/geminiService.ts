
import { GoogleGenAI } from "@google/genai";
import { PortfolioData } from "../types";

export const getAIResponse = async (userMessage: string, portfolioData: PortfolioData) => {
  // Brauzerda process.env xatoligini xavfsiz tekshirish
  const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;
  
  if (!apiKey) {
    console.warn("Gemini API_KEY topilmadi. Iltimos, Vercel Environment Variables-ni tekshiring.");
    return "Kechirasiz, AI yordamchi hozirda o'chirilgan (API kaliti sozlanmagan).";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const { userInfo, skills } = portfolioData;

    const systemInstruction = `
Siz ${userInfo.name}ning virtual yordamchisiz. 
Ma'lumotlar: Mutaxassislik - ${userInfo.title}, Bio - ${userInfo.bio}, Ko'nikmalar - ${skills.map(s => s.name).join(", ")}.
Faqat berilgan ma'lumotlar asosida, do'stona va o'zbek tilida javob bering.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: userMessage }] },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Javob olishda muammo bo'ldi.";
  } catch (error) {
    console.error("AI Error:", error);
    return "AI xizmatida xatolik yuz berdi.";
  }
};
