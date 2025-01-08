import { Link } from "@nextui-org/react";
import ButtonBordered from "./ui/ButtonBordered";
import { removePlayerFromSession } from "@/utils/supabase";
import SessionName from "./SessionName";
import SessionSize from "./SessionMembers";
import usePlayerStore from "@/hooks/usePlayerStore";
import { useTranslation } from "react-i18next";

const SessionHeader = () => {
  const playerId = usePlayerStore(state => state.player.id);
  
  const {t} = useTranslation();
  
  return (
    <div className="p-2 flex gap-20 items-center justify-between">
      <div className="w-1/2">
        <ButtonBordered as={Link} href={"/"} onPress={() => removePlayerFromSession(playerId)}>
         {t("leaveSession")}
        </ButtonBordered>
      </div>
      <div className="w-1/2 flex justify-end gap-4">
        <SessionName />
        <SessionSize />
      </div>
    </div>
  );
}

export default SessionHeader;