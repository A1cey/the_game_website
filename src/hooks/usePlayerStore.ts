import { Player_t } from "@/types/database/database_extended.types";
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
  updatePlayer: (data: Partial<Player_t>) => void;
  subscribeToPlayer: (gameId: string) => void;
  unsubscribe: () => void;
  resetStore: () => void;
}

const usePlayerStore = create<PlayerState>()((set, get) => ({
  player: defaultPlayer,
  subscriptionActive: false,
  subscription: null as RealtimeChannel | null,

  updatePlayer: (data: Partial<Player_t>) => {
    set(state => {
      const newPlayer = { ...state.player, ...data };

      if (data?.id && !state.subscriptionActive) {
        get().subscribeToPlayer(data.id);
      }

      return { player: newPlayer };
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

          const { success, error, data } = Player_t.partial().safeParse(payload.new);

          if (!success) {
            console.error("Error parsing player data from subscription: ", error);
            return;
          }

          get().updatePlayer(data);
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
    if (get().player.id) {
      await removePlayerFromSession(get().player.id);
    }
    get().unsubscribe();
    set({ player: { ...defaultPlayer } });
  },
}));

export default usePlayerStore;
