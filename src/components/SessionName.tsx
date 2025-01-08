import useSessionStore from "@/hooks/useSessionStore";
import useThemeStore from "@/hooks/useThemeStore";
import { Snippet } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

const SessionName = () => {
  const sessionName = useSessionStore(state => state.session.name);
  const theme = useThemeStore(state => state.theme);

  const { t } = useTranslation();
  
  return (
    <Snippet
      codeString={sessionName}
      hideSymbol={true}
      className={`
      ${theme} text-${theme === "dark" ? "white" : "black"} ${theme === "dark" ? "border-1 border-default bg-default-50" : "bg-default-200"}`}
      tooltipProps={{
        delay: 0,
        color: "foreground",
        content: "Copy",
        placement: "top",
        closeDelay: 0,
      }}
    >
      {`${t("sessionName")}: ${sessionName}`}
    </Snippet>
  );
};

export default SessionName;
