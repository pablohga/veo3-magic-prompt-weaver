import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const translatePromptWithGemini = async (originalPrompt: string) => {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
Você receberá um conteúdo de prompt que mistura narrativa com falas de personagens.

Seu trabalho é traduzir apenas a narrativa para o inglês, mantendo todas as falas e diálogos de personagens exatamente como estão, sem traduzir.

O conteúdo é:
"""
${originalPrompt}
"""

Retorne apenas o prompt traduzido, sem comentários ou explicações.
`;

  const result = await model.generateContent(prompt);
  const translated = result.response.text();

  return translated;
};