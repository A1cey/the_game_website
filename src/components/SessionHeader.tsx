import { Link } from "@nextui-org/react";
import ButtonBordered from "./ui/ButtonBordered";
import { removePlayerFromSession } from "@/utils/supabase";
import SessionName from "./SessionName";
import SessionSize from "./SessionMembers";
import usePlayerStore from "@/hooks/usePlayerStore";

const SessionHeader = () => {
  const playerId = usePlayerStore(state => state.player.id);
  
  return (
    <div className="p-2 flex gap-20 items-center justify-between">
      <div className="w-1/2">
        <ButtonBordered as={Link} href={"/"} onPress={() => removePlayerFromSession(playerId)}>
          Leave Session
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