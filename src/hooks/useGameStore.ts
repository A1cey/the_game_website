import type { Json } from "@/types/database.types";
import type { Game_t } from "@/types/database_extended.types";
import { Games } from "@/types/game.types";
import { convertGamesJSONToGameT, defaultGameState } from "@/utils/game";
import { getEnumValues } from "@/utils/other";
import supabase from "@/utils/supabase";
import { isPartialGameT } from "@/utils/type_guards";
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
  updateGame: (data: Json | Partial<Game_t>, source: "subscription" | "user") => void;
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

  updateGame: (data: Json | Partial<Game_t>, source: "subscription" | "user") => {
    set(state => {
      const newGame = isPartialGameT(data) ? { ...state.game, ...data } : getNewGame(data, state.game);

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
          get().updateGame(convertGamesJSONToGameT(payload.new) as Game_t, "subscription");
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

const getNewGame = (data: Json, old: Game_t): Game_t => {
  console.log("Updating game with: ", data);

  const newGame = convertGamesJSONToGameT(data);

  if (!newGame) {
    console.error("Bad response for game update.");
    return old;
  }

  if (newGame.game_state === null) {
    newGame.game_state = defaultGameState(
      Games[Object.keys(Games).filter(key => Number.isNaN(Number(key)))[0] as keyof typeof Games],
    );
  }

  return newGame;
};

export default useGameStore;
