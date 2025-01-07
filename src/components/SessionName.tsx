import useSessionStore from "@/hooks/useSessionStore";
import useThemeStore from "@/hooks/useThemeStore";
import { Snippet } from "@nextui-org/react";

const SessionName = () => {
  const sessionName = useSessionStore(state => state.session.name);
  const theme = useThemeStore(state => state.theme);

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
      {`Session Name: ${sessionName}`}
    </Snippet>
  );
};

export default SessionName;
