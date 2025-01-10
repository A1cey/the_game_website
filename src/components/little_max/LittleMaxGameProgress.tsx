import useGameStore from "@/hooks/useGameStore";
import useLanguageStore from "@/hooks/useLanguageStore";
import useSessionStore from "@/hooks/useSessionStore";
import { LittleMaxGameState, LittleMaxOldValue, PossibleLittleMaxValue } from "@/types/game.types";
import { getPlayerNames } from "@/utils/supabase";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type LittleMaxGameProgressProps = {
  selectedValue: PossibleLittleMaxValue;
  setSelectedValue: Dispatch<SetStateAction<PossibleLittleMaxValue>>;
  lastValue: LittleMaxOldValue;
  disabled: boolean;
};

const LittleMaxGameProgress = ({
  selectedValue,
  setSelectedValue,
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
    let playerPos = namedValues.find(value => value.value === val)?.player;
    return playerPos ? players[playerPos - 1] : "";
  };

  const divs = littleMaxValues.map(value => (
    <div
      key={value}
      onClick={() => {
        if (!disabled && !leForLittleMax(value, lastValue.value)) {
          setSelectedValue(value);
        }
      }}
      className={`
        dark:bg-transparent
        ${leForLittleMax(value, lastValue.value) || disabled ? "bg-default-500 text-default-200 dark:text-default-300" : "bg-default-300 hover:cursor-pointer"}
        ${selectedValue === value ? "ring-2 ring-warning bg-warning-300 dark:bg-warning-100 scale-110 ring-inset" : ""}
        ${value === 31 ? "rounded-l-md" : ""}
        ${value === 21 ? "rounded-r-md" : ""}
        flex flex-col justify-center w-[4.5rem]
        p-2
        `}
    >
      <button
        id={value.toString()}
        onClick={() => setSelectedValue(value)}
        disabled={leForLittleMax(value, lastValue.value) || disabled}
        className={`${leForLittleMax(value, lastValue.value) || disabled ? "" : "hover:cursor-pointer"} text-4xl`}
      >
        {value}
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
