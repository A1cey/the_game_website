import { Link } from "@nextui-org/react";
import ButtonBordered from "./ui/ButtonBordered";
import SessionName from "./SessionName";
import SessionSize from "./SessionMembers";
import usePlayerStore from "@/hooks/usePlayerStore";
import { useTranslation } from "react-i18next";
import useSessionStore from "@/hooks/useSessionStore";
import useGameStore from "@/hooks/useGameStore";

const SessionHeader = () => {
  const resetPlayer = usePlayerStore(state => state.resetStore);
  const resetSession = useSessionStore(state => state.resetStore);
  const resetGame = useGameStore(state => state.resetStore);

  const leaveGame = () => {
    resetSession();
    resetGame();
    resetPlayer();
  };

  const { t } = useTranslation();

  return (
    <div className="p-2 flex gap-2 lg:gap-20 lg:items-center justify-between">
      <div className="lg:w-1/2">
        <ButtonBordered as={Link} href={"/"} onPress={leaveGame}>
          {t("leaveSession")}
        </ButtonBordered>
      </div>
      <div className="flex-col-reverse lg:w-1/2 flex lg:flex-row gap-2 justify-end lg:gap-4 items-end lg:items-center">
        <SessionName />
        <SessionSize />
      </div>
    </div>
  );
};

export default SessionHeader;
