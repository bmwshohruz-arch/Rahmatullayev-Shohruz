
import { GoogleGenAI } from "@google/genai";
import { PortfolioData } from "../types";

export const getAIResponse = async (userMessage: string, portfolioData: PortfolioData) => {
  // Use strictly process.env.API_KEY as per guidelines. 
  // Do not use window fallbacks or external configuration.
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error("API_KEY topilmadi.");
    return "Kechirasiz, AI yordamchi hozirda o'chirilgan (API kaliti sozlanmagan).";
  }

  try {
    // Initialize GoogleGenAI with the mandatory named parameter { apiKey }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const { userInfo, skills } = portfolioData;

    const systemInstruction = `
Siz ${userInfo.name}ning virtual yordamchisiz. 
Ma'lumotlar: Mutaxassislik - ${userInfo.title}, Bio - ${userInfo.bio}, Ko'nikmalar - ${skills.map(s => s.name).join(", ")}.
Faqat berilgan ma'lumotlar asosida, do'stona va o'zbek tilida javob bering.
`;

    // Always use ai.models.generateContent to query GenAI.
    // Ensure the content structure follows the recommended parts format.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: userMessage }] },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    // Directly access the .text property of the GenerateContentResponse object.
    return response.text || "Javob olishda muammo bo'ldi.";
  } catch (error) {
    console.error("AI Error:", error);
    return "AI xizmatida xatolik yuz berdi.";
  }
};
