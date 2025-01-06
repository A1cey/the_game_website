import supabase from "@/utils/supabase";
import GameCarousel from "@/components/ui/GameCarousel";
import GameOptions from "@/components/game_options/GameOptions";
import { Games } from "@/types/game.types";
import { Divider, Link, Snippet } from "@nextui-org/react";
import useSessionStore from "@/hooks/useSessionStore";
import usePlayerStore from "@/hooks/usePlayerStore";
import useGameStore from "@/hooks/useGameStore";
import ButtonBordered from "@/components/ui/ButtonBordered";
import { getGameImgs } from "@/utils/game";
import useThemeStore from "@/hooks/useThemeStore";

const Session = () => {
  const session = useSessionStore(state => state.session);
  const gameState = useGameStore(state => state.game.game_state);
  const playerId = usePlayerStore(state => state.player.id);
  const theme = useThemeStore(state => state.theme);

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
  
  const getGameName = (): string => {
    const selectedGame = gameState?.game.toString() ?? Object.values(Games)[0].toString();
    
    return selectedGame.split("_").map(val => val.substring(0, 1).toUpperCase() + val.substring(1).toLocaleLowerCase()).join(" ");
  }

  return (
    <div>
      <div className="ml-10 p-2 flex gap-20 w-full items-center">
        <ButtonBordered as={Link} color="primary" href={"/"} onPress={removePlayerFromSession}>
          Home
        </ButtonBordered>
        <Snippet
          codeString={session.name}
          hideSymbol={true} 
          className={`
            ${theme} text-${
            theme === "dark" ? "white" : "black"
          } ${theme === "dark" ? "border-1 border-default" : ""}`}
          tooltipProps={{
            delay: 0,
            color: "foreground",
            content: "Copy",
            placement: "right",
            closeDelay: 0,
          }}>
          {"Session Name: " + session.name}
        </Snippet>
        <p>Players: {session.num_of_players}</p>
        <p>Selected Game: {getGameName()}</p>
      </div>
      <Divider />
      <div className="grid gap-20 justify-center">
        <div className="mt-40">
          <GameCarousel gameImgs={getGameImgs()} />
        </div>
        <div className="flex gap-20 justify-center">
          <GameOptions
            currentGame={
              gameState?.game ? (Games[gameState.game as unknown as keyof typeof Games] as unknown as Games) : undefined
            }
          />
          <ButtonBordered onPress={startGame}>Start</ButtonBordered>
        </div>
      </div>
    </div>
  );
};

export default Session;
