import { create } from "zustand";

export type SupportedLanguages = "en" | "de";

type Language = {
  lang: SupportedLanguages;
  setLang: (newLang: SupportedLanguages, changeLanguage: (lang: SupportedLanguages) => void) => void;
};

const useLanguageStore = create<Language>(set => ({
  lang: "en",
  setLang: (newLang, changeLanguage) => {
    changeLanguage(newLang);
    set(() => ({ lang: newLang }));
  },
}));

export default useLanguageStore;
