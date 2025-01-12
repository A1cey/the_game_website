import { Button } from "@nextui-org/button";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { useState } from "react";
import { ThemeSwitcher } from "./ui/ThemeSwitcher";
import useThemeStore from "@/hooks/useThemeStore";
import { Divider } from "@nextui-org/react";
import SettingsIcon from "./icons/SettingsIcon";
import LanguageSelector from "./ui/LanguageSelector";

const Header = () => {
  const theme = useThemeStore(state => state.theme);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header>
      <div className="flex items-center justify-between w-full pt-2 pb-2">
        <div className="w-1/12 md:w-1/3 lg:w-1/3" />
        <h1 className="text-2xl dark:text-primary-500 font-bold w-1/3 text-center text-nowrap">The Game Website</h1>
        <div className="flex w-1/3 justify-end">
          <Popover placement="bottom-end" isOpen={isOpen} onOpenChange={open => setIsOpen(open)}>
            <PopoverTrigger>
              <Button isIconOnly aria-label="Settings" className="bg-transparent relative mr-2 lg:mr-4">
                <SettingsIcon
                  filled={true}
                  fill={`${theme === "dark" ? "white" : "black"}`}
                  className={`transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"} size-7 lg:size-20`}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={`${theme} text-${theme === "dark" ? "white" : "black"} ${theme === "dark" ? "border-1 border-default" : ""}`}
            >
              <div className={`${theme} flex flex-col gap-2`}>
                <ThemeSwitcher />
                <LanguageSelector />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Divider />
    </header>
  );
};

export default Header;
