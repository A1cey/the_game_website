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
import type { PlayerLive } from "@/types/game.types";
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
  const positionInSession = usePlayerStore(state => state.player.position_in_session);

  const [players, setPlayers] = useState<string[]>([]);
  const currentPlayerRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();
  const language = useLanguageStore(state => state.lang);

  const theme = useThemeStore(state => state.theme);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <div className="pt-2 pl-4 pr-4 flex gap-2 lg:gap-20 items-center flex-wrap lg:flex-nowrap lg:flex-row justify-center">
      <ButtonBordered as={Link} href={"/"} onPress={leaveGame} isDisabled={true} className="order-1">
        {t("leaveGame")}
      </ButtonBordered>

      <ScrollShadow orientation="horizontal" className="w-full order-3 lg:order-2" hideScrollBar={windowWidth < 1024}>
        <div className="flex gap-1">
          {players.map((player, idx) => (
            // biome-igore lint/suspicious/noArrayIndexKey: The key is the index of the array, which is fine in this case.
            <div
              key={idx}
              ref={currentPlayer === idx + 1 ? currentPlayerRef : null}
              className={`
                p-2 text-nowrap
                ${currentPlayer === idx + 1 ? "border-b-2 border-primary bg-primary-50" : ""}
                ${showLives && lives[idx] && lives[idx].lives === 0 ? "bg-default-100 text-default-400 scale-95" : ""}
                ${positionInSession === idx + 1 ? "text-warning" : ""}
                `}
            >
              <div className="text-center">{player}</div>
              {showLives && lives[idx] ? (
                <Tooltip
                  content={t("lives")}
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
      <div className="order-2 lg:order-3">
        <GameRules />
      </div>
    </div>
  );
};

export default GameHeader;
