import { Link, Tooltip } from "@nextui-org/react";
import ButtonBordered from "./ui/ButtonBordered";
import { getPlayerNames } from "@/utils/supabase";
import usePlayerStore from "@/hooks/usePlayerStore";
import { useEffect, useRef, useState } from "react";
import useSessionStore from "@/hooks/useSessionStore";
import useGameStore from "@/hooks/useGameStore";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { useTranslation } from "react-i18next";
import useLanguageStore from "@/hooks/useLanguageStore";
import GameRules from "./GameRules";
import { PlayerLive } from "@/types/game.types";
import useThemeStore from "@/hooks/useThemeStore";

type GameHeaderProps = {
  showLives: boolean;
  lives: PlayerLive[];
};

const GameHeader = ({ showLives, lives }: GameHeaderProps) => {
  const sessionName = useSessionStore(state => state.session.name);
  const playerCount = useSessionStore(state => state.session.num_of_players);
  const currentPlayer = useGameStore(state => state.game.current_player);
  const resetPlayer = usePlayerStore(state => state.resetStore);
  const resetSession = useSessionStore(state => state.resetStore);
  const resetGame = useGameStore(state => state.resetStore);

  const [players, setPlayers] = useState<string[]>([]);
  const currentPlayerRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();
  const language = useLanguageStore(state => state.lang);

  const theme = useThemeStore(state => state.theme);

  useEffect(() => {
    getPlayerNames(sessionName, t).then(playerNames => setPlayers(playerNames));
  }, [playerCount, sessionName, language]);

  useEffect(() => {
    if (currentPlayerRef.current) {
      currentPlayerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [currentPlayer]);

  const leaveGame = () => {
    resetSession();
    resetGame();
    resetPlayer();
  };

  return (
    <div className="pt-2 pl-4 pr-4 flex gap-20 items-center">
      <ButtonBordered as={Link} href={"/"} onPress={leaveGame} isDisabled={true}>
        {t("leaveGame")}
      </ButtonBordered>

      <ScrollShadow orientation="horizontal" className="w-full">
        <div className="flex gap-1">
          {players.map((player, idx) => (
            <div
              key={idx}
              ref={currentPlayer === idx + 1 ? currentPlayerRef : null}
              className={`
                p-2 text-nowrap
                ${currentPlayer === idx + 1 ? "border-b-2 border-primary bg-primary-50" : ""}
                ${showLives && lives[idx] && lives[idx].lives === 0 ? "bg-default-100 text-default-400 scale-95" : ""}
                `}
            >
              <div className="text-center">{player}</div>
              {showLives && lives[idx] ? (
                <Tooltip
                  content={"Lives"}
                  placement="right-start"
                  offset={-15}
                  className={`${theme} text-${theme === "dark" ? "white" : "black"} ${theme === "dark" ? "bg-default-50 border-1 border-default" : ""}`}
                >
                  <div className="text-center">{lives[idx].lives > 0 ? lives[idx].lives : "Out"}</div>
                </Tooltip>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      </ScrollShadow>

      <GameRules />
    </div>
  );
};

export default GameHeader;
