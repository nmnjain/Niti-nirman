import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from '../lib/supabase';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const baseSystemPrompt = import.meta.env.VITE_SYSTEM_PROMPT;
const genAI = new GoogleGenerativeAI(apiKey);

let chatSession: any = null;
let cachedSchemes: any[] | null = null;

interface Scheme {
  id: string;
  scheme_name: string;
  details: string;
  benefits: string;
  gender: string;
  location: string;
  eligible_castes: string[];
  disability: string;
  minority: string;
  student: string;
  bpl: string;
  age_range: string;
  income_range: string;
  documents_required: string;
}

// Fetch schemes from Supabase with caching
const fetchSchemes = async (): Promise<Scheme[]> => {
  if (cachedSchemes) return cachedSchemes;

  const { data: schemes, error } = await supabase
    .from('schemes')
    .select('*');

  if (error) {
    console.error('Error fetching schemes:', error);
    throw error;
  }

  cachedSchemes = schemes;
  return schemes;
};

// Format schemes for the chatbot context
const formatSchemesContext = (schemes: Scheme[]): string => {
  return schemes.map(scheme => `
Scheme: ${scheme.scheme_name}
Details: ${scheme.details}
Benefits: ${scheme.benefits}
Eligibility:
- Gender: ${scheme.gender}
- Location: ${scheme.location}
- Caste: ${scheme.eligible_castes.join(', ')}
- Disability: ${scheme.disability}
- Minority: ${scheme.minority}
- Student: ${scheme.student}
- BPL: ${scheme.bpl}
- Age Range: ${scheme.age_range}
- Income Range: ${scheme.income_range}
- Documents Required: ${scheme.documents_required}
  `).join('\n\n');
};

const initializeChatSession = async () => {
  const schemes = await fetchSchemes();
  const schemesContext = formatSchemesContext(schemes);
  
  const fullSystemPrompt = `${baseSystemPrompt}

Available Schemes in Database:
${schemesContext}`;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
    systemInstruction: fullSystemPrompt,
  });

  const generationConfig = {
    temperature: 0.9,
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

// Function to invalidate cache when needed (e.g., when schemes are updated)
export const invalidateSchemeCache = () => {
  cachedSchemes = null;
};

export const sendMessage = async (message: string): Promise<string> => {
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

// Utility function to refresh chat session with latest scheme data
export const refreshChatSession = async () => {
  invalidateSchemeCache();
  chatSession = await initializeChatSession();
  return chatSession;
};