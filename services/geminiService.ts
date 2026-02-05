
import { GoogleGenAI } from "@google/genai";
import { PortfolioData } from "../types";

export const getAIResponse = async (userMessage: string, portfolioData: PortfolioData) => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error("API_KEY topilmadi. Vercel sozlamalarini tekshiring.");
    return "Tizimda API kaliti sozlanmagan. Iltimos, administratorga murojaat qiling.";
  }

  const ai = new GoogleGenAI({ apiKey });
  const { userInfo, projects, skills } = portfolioData;

  const SYSTEM_INSTRUCTION = `
Siz ${userInfo.name}ning virtual yordamchisiz. Sizning vazifangiz sayt tashrif buyuruvchilariga ${userInfo.name} haqida ma'lumot berish.
Ma'lumotlar:
- Ism: ${userInfo.name}
- Mutaxassislik: ${userInfo.title}
- Bio: ${userInfo.bio}
- Ko'nikmalar: ${skills.map(s => s.name).join(", ")}
- Loyihalar: ${projects.map(p => `${p.title} (${p.description})`).join("; ")}
- Manzil: ${userInfo.location}
- Email: ${userInfo.email}

Faqat shu ma'lumotlar asosida javob bering. Siz do'stona, professional va qisqa javob berishingiz kerak.
Til: O'zbekcha.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return response.text || "Uzr, hozircha javob bera olmayman.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI bilan bog'lanishda xatolik yuz berdi.";
  }
};
