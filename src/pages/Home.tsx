import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { useNavigate } from "react-router-dom";
import "@/index.css";
import { Input } from "@nextui-org/input";
import useGameStore from "@/hooks/useGameStore";
import usePlayerStore from "@/hooks/usePlayerStore";
import useSessionStore from "@/hooks/useSessionStore";
import { Game_t, Session_t } from "@/types/database_extended.types";
import ButtonBordered from "@/components/ui/ButtonBordered";
import { PostgrestError } from "@supabase/supabase-js";
import { Form } from "@nextui-org/form";

type SetSessionErrorOptions = {
  consoleError: string;
  error?: PostgrestError;
  displayError?: string;
};

const Home = () => {
  const navigate = useNavigate();

  const [sessionName, setSessionName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [sessionNameErrorMessage, setSessionNameErrorMessage] = useState("");
  const [isInvalidSession, setIsInvalidSession] = useState(false);

  const updatePlayer = usePlayerStore(state => state.updatePlayer);
  const resetPlayer = usePlayerStore(state => state.resetStore);

  const numOfPlayers = useSessionStore(state => state.session.num_of_players);
  const updateSession = useSessionStore(state => state.updateSession);
  const isSessionSubscriptionActive = useSessionStore(state => state.subscriptionActive);
  const resetSession = useSessionStore(state => state.resetStore);

  const game = useGameStore(state => state.game);
  const updateGame = useGameStore(state => state.updateGame);
  const resetGame = useGameStore(state => state.resetStore);

  useEffect(() => {
    resetSession();
    resetGame();
    resetPlayer();
  }, []);

  const setSessionError = ({ consoleError, error, displayError }: SetSessionErrorOptions) => {
    setSessionNameErrorMessage(
      error?.code === "23505"
        ? "This session name is already in use. Please try another."
        : displayError
          ? displayError
          : consoleError,
    );
    setIsInvalidSession(true);
    console.error(consoleError, error);
  };

  const setUp = async (data: Session_t) => {
    updateSession(data);

    const old_num_of_players = numOfPlayers;

    await createPlayer();

    const new_num_of_players = numOfPlayers;

    // Adds up to the correct number of players without another fetch. The subscription check and player count should assure a solid result.
    if (!isSessionSubscriptionActive && old_num_of_players === new_num_of_players) {
      updateSession({ num_of_players: numOfPlayers + 1 });
    }

    const newGame: Game_t = {
      ...game,
      id: data.game_id,
    };

    updateGame(newGame, "user");

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
          setSessionError({
            consoleError: "Error fetching players: ",
            error,
            displayError: "Could not create player.",
          });
          return;
        }
        if (data) {
          updatePlayer(data);
        }
      });
  };

  const createSession = async () => {
    if (sessionName === "") {
      setSessionError({ consoleError: "Please provide a session name." });
      return;
    }

    supabase
      .from("sessions")
      .insert({ name: sessionName })
      .select()
      .single()
      .then(async ({ data, error }) => {
        if (error) {
          setSessionError({
            consoleError: "Error fetching session: ",
            error,
            displayError: "Could not create session.",
          });
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
      setSessionError({ consoleError: "Please provide a session name." });
      return;
    }

    supabase
      .from("sessions")
      .select()
      .eq("name", sessionName)
      .single()
      .then(async ({ data, error }) => {
        if (error) {
          setSessionError({ consoleError: "Error fetching session: ", error, displayError: "Could not find session." });
          return;
        }
        if (data) {
          if (data.num_of_players === data.max_num_of_players) {
            setSessionError({ consoleError: "Session is full." });
            return;
          }

          if (data.game_started_at) {
            setSessionError({ consoleError: "Session is currently in a game." });
            return;
          }

          setUp(data);
        }
      });
  };

  return (
    <div className="grid gap-4 justify-center">
      <h1 className="mt-40 text-4xl font-bold text-center">The Game Website</h1>
      <Form>
        <Input
          label="Player Name"
          labelPlacement="outside"
          variant="bordered"
          className="hover:scale-[1.05]"
          onChange={e => setPlayerName(e.target.value)}
          validate={value => {
            if (value.length > 30) {
              return "The player name can only be a maximum of 30 characters long.";
            }
          }}
        />
        <Input
          label="Session Name"
          labelPlacement="outside"
          variant="bordered"
          isRequired
          className="hover:scale-[1.05]"
          onChange={e => setSessionName(e.target.value)}
          isInvalid={isInvalidSession}
          errorMessage={sessionNameErrorMessage}
          onValueChange={() => setIsInvalidSession(false)}
        />
        <div className="flex mt-6 gap-4 justify-center w-full">
          <ButtonBordered onPress={createSession}>Create Session</ButtonBordered>
          <ButtonBordered onPress={joinSession}>Join Session</ButtonBordered>
        </div>
      </Form>
    </div>
  );
};

export default Home;
