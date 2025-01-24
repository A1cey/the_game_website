import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database/database.types";
import { formatDefaultPlayerName } from "./other";
import type { GameState_t } from "@/types/game/game.types";
import { Game_t } from "@/types/database/database_extended.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;

export const removePlayerFromSession = async (playerId: string): Promise<void> => {
  if (!playerId) {
    console.error("Error removing player from session: player id not set.");
    return;
  }

  supabase
    .from("players")
    .delete()
    .eq("id", playerId)
    .then(({ error }) => {
      if (error) {
        console.error("Error removing player from session: ", error);
      }
    });
};

export const getPlayerNames = async (
  sessionName: string,
  handleTranslation: (key: string) => string,
): Promise<string[]> => {
  const { data, error } = await supabase.rpc("get_player_names", { session_name_input: sessionName });

  if (error) {
    console.error("Error fetching player list: ", error);
    return [];
  }

  return data.map(({ name }) => formatDefaultPlayerName(name, handleTranslation));
};

export const updateDBGameState = async (
  gameId: string,
  currentState: Partial<GameState_t>,
  newState: Partial<GameState_t>,
): Promise<void> => {
  if (!newState) {
    console.error("Error updating the game selection: new state not set.");
    return;
  }

  return supabase
    .from("games")
    .update({
      game_state: { ...currentState, ...newState },
    })
    .eq("id", gameId)
    .then(({ error }) => {
      if (error) {
        console.error("Error updating the game selection: ", error);
      }
    });
};

export const fetchGameData = async (gameId: string): Promise<{ gameData: Game_t | null; error: null | string }> => {
  if (!gameId) {
    return { gameData: null, error: `No game id available. ${gameId}` };
  }

  return supabase
    .from("games")
    .select()
    .eq("id", gameId)
    .single()
    .then(({ data, error }) => {
      if (error) {
        return { gameData: null, error: `Error fetching game data: ${error}` };
      }

      const res = Game_t.safeParse(data);

      if (!res.success) {
        return { gameData: null, error: `Error parsing game data: ${res.error}` };
      }

      return { gameData: res.data, error: null };
    });
};
