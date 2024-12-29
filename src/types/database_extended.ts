export type Session_t = {
  id: string | null
  game_id: string | null
  name: string | null
}

export type Game_t = {
  id: string | null
  options: JSON | null
  type: string | null
}

export type Player_t = {
  id: string 
  session_id: string | null
}
