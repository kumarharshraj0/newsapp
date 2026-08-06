import { useState, useEffect } from 'react';
import translate from 'translate';

translate.engine = 'google';

// Simple in-memory cache to avoid duplicate requests to the translation API
const translationCache = {};

// Manual overrides for words that the auto-translator gets wrong in context
const manualOverrides = {
  hi: {
    "home": "होम",
    "about us": "हमारे बारे में",
    "all": "सभी",
    "trending headlines": "ट्रेंडिंग हेडलाइंस",
    "featured": "विशेष",
  }
};

export const useTranslation = (text, language) => {
  // Synchronous early return for default languages to prevent unnecessary useEffect renders
  const isDefaultLang = !language || language === "english" || language === "all" || language === "en";
  
  const [translatedText, setTranslatedText] = useState(() => {
    if (!text) return "";
    if (isDefaultLang) return text;
    
    const langCode = language === "hindi" ? "hi" : language;
    const lowerText = text.toLowerCase().trim();
    if (manualOverrides[langCode] && manualOverrides[langCode][lowerText]) {
      return manualOverrides[langCode][lowerText];
    }
    return text; // Initial fallback before async fetch
  });

  useEffect(() => {
    let isMounted = true;
    
    if (isDefaultLang || !text) return;

    const translateAsync = async () => {
      // If no text provided, return empty string
      if (!text) {
        if (isMounted) setTranslatedText("");
        return;
      }
      
      const langCode = language === "hindi" ? "hi" : language;
      const lowerText = text.toLowerCase().trim();
      
      if (manualOverrides[langCode] && manualOverrides[langCode][lowerText]) {
        // Handled in initial state
        return;
      }
      
      // Also check overrides for "All [Category]" format
      if (langCode === "hi" && lowerText.startsWith("all ")) {
         const category = lowerText.substring(4);
         if (manualOverrides.hi[category]) {
            if (isMounted) setTranslatedText(`सभी ${manualOverrides.hi[category]}`);
            return;
         }
      }

      const cacheKey = `${text}_${langCode}`;

      // Check cache first
      if (translationCache[cacheKey]) {
        if (isMounted) setTranslatedText(translationCache[cacheKey]);
        return;
      }

      try {
        // Fetch translation
        const result = await translate(text, { to: langCode });
        translationCache[cacheKey] = result;
        if (isMounted) setTranslatedText(result);
      } catch (err) {
        console.error("Auto-translation error:", err);
        // Fallback to original text on error
        if (isMounted) setTranslatedText(text);
      }
    };

    // If it's a default language or already resolved via manual override in state, don't run API
    const langCode = language === "hindi" ? "hi" : language;
    const lowerText = text.toLowerCase().trim();
    if (manualOverrides[langCode] && manualOverrides[langCode][lowerText]) {
      return;
    }

    translateAsync();

    return () => {
      isMounted = false;
    };
  }, [text, language, isDefaultLang]);

  return translatedText;
};

// Component version for easy JSX wrapping
export const Translate = ({ text, language }) => {
  const translated = useTranslation(text, language);
  return <>{translated}</>;
};
