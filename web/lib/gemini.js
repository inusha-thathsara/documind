import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'YOUR_GEMINI_KEY');

export const getGeminiModel = (systemInstruction, modelName = 'gemini-3.1-flash-lite') => {
  return genAI.getGenerativeModel({ 
    model: modelName,
    ...(systemInstruction && { systemInstruction })
  });
};
