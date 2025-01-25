import useGameStore from "@/hooks/useGameStore";
import usePlayerStore from "@/hooks/usePlayerStore";
import useSessionStore from "@/hooks/useSessionStore";
import { Link } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import SessionSize from "./SessionMembers";
import SessionName from "./SessionName";
import ButtonBordered from "../ui/ButtonBordered";

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
