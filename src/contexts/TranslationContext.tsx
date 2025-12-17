import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type SupportedLanguage = 'en' | 'te' | 'hi' | 'ta' | 'kn' | 'ml' | 'bn' | 'mr' | 'gu' | 'pa';

interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
];

interface TranslationCache {
  [key: string]: string;
}

interface TranslationContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  translate: (text: string) => Promise<string>;
  translateBatch: (texts: string[]) => Promise<string[]>;
  isTranslating: boolean;
  languages: LanguageInfo[];
  getLanguageInfo: (code: SupportedLanguage) => LanguageInfo | undefined;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as SupportedLanguage) || 'en';
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const [cache, setCache] = useState<TranslationCache>({});
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('app-language', currentLanguage);
  }, [currentLanguage]);

  const getCacheKey = (text: string, targetLang: SupportedLanguage) => `${targetLang}:${text}`;

  const translate = useCallback(async (text: string): Promise<string> => {
    if (currentLanguage === 'en' || !text.trim()) {
      return text;
    }

    const cacheKey = getCacheKey(text, currentLanguage);
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    try {
      setIsTranslating(true);
      const { data, error } = await supabase.functions.invoke('translate', {
        body: { text, targetLanguage: currentLanguage, sourceLanguage: 'en' }
      });

      if (error) throw error;

      const translated = data.translations;
      setCache(prev => ({ ...prev, [cacheKey]: translated }));
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage, cache]);

  const translateBatch = useCallback(async (texts: string[]): Promise<string[]> => {
    if (currentLanguage === 'en') {
      return texts;
    }

    const uncachedTexts: string[] = [];
    const uncachedIndices: number[] = [];
    const results: string[] = [...texts];

    texts.forEach((text, index) => {
      const cacheKey = getCacheKey(text, currentLanguage);
      if (cache[cacheKey]) {
        results[index] = cache[cacheKey];
      } else if (text.trim()) {
        uncachedTexts.push(text);
        uncachedIndices.push(index);
      }
    });

    if (uncachedTexts.length === 0) {
      return results;
    }

    try {
      setIsTranslating(true);
      const { data, error } = await supabase.functions.invoke('translate', {
        body: { text: uncachedTexts, targetLanguage: currentLanguage, sourceLanguage: 'en' }
      });

      if (error) throw error;

      const translations = data.translations;
      const newCache: TranslationCache = {};

      uncachedIndices.forEach((originalIndex, i) => {
        results[originalIndex] = translations[i];
        const cacheKey = getCacheKey(uncachedTexts[i], currentLanguage);
        newCache[cacheKey] = translations[i];
      });

      setCache(prev => ({ ...prev, ...newCache }));
      return results;
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage, cache]);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    if (lang !== 'en') {
      toast({
        title: "Language Changed",
        description: `Translating page to ${SUPPORTED_LANGUAGES.find(l => l.code === lang)?.nativeName || lang}...`,
      });
    }
  }, [toast]);

  const getLanguageInfo = useCallback((code: SupportedLanguage) => {
    return SUPPORTED_LANGUAGES.find(l => l.code === code);
  }, []);

  return (
    <TranslationContext.Provider value={{
      currentLanguage,
      setLanguage,
      translate,
      translateBatch,
      isTranslating,
      languages: SUPPORTED_LANGUAGES,
      getLanguageInfo
    }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
