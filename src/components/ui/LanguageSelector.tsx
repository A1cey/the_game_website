import useLanguageStore, { SupportedLanguages } from "@/hooks/useLanguageStore";
import useThemeStore from "@/hooks/useThemeStore";
import { Select, SelectItem } from "@nextui-org/react";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const theme = useThemeStore(state => state.theme);
  
  const { t , i18n} = useTranslation();
  const language = useLanguageStore(state => state.lang);
  const setLanguage = useLanguageStore(state => state.setLang);
  
  const langs = [
    { key: "en", data: t("english") }, 
    { key: "de", data: t("german") }
  ];

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as SupportedLanguages, i18n.changeLanguage);
  }
  
  return (
    <Select
      label={t("selectLang")}
      value={language === "de" ? t("german") : t("english")}
      items={langs}
      selectedKeys={[language]}
      disabledKeys={[language]}
      onChange={handleLanguageChange}
      labelPlacement="outside-left"
      className="min-w-56"
      classNames={{
        label: "text-nowrap translate-y-[50%]",
        listboxWrapper: `${theme === "dark" ? "bg-default-700 text-default" : "bg-default-200"} max-h-[400px]`,
        popoverContent: `${theme === "dark" ? "bg-default-700" : "bg-default-200"}`,
        trigger: `${theme === "dark" ? "bg-default" : "bg-default-200"}`,
      }}
      listboxProps={{
        itemClasses: {
          base: [
            `${theme === "dark" ? "bg-default-700 data-[hover=true]:bg-default-400" : "bg-default-200 data-[hover=true]:text-foreground"}`,
          ],
        },
      }}
    >
      {langs.map(lang => (
        <SelectItem key={lang.key}>{lang.data}</SelectItem>
      ))}
    </Select>
  )
};

export default LanguageSelector;
