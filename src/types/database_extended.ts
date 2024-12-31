import { Json } from "./database.types"
import { Database } from "./database.types"

export type Game_t = {
  game_state: Json | null
  id: string | null
}

export type Log_t = {
  created_at: string | null
  data: Json | null
  description: Database["public"]["Enums"]["log_event"] | null
  id: string | null
  index: number | null
}

export type Player_t = {
  id: string | null
  joined_at: string | null
  name: string | null
  player_game_state: Json | null
  session_name: string | null
}

export type Session_t = {
  created_at: string | null
  game_id: string | null
  game_started_at: string | null
  last_update_at: string | null
  max_num_of_players: number | null
  name: string | null
  num_of_players: number | null
}
