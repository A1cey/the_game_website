import supabase from "@/utils/supabase";
import GameCarousel from "@/components/GameCarousel";
import GameOptions from "@/components/game_options/GameOptions";
import { Games } from "@/types/game.types";
import { Link } from "@nextui-org/react";
import useSessionStore from "@/hooks/useSessionStore";
import usePlayerStore from "@/hooks/usePlayerStore";
import useGameStore from "@/hooks/useGameStore";
import ButtonBordered from "@/components/ui/ButtonBordered";
import { getAltNameForGame, getGameImgs } from "@/utils/game";
import SessionSize from "@/components/SessionSize";
import SessionName from "@/components/SessionName";

const Session = () => {
  const session = useSessionStore(state => state.session);
  const gameState = useGameStore(state => state.game.game_state);
  const playerId = usePlayerStore(state => state.player.id);

  const removePlayerFromSession = async () => {
    if (!playerId) {
      console.error("Error removing player from session: player id not set.");
      return;
    }

    supabase
      .from("players")
      .delete()
      .eq("id", playerId)
      .then(({ error }) => {
        if (error) console.error("Error removing player from session: ", error);
      });
  };

  const startGame = async () => {
    supabase.rpc("start_game", { session_name: session.name }).then(({ error }) => {
      if (error) console.log("Error while starting game: ", error);
    });
  };

  return (
    <div>
      <div className="p-2 flex gap-20 w-full items-center justify-between">
        <div className="w-1/2">
          <ButtonBordered as={Link} color="primary" href={"/"} onPress={removePlayerFromSession}>
            Home
          </ButtonBordered>
        </div>
        <div className="w-1/2 flex justify-end gap-4">
          <SessionName />
          <SessionSize />
        </div>
      </div>
      <div className="grid gap-20 justify-center">
        <div className="mt-40">
          <GameCarousel gameImgs={getGameImgs()} />
        </div>
        <div className="flex gap-28 justify-center">
          <div className="w-1/2 flex justify-end">
          <GameOptions
            currentGame={
              gameState? (Games[gameState.game as unknown as keyof typeof Games] as unknown as Games) : undefined
            }
          />
          </div>
          <div className="flex w-1/2">
            <ButtonBordered onPress={startGame}>Start {gameState?.game ? getAltNameForGame(gameState.game.toString()) : ""}</ButtonBordered>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Session;
