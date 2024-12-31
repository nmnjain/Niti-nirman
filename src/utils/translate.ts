const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: "Welcome",
    login: "Login",
    signup: "Sign Up",
    // Add more translations as needed
  },
  hi: {
    welcome: "स्वागत है",
    login: "लॉगिन",
    signup: "साइन अप",
    // Add more translations as needed
  },
  // Add more languages as needed
};

export const translate = (key: string, lang: string) => {
  return translations[lang][key] || key;
};
