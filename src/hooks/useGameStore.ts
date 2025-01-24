import { Game_t } from "@/types/database/database_extended.types";
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
  updateSource: "subscription" | "user";
  resetUpdateSource: () => void;
  updateGame: (data: Partial<Game_t>, source: "subscription" | "user") => void;
  subscribeToGame: (gameId: string) => void;
  unsubscribe: () => void;
  resetStore: () => void;
}

const useGameStore = create<GameState>()((set, get) => ({
  game: defaultGame,
  subscriptionActive: false,
  subscription: null as RealtimeChannel | null,
  updateSource: "user",

  resetUpdateSource: () => set({ updateSource: "user" }),

  updateGame: (data: Partial<Game_t>, source: "subscription" | "user") => {
    set(state => {
      const newGame: Game_t = { ...state.game, ...data };

      if (newGame.id && !state.subscriptionActive) {
        get().subscribeToGame(newGame.id);
      }

      return {
        game: newGame,
        lastGameUpdateSource: source,
      };
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
          const { success, error, data } = Game_t.partial().safeParse(payload.new);

          if (!success) {
            console.error("Error parsing game data from subscription: ", error);
            return;
          }

          get().updateGame(data, "subscription");
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

  resetStore: () => {
    get().unsubscribe();
    get().resetUpdateSource();
    set({
      game: { ...defaultGame },
    });
  },
}));

export default useGameStore;
