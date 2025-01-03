import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import GameCarousel from "@/components/GameCarousel";
import { defaultDBGameState, getGameImgs } from "@/utils/game";
import GameOptions from "@/components/game_options/GameOptions";
import { Games } from "@/types/game.types";
import { getEnumValues } from "@/utils/other";
import type { Json } from "@/types/database.types";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Link } from "@nextui-org/react";
import useSessionStore from "@/hooks/useSessionStore";
import usePlayerStore from "@/hooks/usePlayerStore";
import useGameStore from "@/hooks/useGameStore";
import ButtonBordered from "@/components/ButtonBordered";

const Session = () => {
  const [currentGame, setCurrentGame] = useState("");
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

  useEffect(() => {
    const gameName = getEnumValues(Games).find(val => Games[val] === currentGame) || null;

    console.log("Setting new game: ", gameName);

    if (!session.game_id) {
      console.error("Error updating the game selection: Game id not set.");
      return;
    }

    supabase
      .from("games")
      .update({
        game_state: gameName ? (defaultDBGameState(gameName) as Json) : null,
      })
      .eq("id", session.game_id)
      .then(({ error }) => {
        if (error) console.error("Error updating the game selection: ", error);
      });
  }, [currentGame]);

  return (
    <div>
      <div className="ml-10 p-2 flex gap-20 w-full items-center">
        <ButtonBordered as={Link} color="primary" href={"/"} onPress={removePlayerFromSession}>
          Home
        </ButtonBordered>
        <ThemeSwitcher />
        <div>Players: {session.num_of_players}</div>
        <p>Selected Game: {currentGame}</p>
      </div>
      <div className="grid gap-20 justify-center">
        <div className="mt-40">
          <GameCarousel gameImgs={getGameImgs()} setCurrentGame={setCurrentGame} />
        </div>
        <div className="flex gap-20 justify-center">
        <GameOptions
          currentGame={
            gameState?.game
              ? (Games[gameState.game as unknown as keyof typeof Games] as unknown as Games)
              : undefined
          }
        />
        <ButtonBordered onPress={startGame}>
          Start
        </ButtonBordered>
        </div>
      </div>
    </div>
  );
};

export default Session;
