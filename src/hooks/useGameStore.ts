import type { Json } from "@/types/database.types";
import type { Game_t } from "@/types/database_extended.types";
import { convertGamesJSONToGameT } from "@/utils/game";
import supabase from "@/utils/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { create } from "zustand";

const defaultGame: Game_t = {
  current_player: 1,
  game_state: null,
  id: "",
};

interface GameState {
  game: Game_t;
  subscriptionActive: boolean;
  subscription: RealtimeChannel | null;
  updateGame: (data: Json | Game_t) => void;
  subscribeToGame: (gameId: string) => void;
  unsubscribe: () => void;
}

const useGameStore = create<GameState>()((set, get) => ({
  game: defaultGame,
  subscriptionActive: false,
  subscription: null as RealtimeChannel | null,

  updateGame: (data: Json | Game_t) => {
    set(state => {
      const newGame = getNewGame(data, state.game);

      if (newGame.id && !state.subscriptionActive) {
        get().subscribeToGame(newGame.id);
      }

      return { game: newGame };
    });
  },

  subscribeToGame: (gameId: string) => {
    get().unsubscribe();

    console.log("Setting up game subscription");
    const subscription = supabase
      .channel("game-updates")
      .on(
        "postgres_changes",
        {
          schema: "public",
          table: "games",
          event: "UPDATE",
          filter: `id=eq.${gameId}`,
        },
        payload => {
          console.log("New data through game subscription: ", payload, payload.new);
          get().updateGame(convertGamesJSONToGameT(payload.new) as Game_t);
        },
      )
      .subscribe((status, error) => {
        console.log("Game subscription status: ", status);
        if (error) {
          console.error(`Error subscribing to game with id ${gameId}: ${error}`);
        }
      });

    set({ subscription, subscriptionActive: true });
  },

  unsubscribe: () => {
    const { subscription } = get();
    if (subscription) {
      subscription.unsubscribe();
      set({ subscription: null, subscriptionActive: false });
    }
  },
}));

const getNewGame = (data: Json | Game_t, old: Game_t): Game_t => {
  console.log("Updating game with: ", data);

  const newGame = convertGamesJSONToGameT(data);

  if (!newGame) {
    console.error("Bad response for game update.");
    return old;
  }

  return newGame;
};

export default useGameStore;
