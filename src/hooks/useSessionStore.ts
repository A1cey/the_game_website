import { Session_t } from "@/types/database/database_extended.types";
import supabase from "@/utils/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { create } from "zustand";

const defaultSession: Session_t = {
  created_at: "",
  game_id: "",
  game_started_at: null,
  last_update_at: "",
  max_num_of_players: 8,
  name: "",
  num_of_players: 0,
  host: null,
};

interface SessionState {
  session: Session_t;
  subscriptionActive: boolean;
  subscription: RealtimeChannel | null;
  updateSession: (data: Partial<Session_t>) => void;
  subscribeToSession: (sessionName: string) => void;
  unsubscribe: () => void;
  resetStore: () => void;
}

const useSessionStore = create<SessionState>()((set, get) => ({
  session: defaultSession,
  subscriptionActive: false,
  subscription: null as RealtimeChannel | null,

  updateSession: (data: Partial<Session_t>) => {
    set(state => {
      const newSession = { ...state.session, ...data };

      if (data?.name && !state.subscriptionActive) {
        get().subscribeToSession(data.name);
      }

      return { session: newSession };
    });
  },

  subscribeToSession: (sessionName: string) => {
    get().unsubscribe();

    console.log("Setting up session subscription");

    const subscription = supabase
      .channel("session-updates")
      .on(
        "postgres_changes",
        {
          schema: "public",
          table: "sessions",
          event: "UPDATE",
          filter: `name=eq.${sessionName}`,
        },
        payload => {
          console.log("New data through session subscription: ", payload, payload.new);

          const { success, error, data } = Session_t.partial().safeParse(payload.new);

          if (!success) {
            console.error("Error parsing session data from subscription: ", error);
            return;
          }

          get().updateSession(data);
        },
      )
      .subscribe((status, error) => {
        console.log("Session subscription status: ", status);
        if (error) {
          console.error(`Error subscribing to session with name ${sessionName}: ${error}`);
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
    set({ session: { ...defaultSession } });
  },
}));

export default useSessionStore;
