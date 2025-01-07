import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;

export const removePlayerFromSession = async (playerId: string) => {
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
