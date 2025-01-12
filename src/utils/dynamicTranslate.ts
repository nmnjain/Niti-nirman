import axios from 'axios';

const API_KEY = 'YOUR_GOOGLE_API_KEY'; 

export const translateText = async (text: string, targetLanguage: string) => {
  const response = await axios.post(`https://translation.googleapis.com/language/translate/v2`, null, {
    params: {
      q: text,
      target: targetLanguage,
      key: API_KEY,
    },
  });
  return response.data.data.translations[0].translatedText;
};
