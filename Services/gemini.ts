import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Subject, SubjectConfig } from "../types";

export const generateTutorResponse = async (
  prompt: string,
  subject: Subject,
  history: { role: 'user' | 'model', parts: { text: string }[] }[],
  config: SubjectConfig,
  image?: string
) => {
  if (config.provider === 'gemini') {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = config.modelId || 'gemini-3-pro-preview';
    
    const systemInstruction = `Bạn là "Gia Sư Bách Khoa", một chuyên gia giảng dạy môn ${subject}. 
    Phong cách: chuyên nghiệp, tận tâm. Hãy sử dụng LaTeX cho các công thức toán học/lý học/hóa học để hiển thị đẹp nhất.`;

    const contents: any[] = history.map(h => ({
      role: h.role,
      parts: h.parts
    }));

    const currentParts: any[] = [{ text: prompt }];
    if (image) {
      const base64Parts = image.split(',');
      const mimeType = base64Parts[0].match(/:(.*?);/)?.[1] || "image/jpeg";
      const base64Data = base64Parts[1];
      currentParts.push({ inlineData: { mimeType, data: base64Data } });
    }
    contents.push({ role: 'user', parts: currentParts });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents,
      config: { systemInstruction, temperature: 0.7 },
    });

    return response.text;
  } else {
    if (!config.apiUrl) throw new Error("Chưa cấu hình API URL");
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: config.modelId, prompt, history, image })
    });
    const data = await response.json();
    return data.text || "Không có phản hồi từ AI tùy chỉnh.";
  }
};
