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
    <div className="p-2 flex gap-20 items-center justify-between">
      <div className="w-1/2">
        <ButtonBordered as={Link} href={"/"} onPress={leaveGame}>
          {t("leaveSession")}
        </ButtonBordered>
      </div>
      <div className="w-1/2 flex justify-end gap-4">
        <SessionName />
        <SessionSize />
      </div>
    </div>
  );
};

export default SessionHeader;
