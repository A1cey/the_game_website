import supabase from "@/utils/supabase";
import GameCarousel from "@/components/GameCarousel";
import GameOptions from "@/components/game_options/GameOptions";
import useSessionStore from "@/hooks/useSessionStore";
import useGameStore from "@/hooks/useGameStore";
import ButtonBordered from "@/components/ui/ButtonBordered";
import { formatGameName, getGameImgs } from "@/utils/game";
import SessionHeader from "@/components/SessionHeader";
import { useNavigate } from "react-router-dom";
import GameRules from "@/components/GameRules";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Games, type GameState, type LittleMaxGameState } from "@/types/game.types";
import { Spinner } from "@nextui-org/react";

const Session = () => {
  const session = useSessionStore(state => state.session);
  const currentGame = useGameStore(state => state.game.game_state?.game);
  const gameStarted = useSessionStore(state => state.session.game_started_at);
  const gameState = useGameStore(state => state.game.game_state);
  const navigate = useNavigate();
  const numOfPlayers = useSessionStore(state => state.session.num_of_players);

  const { t } = useTranslation();

  useEffect(() => {
    if (gameStarted) {
      navigate("/game");
    }
  }, [gameStarted]);

  const startGame = async () => {
    setupGame();

    await new Promise(resolve => setTimeout(resolve, 500));

    supabase.rpc("start_game", { session_name: session.name }).then(({ error }) => {
      if (error) {
        console.log("Error while starting game: ", error);
      }
    });
  };

  const setupGame = () => {
    if (currentGame === undefined) {
      console.error("Could not setup game. No game selected.");
      return;
    }

    const game = Games[currentGame as unknown as keyof typeof Games] as unknown as Games;

    switch (Number(game)) {
      case Games.ASSHOLE:
        break;
      case Games.DURAK:
        break;
      case Games.LITTLE_MAX:
        setUpLittleMax();
        break;
      case Games.POKER:
        break;
      case Games.THIRTY_ONE:
        break;
      case Games.WERWOLF:
        break;
      default:
        console.error(`Could not setup game. Unknown game : ${currentGame}`);
    }
  };

  const setUpLittleMax = () => {
    if (!gameState) {
      console.error("Could not set lives for game. No game state available.");
      return;
    }

    const newState = { ...gameState.state } as LittleMaxGameState;

    newState.lives = Array.from({ length: numOfPlayers }).map((_, idx) => ({
      lives: (gameState as GameState<Games.LITTLE_MAX>).options.lives,
      player: idx + 1,
    }));

    newState.activePlayers = Array.from({ length: numOfPlayers }).map((_, idx) => idx + 1);

    supabase
      .from("games")
      .update({ game_state: { ...gameState, state: newState } })
      .eq("id", session.game_id)
      .then(({ error }) => {
        if (error) {
          console.error(`Error occurred when setting the lives: ${error}`);
        }
      });
  };

  if (!gameState) {
    return (
      <div>
        <div className="flex flex-col lg:gap-28 justify-center">
          <SessionHeader />
          <div className="flex justify-center">
            <Spinner size="lg" color="primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-10 lg:gap-28 justify-center">
        <SessionHeader />
        <div className="mb-10 lg:mb-0">
          <GameCarousel gameImgs={getGameImgs(t)} />
        </div>
        <div className="flex flex-col md:flex-row lg:flex-row gap-4 lg:gap-28 justify-center pl-4 pr-4 items-center">
          <div className="w-1/3 flex justify-end">
            <GameRules />
          </div>
          <div className="w-1/3 flex justify-center">
            <GameOptions />
          </div>
          <div className="flex w-1/3 justify-center lg:justify-normal">
            <div className="flex flex-col text-center">
              <ButtonBordered
                className="w-fit"
                onPress={startGame}
                isDisabled={numOfPlayers < (gameState?.minPlayers ? gameState?.minPlayers : Number.POSITIVE_INFINITY)}
              >
                {t("startGame", { game: currentGame ? formatGameName(currentGame.toString(), t) : "" })}
              </ButtonBordered>
              <label
                className={`
                ${numOfPlayers >= (gameState?.minPlayers ? gameState?.minPlayers : Number.POSITIVE_INFINITY) ? "hidden" : ""}
                text-danger text-xs
                pr-2 lg:pr-0
                `}
              >
                {t("notEnoughPlayers")}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Session;
