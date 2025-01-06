import useThemeStore from "@/hooks/useThemeStore";
import { Switch } from "@nextui-org/switch";
import { useEffect, useState } from "react";
import MoonIcon from "./icons/MoonIcon";
import SunIcon from "./icons/SunIcon";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useThemeStore();
  const [isSelected, setIsSelected] = useState(theme === "dark");

  useEffect(() => {
    setTheme(isSelected ? "dark" : "light");
  }, [setTheme, isSelected]);

  return (
    <div className="flex gap-4 items-center">
      <label htmlFor="theme-switch">{theme.substring(0,1).toUpperCase() + theme.substring(1)} Mode</label>
      <Switch
        id="theme-switch"
        defaultSelected
        color="warning"
        endContent={<MoonIcon />}
        size="lg"
        startContent={<SunIcon />}
        onValueChange={setIsSelected}
        isSelected={isSelected}
      />
    </div>
  );
};
