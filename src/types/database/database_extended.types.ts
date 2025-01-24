import { GameState } from "../game/game.types";
import { z } from "zod";
import type{ Json } from "./database.types";

export const Json_t: z.ZodType<Json> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.record(z.string(), z.union([Json_t, z.undefined()])),
    z.array(Json_t),
  ]),
);
export type Json_t = z.infer<typeof Json_t>;

export const Game_t = z.object({
  current_player: z.number(),
  game_state: z.union([GameState, z.null()]),
  id: z.string(),
});
export type Game_t = z.infer<typeof Game_t>;

export const Player_t = z.object({
  id: z.string(),
  joined_at: z.string(),
  name: z.union([z.string(), z.null()]),
  player_game_state: z.union([Json_t, z.null()]),
  position_in_session: z.union([z.number(), z.null()]),
  session_name: z.string(),
});
export type Player_t = z.infer<typeof Player_t>;

export const Session_t = z.object({
  created_at: z.string(),
  host: z.union([z.string(), z.null()]),
  game_id: z.string(),
  game_started_at: z.union([z.string(), z.null()]),
  last_update_at: z.string(),
  max_num_of_players: z.number(),
  name: z.string(),
  num_of_players: z.number(),
});
export type Session_t = z.infer<typeof Session_t>;
