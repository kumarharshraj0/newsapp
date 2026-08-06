export const translations = {
  en: {},
  hi: {
    "home": "होम",
    "about us": "हमारे बारे में",
    "menu": "मेनू",
    "all": "सभी",
    "sports news": "खेल समाचार",
    "local news": "स्थानीय समाचार",
    "world news": "विश्व समाचार",
    "business": "व्यापार",
    "technology": "तकनीक",
    "entertainment": "मनोरंजन",
    "health": "स्वास्थ्य",
    "science": "विज्ञान",
    "politics": "राजनीति",
    "education": "शिक्षा",
    "trending:": "ट्रेंडिंग:",
    "by": "द्वारा",
    "published on": "प्रकाशित",
    "likes": "पसंद",
    "like": "पसंद",
    "mins read": "मिनट पढ़ें",
    "share": "शेयर"
  }
}

export const t = (text, language) => {
  if (!text) return "";
  if (language === "hindi") {
    const lowerText = text.toLowerCase().trim();
    // Return translated string if it exists in the dictionary
    if (translations.hi[lowerText]) {
      return translations.hi[lowerText];
    }
    // Handle "All <Category>" specifically
    if (lowerText.startsWith("all ")) {
      const category = lowerText.substring(4);
      return `सभी ${translations.hi[category] || text.substring(4)}`;
    }
  }
  return text; // Fallback to original text for English or unmapped terms
}
