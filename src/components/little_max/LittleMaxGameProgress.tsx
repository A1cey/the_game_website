import useGameStore from "@/hooks/useGameStore";
import useLanguageStore from "@/hooks/useLanguageStore";
import useSessionStore from "@/hooks/useSessionStore";
import type { LittleMaxGameState,  LittleMaxOldValue,  PossibleLittleMaxValue } from "@/types/game.types";
import { getPlayerNames } from "@/utils/supabase";
import { type Dispatch,type SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type LittleMaxGameProgressProps = {
  selectedValue: PossibleLittleMaxValue;
  setSelectedValue: Dispatch<SetStateAction<PossibleLittleMaxValue>>;
  isSelectedAsOrHigher: boolean;
  setIsSelectedAsOrHigher: Dispatch<SetStateAction<boolean>>;
  lastValue: LittleMaxOldValue;
  disabled: boolean;
};

const LittleMaxGameProgress = ({
  selectedValue,
  setSelectedValue,
  isSelectedAsOrHigher,
  setIsSelectedAsOrHigher,
  lastValue,
  disabled,
}: LittleMaxGameProgressProps) => {
  const namedValues = useGameStore(state => (state.game.game_state?.state as LittleMaxGameState).namedValues);
  const sessionName = useSessionStore(state => state.session.name);
  const playerCount = useSessionStore(state => state.session.num_of_players);
  const [players, setPlayers] = useState<string[]>([]);

  const { t } = useTranslation();
  const language = useLanguageStore(state => state.lang);

  useEffect(() => {
    getPlayerNames(sessionName, t).then(playerNames => setPlayers(playerNames));
  }, [playerCount, sessionName, language]);

  const littleMaxValues: PossibleLittleMaxValue[] = [
    31, 32, 41, 42, 43, 51, 52, 53, 54, 61, 62, 63, 64, 65, 11, 22, 33, 44, 55, 66, 21,
  ];

  const leForLittleMax = (a: PossibleLittleMaxValue, b: PossibleLittleMaxValue): boolean => {
    const idxA = littleMaxValues.findIndex(x => x === a);
    const idxB = littleMaxValues.findIndex(x => x === b);

    return idxA <= idxB;
  };

  const getPlayerForPos = (val: number): string => {
    if (!namedValues) {
      return "";
    }
    const playerPos = namedValues.find(value => value.value === val)?.player;
    return playerPos ? players[playerPos - 1] : "";
  };

  const handleSelectedValue = (value: PossibleLittleMaxValue) => {
    // new value selected
    if (selectedValue !== value) {
      setIsSelectedAsOrHigher(false);
      setSelectedValue(value);
    }
    // if clicked on already selected value
    else {
      // if or higher not selected
      if (!isSelectedAsOrHigher && value !== 21) {
        setIsSelectedAsOrHigher(true);
      }
      // reset selection
      else {
        setSelectedValue(0);
        setIsSelectedAsOrHigher(false);
      }
    }
  };

  const divs = littleMaxValues.map(value => (
    <div
      key={value}
      onKeyDown={() => {
        if (!disabled && !leForLittleMax(value, lastValue.value)) {
          handleSelectedValue(value);
        }
      }}
      className={`
        dark:bg-transparent
        ${leForLittleMax(value, 66) && !leForLittleMax(value, 65) ? "text-primary-600" : ""}
        ${value === 21 ? "text-warning-700 dark:text-warning-400" : ""}
        ${leForLittleMax(value, lastValue.value) || disabled ? "bg-default-500 text-default-200 dark:text-default-300" : "bg-default-300 hover:cursor-pointer"}
        ${
          selectedValue === value
            ? isSelectedAsOrHigher
              ? "ring-2 ring-success-600 dark:ring-success-500 bg-success-400 dark:bg-success-200 scale-110 ring-inset"
              : "ring-2 ring-warning bg-warning-300 dark:bg-warning-100 scale-110 ring-inset"
            : ""
        }
        ${value === 31 ? "rounded-l-md" : ""}
        ${value === 21 ? "rounded-r-md" : ""}
        flex flex-col justify-center w-[4.5rem]
        p-2
        `}
    >
      <button
        id={value.toString()}
        onClick={() => handleSelectedValue(value)}
        disabled={leForLittleMax(value, lastValue.value) || disabled}
        className={`${leForLittleMax(value, lastValue.value) || disabled ? "" : "hover:cursor-pointer"} text-4xl`}
      >
        {`${lastValue.orHigher && lastValue.value === value ? `>${value}` : value}`}
      </button>
      <label
        htmlFor={value.toString()}
        className={`
          ${leForLittleMax(value, lastValue.value) || disabled ? "" : "hover:cursor-pointer"} 
          text-xxs min-h-4 truncate text-center
          `}
      >
        {getPlayerForPos(value)}
      </label>
    </div>
  ));

  return (
    <div
      className={`
      flex w-fit 
      dark:border-2 dark:border-primary rounded-lg
      gap-1
      bg-transparent`}
    >
      {divs}
    </div>
  );
};

export default LittleMaxGameProgress;
