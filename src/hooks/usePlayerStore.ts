import type { Json } from "@/types/database.types";
import type { Player_t } from "@/types/database_extended.types";
import supabase, { removePlayerFromSession } from "@/utils/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { create } from "zustand";

const defaultPlayer: Player_t = {
  id: "",
  joined_at: "",
  name: null,
  player_game_state: null,
  position_in_session: 0,
  session_name: "",
};

interface PlayerState {
  player: Player_t;
  subscriptionActive: boolean;
  subscription: RealtimeChannel | null;
  updatePlayer: (data: Json | Partial<Player_t>) => void;
  subscribeToPlayer: (gameId: string) => void;
  unsubscribe: () => void;
  resetStore: () => void;
}

const usePlayerStore = create<PlayerState>()((set, get) => ({
  player: defaultPlayer,
  subscriptionActive: false,
  subscription: null as RealtimeChannel | null,

  updatePlayer: (data: Json | Partial<Player_t>) => {
    set(state => {
      const newPlayer = data as Player_t;

      if (newPlayer?.id && !state.subscriptionActive) {
        get().subscribeToPlayer(newPlayer.id);
      }

      return { player: { ...state.player, ...newPlayer } };
    });
  },

  subscribeToPlayer: (playerId: string) => {
    get().unsubscribe();

    console.log("Setting up player subscription");
    const subscription = supabase
      .channel("player-updates")
      .on(
        "postgres_changes",
        {
          schema: "public",
          table: "players",
          event: "UPDATE",
          filter: `id=eq.${playerId}`,
        },
        payload => {
          console.log("New data through player subscription: ", payload, payload.new);
          get().updatePlayer(payload.new);
        },
      )
      .subscribe((status, error) => {
        console.log("Player subscription status:", status);
        if (error) {
          console.error(`Error subscribing to player with id ${playerId}: `, error);
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

  resetStore: async () => {
    if (get().player.id){
      await removePlayerFromSession(get().player.id);
    }
    get().unsubscribe();
    set({ player: { ...defaultPlayer } });
  },
}));

export default usePlayerStore;
