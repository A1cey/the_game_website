import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enJSON from "@/locales/en.json";
import deJSON from "@/locales/de.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { ...enJSON },
    de: { ...deJSON },
  },
  lng: "en",
});
