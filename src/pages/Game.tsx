import GameHeader from "@/components/GameHeader";
import LittleMaxGame from "@/components/little_max/LittleMaxGame";
import useGameStore from "@/hooks/useGameStore";
import { Games } from "@/types/game.types";
import { useEffect, useState } from "react";

const Game = () => {
  const currentGame = useGameStore(state => state.game.game_state?.game);

  const [game, setGame] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (currentGame === undefined) {
      console.error("No game chosen.");
      return;
    }

    console.log(typeof currentGame);

    const game = Games[currentGame as unknown as keyof typeof Games] as unknown as Games;

    switch (Number(game)) {
      case Games.ASSHOLE:
        setGame(<div>Not implemented.</div>);
        break;
      case Games.DURAK:
        setGame(<div>Not implemented.</div>);
        break;
      case Games.LITTLE_MAX:
        console.log("Little Max chosen.");
        setGame(<LittleMaxGame />);
        break;
      case Games.POKER:
        setGame(<div>Not implemented.</div>);
        break;
      case Games.THIRTY_ONE:
        setGame(<div>Not implemented.</div>);
        break;
      case Games.WERWOLF:
        setGame(<div>Not implemented.</div>);
        break;
      default:
        throw new Error(`Unknown game: ${currentGame}`);
    }
  }, [currentGame, setGame]);

  return (
    <div className="h-full">
      <GameHeader />
      {game}
    </div>
  );
};

export default Game;
