import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { useNavigate } from "react-router-dom";
import "@/index.css";
import { Input } from "@nextui-org/input";
import useGameStore from "@/hooks/useGameStore";
import usePlayerStore from "@/hooks/usePlayerStore";
import useSessionStore from "@/hooks/useSessionStore";
import type { Session_t } from "@/types/database_extended.types";
import ButtonBordered from "@/components/ui/ButtonBordered";
import type { PostgrestError } from "@supabase/supabase-js";
import { Form } from "@nextui-org/form";
import { InputOtp } from "@nextui-org/input-otp";
import { Button, Tooltip } from "@nextui-org/react";
import type { SVGElementProps } from "@/types/other.types";
import useThemeStore from "@/hooks/useThemeStore";
import { useTranslation } from "react-i18next";

type SetSessionErrorOptions = {
  consoleError: string;
  error?: PostgrestError;
  displayError?: string;
};

const Home = () => {
  const navigate = useNavigate();
   const { t } = useTranslation();
  
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

  const theme = useThemeStore(state => state.theme);

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

    if (!(await createPlayer(name))) {
      resetPlayer();
      return;
    }

    // small delay to allow the database to update
    await new Promise(resolve => setTimeout(resolve, 500));

    const gameId = await fetchSessionData(name);
    if (!gameId) {
      console.error("No game id available.: ", gameId);
      resetPlayer();
      resetSession();
      return;
    }

    if (!(await fetchGameData(gameId))) {
      resetSession();
      resetPlayer();
      resetGame();
      return;
    }

    navigate("session");
  };

  const fetchSessionData = async (sessionName: string): Promise<string> => {
    if (!sessionName) {
      console.error("No session name available.");
      return "";
    }

    const { data, error } = await supabase.from("sessions").select().eq("name", sessionName).single();

    if (error) {
      setSessionError({
        consoleError: "Error fetching session: ",
        error,
        displayError: t("sessionNotFoundError"),
      });
      return "";
    }

    if (data) {
      if (data.num_of_players > data.max_num_of_players) {
        setSessionError({ consoleError: "Session is full.", displayError: t("sessionFullError") });
        return "";
      }

      if (data.game_started_at) {
        setSessionError({ consoleError: "Session is currently in a game.", displayError: t("sessionInGameError") });
        return "";
      }

      updateSession(data as Session_t);

      console.log("session data: ", data);

      return data.game_id;
    }

    return "";
  };

  const fetchGameData = async (gameId: string): Promise<boolean> => {
    if (!gameId) {
      console.error("No game id available. ", gameId);
      return false;
    }

    supabase
      .from("games")
      .select()
      .eq("id", gameId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setSessionError({
            consoleError: "Error fetching game: ",
            error,
            displayError: t("gameNotFoundError"),
          });
          return false;
        }
        if (data) {
          updateGame(data, "subscription");
        }
      });

    return true;
  };

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
            displayError: t("playerCreationError"),
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
          displayError: t("sessionCreationError"),
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
      setSessionError({
        consoleError: `Session names must be exactly six characters long. Current length: ${sessionName.length}.`,
      });
      return;
    }

    setUp(sessionName);
  };

  const InfoIcon = ({ fill = "currentColor", filled, size, height, width, ...props }: SVGElementProps) => {
    return (
      <svg
        width={size || width || 24}
        height={size || height || 24}
        viewBox="0 0 24 24"
        fill={filled ? fill : "none"}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <circle cx="12" cy="12" r="10" stroke={fill} strokeWidth="1.5" />
        <path d="M12 17V11" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 11 9)" fill={fill} />
      </svg>
    );
  };

  return (
    <div className="grid gap-4 justify-center">
      <h1 className="mt-40 text-4xl font-bold text-center">{t("createOrJoinASession")}</h1>
      <Form className="flex flex-col items-center gap-6 w-full max-w-80 mx-auto">
        <div className="w-full">
          <Input
            label={t("playerName")}
            labelPlacement="outside"
            variant="bordered"
            className="hover:scale-[1.05]"
            onChange={e => setPlayerName(e.target.value)}
            validate={value => {
              if (value.length > 30) {
                return t("playerNameToLong");
              }
            }}
          />
        </div>
        <div className="border-2 border-default-200 dark:border-default rounded-xl w-full flex flex-col items-center">
          <div>
            <div className="pl-2 text-sm text-default-500 pt-1 inline-flex items-center gap-2">
              <span className="-translate-y-[12.5%]">{t("sessionName")}</span>
              <Tooltip
                offset={8}
                content={`${t("allowedCharacters")}: ${"23456789ABCDEFGHJKLMNPQRSTUVWXYZ".split("").join(", ")}`}
                className={`${theme} text-${theme === "dark" ? "white" : "black"} ${theme === "dark" ? "bg-default-50 border-1 border-default" : ""}`}
              >
                <Button
                  isIconOnly
                  aria-label="Session Name Information"
                  className="p-0 min-w-0 w-fit h-min bg-transparent"
                >
                  <InfoIcon size={18} className="text-default-500" />
                </Button>
              </Tooltip>
            </div>
            <InputOtp
              variant="bordered"
              className="pl-2 pr-2"
              allowedKeys={"^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]*$"}
              length={6}
              onChange={e => setSessionName((e.target as HTMLInputElement).value)}
              isInvalid={isInvalidSession}
              errorMessage={sessionNameErrorMessage || t("invalidSessionName")}
            />
          </div>
        </div>
        <div className="flex gap-4 justify-center w-full">
          <ButtonBordered onPress={createSession}>{t("createSession")}</ButtonBordered>
          <ButtonBordered onPress={joinSession}>{t("joinSession")}</ButtonBordered>
        </div>
      </Form>
    </div>
  );
};

export default Home;
