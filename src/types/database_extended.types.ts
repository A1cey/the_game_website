import type { Json } from "@/types/database.types";
import type { Database } from "@/types/database.types";
import { Games, GameState } from "./game.types";

export type Game_t = {
	current_player: number;
	game_state: GameState<Games> | null;
	id: string;
};

export type Log_t = {
	created_at: string;
	data: Json | null;
	description: Database["public"]["Enums"]["log_event"];
	id: string | null;
	index: number;
};

export type Player_t = {
	id: string;
	joined_at: string;
	name: string | null;
	player_game_state: Json | null;
	position_in_session: number | null;
	session_name: string;
};

export type Session_t = {
	created_at: string;
	game_id: string;
	game_started_at: string | null;
	last_update_at: string;
	max_num_of_players: number;
	name: string;
	num_of_players: number;
};
