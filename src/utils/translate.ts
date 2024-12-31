const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: "Welcome",
    login: "Login",
    signup: "Sign Up",
    Unlock: "Unlock Your Government Benefits with Niti-Nirman",
    subheading:"Simplifying access to government schemes with personalized recommendations and secure document verification",
    create: "Create Your Profile Now!",
    unlockeligibilty:"Unlock Your Eligibility for Government Schemes",
    para:"Creating a profile on Niti-Nirman is your first step toward accessing tailored government schemes. Our user-friendly platform simplifies the process, allowing you to quickly input your details and discover the benefits available to you. With just a few clicks, you can stay informed and empowered.",
    // Add more translations as needed
  },
  hi: {
    welcome: "स्वागत है",
    login: "लॉगिन",
    signup: "साइन अप",
    Unlock: "नीति-निर्माण के साथ अपने सरकारी लाभ अनलॉक करें",
    subheading: "वैयक्तिकृत अनुशंसाओं और सुरक्षित दस्तावेज़ सत्यापन के साथ सरकारी योजनाओं तक पहुंच को सरल बनाना",
    create:"अभी अपना प्रोफ़ाइल बनाएं!",
    unlockeligibilty:"सरकारी योजनाओं के लिए अपनी पात्रता अनलॉक करें",
    para:"नीति-निर्माण पर एक प्रोफ़ाइल बनाना अनुरूप सरकारी योजनाओं तक पहुँचने की दिशा में आपका पहला कदम है। हमारा उपयोगकर्ता-अनुकूल प्लेटफ़ॉर्म प्रक्रिया को सरल बनाता है, जिससे आप तुरंत अपना विवरण दर्ज कर सकते हैं और अपने लिए उपलब्ध लाभों का पता लगा सकते हैं। बस कुछ ही क्लिक के साथ, आप सूचित और सशक्त रह सकते हैं।",
  },
  // Add more languages as needed
};

export const translate = (key: string, lang: string) => {
  return translations[lang][key] || key;
};
