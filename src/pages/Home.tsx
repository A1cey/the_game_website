import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { useNavigate } from "react-router-dom";
import "@/index.css";
import { Input } from "@nextui-org/input";
import useGameStore from "@/hooks/useGameStore";
import usePlayerStore from "@/hooks/usePlayerStore";
import useSessionStore from "@/hooks/useSessionStore";
import { Session_t } from "@/types/database_extended.types";
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

  const updateSession = useSessionStore(state => state.updateSession);
  const resetSession = useSessionStore(state => state.resetStore);

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

  const setUp = async (name: string) => {
    if (!name) {
      console.error("No session name available.");
      return;
    }
    
    if (!await createPlayer(name)) {
      resetPlayer();
      return;
    }
    
    const gameId = await fetchSessionData(name);
    if (!gameId) {
      console.error("No game id available.: ", gameId);
      resetPlayer();
      resetSession();
      return;
    }
    
    if (!await fetchGameData(gameId)) {
      resetSession();
      resetPlayer();
      resetGame();
      return
    }

    navigate("session");
  };

  const fetchSessionData = async (sessionName: string): Promise<string> => {
    if (!sessionName) {
      console.error("No session name available.");
      return "";
    }

    const { data, error } = await supabase
      .from("sessions")
      .select()
      .eq("name", sessionName)
      .single();
    
    if (error) {
      setSessionError({
        consoleError: "Error fetching session: ",
        error,
        displayError: "Could not find session.",
      });
      return "";
    }
    
    if (data) {
      if (data.num_of_players === data.max_num_of_players) {
        setSessionError({ consoleError: "Session is full." });
        return "";
      }

      if (data.game_started_at) {
        setSessionError({ consoleError: "Session is currently in a game." });
        return "";
      }

      updateSession(data as Session_t);
      
      console.log("session data: ", data)
      
      return data.game_id;
    }
    

    return "";
  }

  const fetchGameData = async (gameId: string): Promise<boolean> => {
    if (!gameId) {
      console.error("No game id available. ", gameId);
      return false;
    }

    supabase.from("games").select().eq("id", gameId).single().then(({ data, error }) => {
      if (error) {
        setSessionError({
          consoleError: "Error fetching game: ",
          error,
          displayError: "Could not find game.",
        });
        return false;
      }
      if (data) {
        updateGame(data, "subscription");
      }
    });

    return true;
  }

  const createPlayer = async (name: string): Promise<boolean> => {
    if (!name) {
      console.error("No session name available.");
      return false;
    }    

    supabase
      .from("players")
      .insert({
        session_name: name,
        name: playerName !== "" ? playerName : null,
      })
      .select()
      .single()
      .then(({ data, error }) => {
        if (error) {
          setSessionError({
            consoleError: "Error creating players: ",
            error,
            displayError: "Could not create player.",
          });
          return false;
        }
        if (data) {
          updatePlayer(data);
        }
      });

    return true;
  };

  const createSession = async () => {
    supabase.rpc("create_session").then(({ data, error }) => {
      if (error) {
        setSessionError({
          consoleError: "Error creating session: ",
          error,
          displayError: "Could not create session.",
        });
        return;
      }
      if (data) {
        console.log("Created session: ", data);
        setUp(data);
      }
    });
  };

  const joinSession = async () => {
    console.log("Joining");

    if (sessionName.length < 6) {
      setSessionError({ consoleError: `Session names must be exactly six characters long. Current length: ${sessionName.length}.` });
      return;
    }

    setUp(sessionName);
  };

  const handleSessionNameChange = (input: string) => {
    const validCharacters = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    const invalidChars = input
      .split("")
      .filter((char) => !validCharacters.includes(char))
      .reduce<string[]>((acc, val) => {
        if (!acc.includes(val)) {
          acc.push(val);
        }
        return acc;
      }, []);

    if (input.length > 6) {
      setSessionError({ consoleError: `Session names must be exactly six characters long. Current length: ${input.length}.` });
      return;
    }

    if (invalidChars.length > 0) {
      setSessionError({
        consoleError: `Session name contains invalid characters: ${invalidChars.join(", ")}.`
      });
      return;
    }

    setIsInvalidSession(false);
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
          className="hover:scale-[1.05]"
          onChange={e => setSessionName(e.target.value)}
          isInvalid={isInvalidSession}
          errorMessage={sessionNameErrorMessage}
          onValueChange={value => handleSessionNameChange(value)}
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
