import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { useNavigate } from "react-router-dom";
import "@/index.css";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import useGameStore from "@/hooks/useGameStore";
import usePlayerStore from "@/hooks/usePlayerStore";
import useSessionStore from "@/hooks/useSessionStore";
import { Game_t, Session_t } from "@/types/database_extended.types";
import ButtonBordered from "@/components/ButtonBordered";

const Home = () => {
  const navigate = useNavigate();

  const [sessionName, setSessionName] = useState("");
  const [playerName, setPlayerName] = useState("");

  const updatePlayer = usePlayerStore(state => state.updatePlayer);
  const { session, updateSession, subscriptionActive } = useSessionStore();
  const { game, updateGame } = useGameStore();

  useEffect(() => {
    useSessionStore.getState().unsubscribe();
    useGameStore.getState().unsubscribe();
    usePlayerStore.getState().unsubscribe();
  }, [])

  const setUp = async (data: Session_t) => {
    updateSession(data);

    const old_num_of_players = session.num_of_players;

    await createPlayer();

    const new_num_of_players = session.num_of_players;

    // Adds up to the correct number of players without another fetch. The subscription check and player count should assure a solid result.
    if (!subscriptionActive && old_num_of_players === new_num_of_players) {
      console.log(session)
      updateSession({ ...session, num_of_players: session.num_of_players + 1 })
    }

    const newGame: Game_t = {
      ...game,
      id: data.game_id,
    };

    updateGame(newGame);

    navigate("session");
  };

  const createPlayer = async () => {
    supabase
      .from("players")
      .insert({
        session_name: sessionName,
        name: playerName !== "" ? playerName : null,
      })
      .select()
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching session:", error);
          return;
        }
        if (data) {
          updatePlayer(data);
        }
      });
  };

  const createSession = async () => {
    if (sessionName === "") {
      console.error("Please provide Session Name");
      return;
    }

    supabase
      .from("sessions")
      .insert({ name: sessionName })
      .select()
      .single()
      .then(async ({ data, error }) => {
        if (error) {
          console.error("Error fetching session:", error);
          return;
        }
        if (data) {
          setUp(data);
        }
      });
  };

  const joinSession = async () => {
    console.log("Joining");

    if (sessionName === "") {
      console.error(" Please provide a session name.");
      return;
    }

    supabase
      .from("sessions")
      .select()
      .eq("name", sessionName)
      .single()
      .then(async ({ data, error }) => {
        if (error) {
          console.error("Error fetching session:", error);
          return;
        }
        if (data) {
          if (data.num_of_players === data.max_num_of_players) {
            console.warn("Session is full.");
            return;
          }

          if (data.game_started_at) {
            console.warn("Session is currently in a game.");
            return;
          }

          setUp(data);
        }
      });
  };

  return (
    <div className="grid gap-4 justify-center">
      <h1 className="mt-40 text-4xl font-bold text-center">The Game Website</h1>

      <Input
        variant="bordered"
        className="mt-20 hover:scale-[1.05]  "
        placeholder="Player Name"
        onChange={e => setPlayerName(e.target.value)}
      />
      <Input
        variant="bordered"
        isRequired
        className="hover:scale-[1.05]"
        placeholder="Session Name"
        onChange={e => setSessionName(e.target.value)}
      />
      <div className="flex gap-4 justify-center">
        <ButtonBordered onPress={createSession}>Create Session</ButtonBordered>
        <ButtonBordered onPress={joinSession}>Join Session</ButtonBordered>
      </div>
    </div>
  );
};

export default Home;
