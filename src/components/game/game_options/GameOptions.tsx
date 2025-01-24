import AssholeOptions from "./AssholeOptions";
import DurakOptions from "./DurakOptions";
import LittleMaxOptions from "./LittleMaxOptions";
import PokerOptions from "./PokerOptions";
import ThirtyOneOptions from "./ThirtyOneOptions";
import WerwolfOptions from "./WerwolfOptions";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import useThemeStore from "@/hooks/useThemeStore";
import { useCallback } from "react";
import supabase from "@/utils/supabase";
import useGameStore from "@/hooks/useGameStore";
import useSessionStore from "@/hooks/useSessionStore";

import { useTranslation } from "react-i18next";
import { type GameState_t, GameType } from "@/types/game/game.types";
import type{ Json } from "@/types/database/database.types";
import { LittleMaxOptionsType } from "@/types/game/little_max.types";
import ButtonBordered from "@/components/ui/ButtonBordered";
import { DurakOptionsType } from "@/types/game/durak.types";
import { AssholeOptionsType } from "@/types/game/asshole.types";
import { PokerOptionsType } from "@/types/game/poker.types";
import { ThirtyOneOptionsType } from "@/types/game/thirty_one.types";
import { WerwolfOptionsType } from "@/types/game/werwolf.types";

const GameOptions = () => {
  const theme = useThemeStore(state => state.theme);
  const gameId = useSessionStore(state => state.session.game_id);
  const gameState = useGameStore(state => state.game.game_state);
  const currentGame = useGameStore(state => state.game.game_state?.game || GameType.enum.ASSHOLE);
  const gameType = gameState?.game;

  const { t } = useTranslation();

  const updateGameOptionsAtDB = useCallback(
    (newOptions: Json) => {
      supabase
        .from("games")
        .update({
          game_state: { ...gameState, options: newOptions },
        })
        .eq("id", gameId)
        .then(({ error }) => {
          if (error) {
            console.error("Error updating the game options: ", error);
          }
        });
    },
    [gameState, gameId],
  );

  const setOptions = useCallback(
    (newOptions: any) => {
      console.log("updating options at db");
      updateGameOptionsAtDB(newOptions.options);
    },
    [updateGameOptionsAtDB],
  );

  let currentOptions = null;
  if (gameType && currentGame !== undefined) {
    console.log("setting options with state: ", gameState.options);

    switch (currentGame) {
      case GameType.enum.ASSHOLE:
        currentOptions = getAssholeOptions(gameState, setOptions);
        break;
      case GameType.enum.DURAK:
        currentOptions = getDurakOptions(gameState, setOptions);
        break;
      case GameType.enum.LITTLE_MAX:
        currentOptions = getLittleMaxOptions(gameState, setOptions);
        break;
      case GameType.enum.POKER:
        currentOptions = getPokerOptions(gameState, setOptions);
        break;
      case GameType.enum.THIRTY_ONE:
        currentOptions = getThirtyOneOptions(gameState, setOptions);
        break;
      case GameType.enum.WERWOLF:
        currentOptions = getWerwolfOptions(gameState, setOptions);
        break;
    }
  }

  return (
    <Popover placement="bottom">
      <PopoverTrigger className="hover:scale-105">
        <ButtonBordered disabled={!currentOptions} className="shrink-0">
          {t("gameOptions")}
        </ButtonBordered>
      </PopoverTrigger>
      <PopoverContent
        className={`${theme} text-${
          theme === "dark" ? "white" : "black"
        } ${theme === "dark" ? "border-1 border-default" : ""}`}
      >
        {currentOptions || <p>{t("noOptionsAvailable")}</p>}
      </PopoverContent>
    </Popover>
  );
};

export default GameOptions;

const getAssholeOptions = (gameState: GameState_t, setOptions: (newOptions: any) => void) => {
  const { success, error, data } = AssholeOptionsType.safeParse(gameState.options);

  if (!success) {
    console.error("Error parsing little max options: ", error);
    return null;
  }

  return <AssholeOptions setOptions={setOptions} {...data} />;
};

const getDurakOptions = (gameState: GameState_t, setOptions: (newOptions: any) => void) => {
  const { success, error, data } = DurakOptionsType.safeParse(gameState.options);

  if (!success) {
    console.error("Error parsing little max options: ", error);
    return null;
  }

  return <DurakOptions setOptions={setOptions} {...data} />;
};

const getLittleMaxOptions = (gameState: GameState_t, setOptions: (newOptions: any) => void) => {
  const { success, error, data } = LittleMaxOptionsType.safeParse(gameState.options);

  if (!success) {
    console.error("Error parsing little max options: ", error);
    return null;
  }

  return <LittleMaxOptions setOptions={setOptions} {...data} />;
};

const getPokerOptions = (gameState: GameState_t, setOptions: (newOptions: any) => void) => {
  const { success, error, data } = PokerOptionsType.safeParse(gameState.options);

  if (!success) {
    console.error("Error parsing little max options: ", error);
    return null;
  }

  return <PokerOptions setOptions={setOptions} {...data} />;
};

const getThirtyOneOptions = (gameState: GameState_t, setOptions: (newOptions: any) => void) => {
  const { success, error, data } = ThirtyOneOptionsType.safeParse(gameState.options);

  if (!success) {
    console.error("Error parsing little max options: ", error);
    return null;
  }

  return <ThirtyOneOptions setOptions={setOptions} {...data} />;
};

const getWerwolfOptions = (gameState: GameState_t, setOptions: (newOptions: any) => void) => {
  const { success, error, data } = WerwolfOptionsType.safeParse(gameState.options);

  if (!success) {
    console.error("Error parsing little max options: ", error);
    return null;
  }

  return <WerwolfOptions setOptions={setOptions} {...data} />;
};
