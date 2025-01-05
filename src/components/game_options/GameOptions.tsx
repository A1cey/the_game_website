import { type GameMap, Games } from "@/types/game.types";
import ArschlochOptions from "./ArschlochOptions";
import DurakOptions from "./DurakOptions";
import MaexleOptions from "./MaexleOptions";
import PokerOptions from "./PokerOptions";
import SchwimmenOptions from "./SchwimmenOptions";
import WerwolfOptions from "./WerwolfOptions";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import ButtonBordered from "../ui/ButtonBordered";
import useThemeStore from "@/hooks/useThemeStore";
import { useCallback } from "react";
import supabase from "@/utils/supabase";
import useGameStore from "@/hooks/useGameStore";
import useSessionStore from "@/hooks/useSessionStore";
import {
  isArschlochOptions,
  isDurakOptions,
  isMaexleOptions,
  isPokerOptions,
  isSchwimmenOptions,
  isWerwolfOptions,
} from "@/utils/type_guards";

const GameOptions = ({ currentGame }: { currentGame: Games | undefined }) => {
  const theme = useThemeStore(state => state.theme);
  const gameId = useSessionStore(state => state.session.game_id);
  const gameState = useGameStore(state => state.game.game_state);
  const gameType = gameState?.game;

  const updateGameOptionsAtDB = useCallback(
    (newOptions: GameMap[Games]["options"]) => {
      console.log("UPDATING GAME OPTIONS IN DB");

      supabase
        .from("games")
        .update({
          game_state: { ...gameState, options: newOptions },
        })
        .eq("id", gameId)
        .then(({ error }) => {
          if (error) console.error("Error updating the game options: ", error);
        });
    },
    [gameState, gameId],
  );

  const setOptions = useCallback(
    (newOptions: GameMap[Games]["options"]) => {
      updateGameOptionsAtDB(newOptions);
    },
    [updateGameOptionsAtDB],
  );

  let currentOptions = null;
  if (gameType && currentGame !== undefined) {
    switch (Number(currentGame)) {
      case Games.ARSCHLOCH:
        console.log("trying setting arschloch options with state: ", gameState.options);
        if (isArschlochOptions(gameState.options)) {
          console.log("setting arschloch options");
          currentOptions = <ArschlochOptions setOptions={setOptions} />;
        }
        break;
      case Games.DURAK:
        if (isDurakOptions(gameState.options)) {
          currentOptions = <DurakOptions setOptions={setOptions} />;
        }
        break;
      case Games.MAEXLE:
        if (isMaexleOptions(gameState.options)) {
          currentOptions = (
            <MaexleOptions
              setOptions={setOptions}
              lives={gameState.options.lives}
              passOn21={gameState.options.passOn21}
            />
          );
        }
        break;
      case Games.POKER:
        if (isPokerOptions(gameState.options)) {
          currentOptions = <PokerOptions setOptions={setOptions} />;
        }
        break;
      case Games.SCHWIMMEN:
        if (isSchwimmenOptions(gameState.options)) {
          currentOptions = <SchwimmenOptions setOptions={setOptions} />;
        }
        break;
      case Games.WERWOLF:
        if (isWerwolfOptions(gameState.options)) {
          currentOptions = <WerwolfOptions setOptions={setOptions} />;
        }
        break;
    }
  }

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <ButtonBordered disabled={!currentOptions}>Game Options</ButtonBordered>
      </PopoverTrigger>
      <PopoverContent
        className={`${theme} text-${
          theme === "dark" ? "white" : "black"
        } ${theme === "dark" ? "border-1 border-default" : ""}`}
      >
        {currentOptions || <p>No options available</p>}
      </PopoverContent>
    </Popover>
  );
};

export default GameOptions;
