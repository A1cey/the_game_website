import { useContext, useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { NavLink } from "react-router-dom";
import { GameCtx, PlayerCtx, SessionCtx } from "@/App";
import GameCarousel from "@/components/GameCarousel";
import {
	defaultDBGameState,
	getGameImgs,
} from "@/utils/game";
import GameOptions from "@/components/game_options/GameOptions";
import { Games } from "@/types/game.types";
import { getEnumValues } from "@/utils/other";
import { Json } from "@/types/database.types";

const Session = () => {
	const [currentGame, setCurrentGame] = useState("");
	const { session } = useContext(SessionCtx);
	const { player } = useContext(PlayerCtx);
	const { game } = useContext(GameCtx);

	const removePlayerFromSession = async () => {
		if (!player.id) {
			console.error(
				"Error removing player from session: Player id not set.",
			);
			return;
		}

		supabase
			.from("players")
			.delete()
			.eq("id", player.id)
			.then(({ error }) => {
				if (error)
					console.error(
						"Error removing player from session: ",
						error,
					);
			});
	};

	const startGame = async () => {
		supabase
			.rpc("start_game", { session_name: session.name })
			.then(({ error }) => {
				if (error) console.log("Error while starting game: ", error);
			});
	};

	useEffect(() => {
		console.log("Updating game and game state");
		const gameType =
			getEnumValues(Games).find(val => Games[val] === currentGame) ||
			null;

		if (!game.id) {
			console.error(
				"Error updating the game selection: Game id not set.",
			);
			return;
		}

		supabase
			.from("games")
			.update({
				game_state: gameType
					? (defaultDBGameState(gameType) as Json)
					: null,
			})
			.eq("id", game.id)
			.then(({ error }) => {
				if (error)
					console.error("Error updating the game selection: ", error);
			});
	}, [currentGame]);

	return (
		<div>
			<div className="p-2 flex gap-20 w-full">
				<NavLink
					to={"/"}
					onClick={removePlayerFromSession}
					className="ml-10 text-xl bg-blue-400 rounded"
				>
					Home
				</NavLink>
				<div className="ml-10 text-xl ">
					Players: {session.num_of_players}
				</div>
			</div>
			<div className="grid gap-4 justify-center">
				<div className="mt-40">
					<GameCarousel
						gameImgs={getGameImgs()}
						setCurrentGame={setCurrentGame}
					/>
				</div>
				<p className=" text-xl">Selected Game: {currentGame}</p>
				<GameOptions
					currentGame={
						game.game_state?.game
							? (Games[
									game.game_state
										.game as unknown as keyof typeof Games
								] as unknown as Games)
							: undefined
					}
				/>
				<Button className="w-40 text-xl" onClick={startGame}>
					Start
				</Button>
			</div>
		</div>
	);
};

export default Session;
