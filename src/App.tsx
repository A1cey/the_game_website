import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import { createContext, useCallback, useEffect, useState } from "react";
import type { Session_t, Game_t, Player_t } from "@/types/database_extended.types";
import Game from "@/pages/Game";
import Session from "@/pages/Session";
import supabase from "@/utils/supabase";

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
		session_name: "",
	},
	updatePlayer: () => {},
});

const App = () => {
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
		game_state: null,
		id: "",
	});

	const [player, setPlayer] = useState<Player_t>({
		id: "",
		joined_at: "",
		name: null,
		player_game_state: null,
		session_name: "",
	});

	const updateSession = useCallback((data: Session_t) => {
		setSession(data);
	}, []);

	const updateGame = useCallback((data: Game_t) => {
		setGame(data);
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
					if (error) console.error("Error fetching session:", error);
				});

			supabase
				.from("games")
				.select()
				.eq("id", session.game_id)
				.single()
				.then(({ data, error }) => {
					if (data) updateGame(data as Game_t);
					if (error) console.error("Error fetching game:", error);
				});
		}

		if (player.id) {
			supabase
				.from("players")
				.select()
				.eq("id", player.id)
				.single()
				.then(({ data, error }) => {
					if (data) updatePlayer(data as Player_t);
					if (error) console.error("Error fetching player:", error);
				});
		}

		// Subscription
		const sessionChannel = supabase
			.channel("session-updates")
			.on(
				"postgres_changes",
				{
					schema: "public",
					table: "sessions",
					event: "UPDATE",
					filter: `name=eq.${session.name}`,
				},
				payload => {
					console.log("session changes");
					updateSession(payload.new as Session_t);
				},
			);

		const gameChannel = supabase
			.channel("game-updates")
			.on(
				"postgres_changes",
				{
					schema: "public",
					table: "games",
					event: "UPDATE",
					filter: `id=eq.${session.game_id}`,
				},
				payload => {
					console.log("game changes");
					updateGame(payload.new as Game_t);
				},
			);

		const playerChannel = supabase
			.channel("player-updates")
			.on(
				"postgres_changes",
				{
					schema: "public",
					table: "players",
					event: "UPDATE",
					filter: `id=eq.${player.id}`,
				},
				payload => {
					console.log("player changes");
					console.log(payload);
					console.log(payload.new);
					updatePlayer(payload.new as Player_t);
				},
			);

		sessionChannel.subscribe();
		gameChannel.subscribe();
		playerChannel.subscribe();

		return () => {
			sessionChannel.unsubscribe();
			gameChannel.unsubscribe();
			playerChannel.unsubscribe();
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
