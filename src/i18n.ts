import deJSON from "@/locales/de.json";
import enJSON from "@/locales/en.json";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: { ...enJSON },
    de: { ...deJSON },
  },
  lng: "en",
});
