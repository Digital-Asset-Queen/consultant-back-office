import { setLocale as setFormattingLocale } from "@/lib/formatting";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type Language,
  type Vars,
  resolveTranslation,
  translations,
} from "./translations";

const STORAGE_KEY = "app-language";
const DEFAULT_LANGUAGE: Language = "th";

export interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  /** Translate a key with optional interpolation vars. Returns the key if missing. */
  t: (key: string, vars?: Vars) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

function readStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "th") return stored;
  } catch {
    // localStorage may be unavailable (private mode, SSR) — fall through to default
  }
  return DEFAULT_LANGUAGE;
}

function persistLanguage(lang: Language): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore write failures
  }
}

function applyDocumentLang(lang: Language): void {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang;
  }
}

export interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    const initial = readStoredLanguage();
    // Sync formatting + <html lang> on first render so SSR/CSR match
    setFormattingLocale(initial);
    applyDocumentLang(initial);
    return initial;
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    persistLanguage(lang);
    applyDocumentLang(lang);
    setFormattingLocale(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "th" ? "en" : "th");
  }, [language, setLanguage]);

  // Keep <html lang> in sync if state ever changes outside setLanguage (defensive)
  useEffect(() => {
    applyDocumentLang(language);
  }, [language]);

  const t = useCallback(
    (key: string, vars?: Vars) =>
      resolveTranslation(translations, language, key, vars),
    [language],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, toggleLanguage, t }),
    [language, setLanguage, toggleLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/** Access the full language context. Throws if used outside the provider. */
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

/** Convenience hook returning only the t() function. */
export function useT(): (key: string, vars?: Vars) => string {
  return useLanguage().t;
}

export default LanguageProvider;
