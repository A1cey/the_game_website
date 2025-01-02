import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import { createContext, useCallback, useEffect, useState } from "react";
import type {
	Session_t,
	Game_t,
	Player_t,
} from "@/types/database_extended.types";
import Game from "@/pages/Game";
import Session from "@/pages/Session";
import supabase from "@/utils/supabase";
import { useNavigate } from "react-router-dom";
import type { Json } from "./types/database.types";
import { convertGamesJSONToGameT } from "./utils/game";

export const SessionCtx = createContext<{
	session: Session_t;
	updateSession: (data: Session_t) => void;
}>({
	session: {
		created_at: "",
		game_id: "",
		game_started_at: null,
		last_update_at: "",
		max_num_of_players: 8,
		name: "",
		num_of_players: 0,
	},
	updateSession: () => {},
});

export const GameCtx = createContext<{
	game: Game_t;
	updateGame: (data: Game_t) => void;
}>({
	game: {
		current_player: 1,
		game_state: null,
		id: "",
	},
	updateGame: () => {},
});

export const PlayerCtx = createContext<{
	player: Player_t;
	updatePlayer: (data: Player_t) => void;
}>({
	player: {
		id: "",
		joined_at: "",
		name: null,
		player_game_state: null,
		position_in_session: 0,
		session_name: "",
	},
	updatePlayer: () => {},
});

const App = () => {
	const navigate = useNavigate();

	const [session, setSession] = useState<Session_t>({
		created_at: "",
		game_id: "",
		game_started_at: null,
		last_update_at: "",
		max_num_of_players: 8,
		name: "",
		num_of_players: 0,
	});

	const [game, setGame] = useState<Game_t>({
		current_player: 1,
		game_state: null,
		id: "",
	});

	const [player, setPlayer] = useState<Player_t>({
		id: "",
		joined_at: "",
		name: null,
		player_game_state: null,
		position_in_session: 0,
		session_name: "",
	});

	const updateSession = useCallback(
		(data: Session_t) => {
			// ingame check
			// game started
			if (!session.game_started_at && data.game_started_at) {
				navigate("game");
			}

			// game ended
			if (session.game_started_at && !data.game_started_at) {
				// TODO: end game logic
				navigate("session");
			}

			setSession(data);
		},
		[navigate, session.game_started_at],
	);

	const updateGame = useCallback((data: Json) => {
		const newData = convertGamesJSONToGameT(data);

		if (!newData) {
			console.error("Bad response for game update.");
			return;
		}

		setGame(newData);
	}, []);

	const updatePlayer = useCallback((data: Player_t) => {
		setPlayer(data);
	}, []);

	useEffect(() => {
		// Initial fetch
		if (session.name) {
			supabase
				.from("sessions")
				.select()
				.eq("name", session.name)
				.single()
				.then(({ data, error }) => {
					if (data) updateSession(data as Session_t);
					if (error) console.error("Error fetching session: ", error);
				});

			if (session.game_id) {
				supabase
					.from("games")
					.select()
					.eq("id", session.game_id)
					.single()
					.then(({ data, error }) => {
						if (data) updateGame(data as Json);
						if (error)
							console.error("Error fetching game: ", error);
					});
			}
		}

		if (player.id) {
			supabase
				.from("players")
				.select()
				.eq("id", player.id)
				.single()
				.then(({ data, error }) => {
					if (data) updatePlayer(data as Player_t);
					if (error) console.error("Error fetching player: ", error);
				});
		}

		// Subscription
		let sessionChannel = undefined;
		let gameChannel = undefined;
		let playerChannel = undefined;

		if (session.name) {
			console.log("Subscribing to session: ", session.name);
			sessionChannel = supabase.channel("session-updates").on(
				"postgres_changes",
				{
					schema: "public",
					table: "sessions",
					event: "UPDATE",
					filter: `name=eq.${session.name}`,
				},
				payload => updateSession(payload.new as Session_t),
			);

			sessionChannel.subscribe((subState, err) => {
				if (subState)
					console.log("Subscription state sessions: ", subState);
				if (err)
					console.error(
						`Error subscribing to session with name ${session.name}: `,
						err,
					);
			});
		}

		if (session.game_id) {
			console.log("Subscribing to games: ", session.game_id);
			gameChannel = supabase.channel("game-updates").on(
				"postgres_changes",
				{
					schema: "public",
					table: "games",
					event: "UPDATE",
					filter: `id=eq.${session.game_id}`,
				},
				payload => updateGame(payload.new as Game_t),
			);

			gameChannel.subscribe((subState, err) => {
				if (subState)
					console.log("Subscription state games: ", subState);
				if (err)
					console.error(
						`Error subscribing to game with id ${session.game_id}: ${err}`,
					);
			});
		}

		if (player.id) {
			console.log("Subscribing to players: ", player.id);
			playerChannel = supabase.channel("player-updates").on(
				"postgres_changes",
				{
					schema: "public",
					table: "players",
					event: "UPDATE",
					filter: `id=eq.${player.id}`,
				},
				payload => updatePlayer(payload.new as Player_t),
			);

			playerChannel.subscribe((subState, err) => {
				if (subState)
					console.log("Subscription state players: ", subState);
				if (err)
					console.error(
						`Error subscribing to player with id ${player.id}: `,
						err,
					);
			});
		}

		return () => {
			sessionChannel?.unsubscribe();
			gameChannel?.unsubscribe();
			playerChannel?.unsubscribe();
		};
	}, [
		session.name,
		player.id,
		session.game_id,
		updateSession,
		updateGame,
		updatePlayer,
	]);

	return (
		<SessionCtx.Provider value={{ session, updateSession }}>
			<GameCtx.Provider value={{ game, updateGame }}>
				<PlayerCtx.Provider value={{ player, updatePlayer }}>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/session" element={<Session />} />
						<Route path="/game" element={<Game />} />
						<Route path="*" element={<Home />} />
					</Routes>
				</PlayerCtx.Provider>
			</GameCtx.Provider>
		</SessionCtx.Provider>
	);
};

export default App;
