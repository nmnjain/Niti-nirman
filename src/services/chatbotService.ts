// src/services/chatbotService.ts

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const systemPrompt = import.meta.env.VITE_SYSTEM_PROMPT;
const genAI = new GoogleGenerativeAI(apiKey);

let chatSession: any = null;

const initializeChatSession = async () => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
    systemInstruction: systemPrompt,
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  return chatSession;
};

export const sendMessage = async (message: string) => {
  try {
    if (!chatSession) {
      chatSession = await initializeChatSession();
    }

    const result = await chatSession.sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error('Error sending message to chatbot:', error);
    throw error;
  }
};