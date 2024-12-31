import { useContext, useState } from "react";
import supabase from "@/utils/supabase";
import { NavLink } from "react-router-dom";
import { GameCtx, PlayerCtx, SessionCtx } from "@/App";
import GameCarousel from "@/components/GameCarousel";
import { Button } from "@/components/ui/button";
import { Games } from "@/types/game.types";

const getGameImgs = () : string[] => {
  return Array
    .from(Object.keys(Games))
    .filter(key => isNaN(Number(key)))
    .map(name => "src/assets/".concat(name.toLowerCase(), ".svg"));
}

const Session = () => {
	const [currentGame, setCurrentGame] = useState("");
	const { session, updateSession } = useContext(SessionCtx);
	const { player, updatePlayer } = useContext(PlayerCtx);
	const { game, updateGame } = useContext(GameCtx);
	
	const removePlayerFromSession = async () => {
		supabase
			.from("players")
			.delete()
			.eq("id", player.id)
			.then(({ error } ) => {
			  if (error) console.error(error)
			});

	};

	const startGame = async () => {
    supabase.rpc("start_game", {session_name: session.name}).then(({error}) => {
      if (error) console.log("Error while starting game: ", error);
    });
	}
	
	console.log(session, game, player);

	return (
		<div className="grid gap-4 justify-center">
			<NavLink to={"/"} onClick={removePlayerFromSession}>
				Home
			</NavLink>
			<div>Players: {session.num_of_players}</div>
			<GameCarousel
				gameImgs={getGameImgs()}
				setCurrentGame={setCurrentGame}
			/>
      <p>Selected Game: {currentGame}</p>
			<Button onClick={startGame}>Start</Button>
		</div>
	);
};

export default Session;
