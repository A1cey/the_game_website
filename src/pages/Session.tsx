import supabase from "@/utils/supabase";
import GameCarousel from "@/components/GameCarousel";
import GameOptions from "@/components/game_options/GameOptions";
import { Games } from "@/types/game.types";
import useSessionStore from "@/hooks/useSessionStore";
import useGameStore from "@/hooks/useGameStore";
import ButtonBordered from "@/components/ui/ButtonBordered";
import { getAltNameForGame, getGameImgs } from "@/utils/game";
import SessionHeader from "@/components/SessionHeader";
import { useNavigate } from "react-router-dom";

const Session = () => {
  const session = useSessionStore(state => state.session);
  const gameState = useGameStore(state => state.game.game_state);
  const navigate = useNavigate();


  const startGame = async () => {
    supabase.rpc("start_game", { session_name: session.name }).then(({ error }) => {
      if (error) {
        console.log("Error while starting game: ", error);
      } else {
        navigate("/game");
      }
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-20 justify-center">
        <SessionHeader />
        <div className="mt-40">
          <GameCarousel gameImgs={getGameImgs()} />
        </div>
        <div className="flex gap-28 justify-center">
          <div className="w-1/2 flex justify-end">
            <GameOptions
              currentGame={
                gameState ? (Games[gameState.game as unknown as keyof typeof Games] as unknown as Games) : undefined
              }
            />
          </div>
          <div className="flex w-1/2">
            <ButtonBordered onPress={startGame}>
              Start {gameState?.game ? getAltNameForGame(gameState.game.toString()) : ""}
            </ButtonBordered>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Session;
