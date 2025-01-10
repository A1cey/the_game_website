import { type GameMap, Games } from "@/types/game.types";
import AssholeOptions from "./AssholeOptions";
import DurakOptions from "./DurakOptions";
import LittleMaxOptions from "./LittleMaxOptions";
import PokerOptions from "./PokerOptions";
import ThirtyOneOptions from "./ThirtyOneOptions";
import WerwolfOptions from "./WerwolfOptions";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import ButtonBordered from "../ui/ButtonBordered";
import useThemeStore from "@/hooks/useThemeStore";
import { useCallback } from "react";
import supabase from "@/utils/supabase";
import useGameStore from "@/hooks/useGameStore";
import useSessionStore from "@/hooks/useSessionStore";
import {
  isAssholeOptions,
  isDurakOptions,
  isLittleMaxOptions,
  isPokerOptions,
  isThirtyOneOptions,
  isWerwolfOptions,
} from "@/utils/type_guards";
import { useTranslation } from "react-i18next";

const GameOptions = () => {
  const theme = useThemeStore(state => state.theme);
  const gameId = useSessionStore(state => state.session.game_id);
  const gameState = useGameStore(state => state.game.game_state);
  const currentGame = useGameStore(state => state.game.game_state?.game);
  const gameType = gameState?.game;

  const { t } = useTranslation();

  const updateGameOptionsAtDB = useCallback(
    (newOptions: GameMap[Games]["options"]) => {
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
    (newOptions: GameMap[Games]["options"]) => {
      console.log("updating options at db");
      updateGameOptionsAtDB(newOptions);
    },
    [updateGameOptionsAtDB],
  );

  let currentOptions = null;
  if (gameType && currentGame !== undefined) {
    console.log("settzing options with state: ", gameState.options)
    
    const game = Games[gameType as unknown as keyof typeof Games] as unknown as Games;
    switch (Number(game)) {
      case Games.ASSHOLE:
        if (isAssholeOptions(gameState.options)) {
          currentOptions = <AssholeOptions setOptions={setOptions} />;
        }
        break;
      case Games.DURAK:
        if (isDurakOptions(gameState.options)) {
          currentOptions = <DurakOptions setOptions={setOptions} />;
        }
        break;
      case Games.LITTLE_MAX:
        if (isLittleMaxOptions(gameState.options)) {
          currentOptions = (
            <LittleMaxOptions
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
      case Games.THIRTY_ONE:
        if (isThirtyOneOptions(gameState.options)) {
          currentOptions = <ThirtyOneOptions setOptions={setOptions} />;
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
      <PopoverTrigger className="hover:scale-105">
        <ButtonBordered disabled={!currentOptions}>{t("gameOptions")}</ButtonBordered>
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
