import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, type LangKey, type Translation } from "./translations";

type LanguageContextType = {
  lang: LangKey;
  t: Translation;
  toggleLang: () => void;
  isUrdu: boolean;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "ur",
  t: translations.ur,
  toggleLang: () => {},
  isUrdu: true,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangKey>(() => {
    try {
      const saved = localStorage.getItem("bake-lang") as LangKey;
      return saved === "en" || saved === "ur" ? saved : "ur";
    } catch {
      return "ur";
    }
  });

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === "ur" ? "en" : "ur";
      localStorage.setItem("bake-lang", next);
      return next;
    });
  };

  useEffect(() => {
    const html = document.documentElement;
    if (lang === "ur") {
      html.setAttribute("dir", "rtl");
      html.setAttribute("lang", "ur");
      html.classList.add("lang-ur");
    } else {
      html.setAttribute("dir", "ltr");
      html.setAttribute("lang", "en");
      html.classList.remove("lang-ur");
    }
  }, [lang]);

  return (
    <LanguageContext.Provider
      value={{ lang, t: translations[lang], toggleLang, isUrdu: lang === "ur" }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
