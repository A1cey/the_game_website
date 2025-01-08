import { Link } from "@nextui-org/react";
import ButtonBordered from "./ui/ButtonBordered";
import { getPlayerNames, removePlayerFromSession } from "@/utils/supabase";
import usePlayerStore from "@/hooks/usePlayerStore";
import { useEffect, useRef, useState } from "react";
import useSessionStore from "@/hooks/useSessionStore";
import useGameStore from "@/hooks/useGameStore";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { useTranslation } from "react-i18next";
import useLanguageStore from "@/hooks/useLanguageStore";
import GameRules from "./GameRules";

const GameHeader = () => {
  const playerId = usePlayerStore(state => state.player.id);
  const sessionName = useSessionStore(state => state.session.name);
  const playerCount = useSessionStore(state => state.session.num_of_players);
  const currentPlayer = useGameStore(state => state.game.current_player);
  
  const [players, setPlayers] = useState<string[]>([]);
  const currentPlayerRef = useRef<HTMLDivElement>(null);
  
  const {t} = useTranslation();
  const language = useLanguageStore(state => state.lang);
  
  useEffect(() => {
    getPlayerNames(sessionName, t).then(playerNames => setPlayers(playerNames));     
  }, [playerCount, sessionName, language]);

  useEffect(() => {
    if (currentPlayerRef.current) {
      currentPlayerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [currentPlayer]);
  
  return (
    <div className="pt-2 pl-4 pr-4 flex gap-20 items-center">
      <ButtonBordered as={Link} href={"/"} onPress={() => removePlayerFromSession(playerId)}>
        {t("leaveGame")}
      </ButtonBordered>
      
      <ScrollShadow orientation="horizontal" className="w-full">
        <div className="flex gap-1">
          {players.map((player,idx) => 
            <div 
              key={idx} 
              ref={currentPlayer === idx + 1 ? currentPlayerRef : null}
              className={`p-2 text-nowrap ${currentPlayer === idx + 1 ? "border-b-2 border-primary bg-primary-50" : ""}`} >
              {player}
            </div>
          )}
        </div>
      </ScrollShadow>
      
      <GameRules/>
    </div>
  );
}

export default GameHeader;