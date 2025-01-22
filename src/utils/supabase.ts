import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { formatDefaultPlayerName } from "./other";
import { Games, GameState, JSONGameState } from "@/types/game.types";

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
  }

  if (data) {
    return data.map(({ name }) => formatDefaultPlayerName(name, handleTranslation));
  }

  return [];
};

export const updateDBGameState = async <T extends Games>(
  gameId: string,
  currentState: GameState<T> | {},
  newState: Partial<JSONGameState<T>> | {},
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

export const fetchGameData = async (gameId: string) => {
  if (!gameId) {
    console.error("No game id available. ", gameId);
    return;
  }

  return await supabase
    .from("games")
    .select()
    .eq("id", gameId)
    .single()
    .then(({ data, error }) => {
      return { data, error };
    });
};
