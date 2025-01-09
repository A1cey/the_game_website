import { useEffect, useState } from "react";
import ButtonBordered from "../ui/ButtonBordered";
import LittleMaxGameProgress from "./LittleMaxGameProgress";
import {
  LittleMaxGameState,
  LittleMaxOldValue,
  LittleMaxOptionsType,
  PossibleLittleMaxValue,
} from "@/types/game.types";
import supabase from "@/utils/supabase";
import useGameStore from "@/hooks/useGameStore";
import usePlayerStore from "@/hooks/usePlayerStore";
import DiceRoll from "./Dice";
import { random } from "@/utils/other";
import useSessionStore from "@/hooks/useSessionStore";

const LittleMaxGame = () => {
  const positionInSession = usePlayerStore(state => state.player.position_in_session as number);
  const gameState = useGameStore(state => state.game.game_state);
  const currentPlayer = useGameStore(state => state.game.current_player);
  const namedValues = useGameStore(state => (state.game.game_state?.state as LittleMaxGameState).namedValues);
  const lieRevealed = useGameStore(state => (state.game.game_state?.state as LittleMaxGameState).lie_revealed);
  const gameId = useGameStore(state => state.game.id);
  const sessionName = useSessionStore(state => state.session.name);
  const isPassOn21 = useGameStore(state => (state.game.game_state?.options as LittleMaxOptionsType).passOn21);

  const [selectedValue, setSelectedValue] = useState<PossibleLittleMaxValue>(0);
  const [rolledValue, setRolledValue] = useState<PossibleLittleMaxValue>(0);
  const [isFirstRoll, setIsFirstRoll] = useState(true);
  const [roll, setRoll] = useState(false);
  const [lastValue, setLastValue] = useState<LittleMaxOldValue>({ value: 0, player: 1 });
  const [isLie, setIsLie] = useState<boolean | null>(null);

  const reset = () => {
    setSelectedValue(0);
    setRolledValue(0);
    setIsFirstRoll(true);
    setRoll(false);
  };

  useEffect(() => {
    reset();
  }, [currentPlayer]);

  useEffect(() => {
    const len = namedValues.length;
    if (len === 0) {
      setLastValue({ value: 0, player: 1 });
    } else {
      setLastValue(namedValues[len - 1]);
    }
  }, [namedValues]);

  useEffect(() => {
    if (isLie === null) {
      return;
    }

    // player lied or revealed wrongly
    if ((!isLie && positionInSession === currentPlayer) || (isLie && positionInSession === lastValue.player)) {
      const newState = gameState?.state as LittleMaxGameState;
      const idx = newState.lives.findIndex(val => val.player === positionInSession);

      newState.lives[idx] = { lives: newState.lives[idx].lives - 1, player: positionInSession };
      newState.lie_revealed = false;
      newState.namedValues = [];

      reset();

      supabase
        .from("games")
        .update({ game_state: { ...gameState, state: newState }, current_player: positionInSession })
        .eq("id", gameId)
        .then(({ error }) => {
          if (error) {
            console.error(`Error occurred when updating the lives of player: ${positionInSession}, ${error}`);
          }
        });
    }
  }, [isLie]);

  useEffect(() => {
    if (!lieRevealed) {
      setIsLie(null);
      return;
    }

    supabase
      .from("little_max")
      .select()
      .eq("game_id", gameId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error(`Error quering DB little_max: ${error}`);
        }
        if (data) {
          console.log(data);

          if (data.dice_value && (data.dice_value as PossibleLittleMaxValue) !== lastValue.value) {
            setIsLie(true);
          } else {
            setIsLie(false);
          }
        }
      });
  }, [lieRevealed, gameId]);

  const getRandomDiceValues = (): PossibleLittleMaxValue => {
    const a = random(1, 6);
    const b = random(1, 6);

    const result = a >= b ? a * 10 + b : b * 10 + a;

    return result as PossibleLittleMaxValue;
  };

  const rollDice = () => {
    setRolledValue(getRandomDiceValues());
    setRoll(true);
    setIsFirstRoll(false);
  };

  const reveal = async () => {
    const newState = gameState?.state as LittleMaxGameState;
    newState.lie_revealed = true;

    await supabase
      .from("games")
      .update({ game_state: { ...gameState, state: newState } })
      .eq("id", gameId);
  };

  const rollAndPass = async () => {
    const val = getRandomDiceValues();
    setRolledValue(val);

    const newState = gameState?.state as LittleMaxGameState;
    newState.lie_revealed = false;
    newState.namedValues.push({
      player: positionInSession,
      value: selectedValue ? selectedValue : getNextValue(),
    });

    await supabase
      .from("games")
      .update({ game_state: { ...gameState, state: newState } })
      .eq("id", gameId);

    await supabase.from("little_max").update({ dice_value: val, last_player: positionInSession }).eq("game_id", gameId);

    await next();
  };

  const next = async () => {
    await supabase.rpc("next_player", { session_name_input: sessionName });
    reset();
  };

  const getNextValue = (): PossibleLittleMaxValue => {
    const possibleVals: PossibleLittleMaxValue[] = [
      31, 32, 41, 42, 43, 51, 52, 53, 54, 61, 62, 63, 64, 65, 11, 22, 33, 44, 55, 66, 21,
    ];
    console.log(lastValue.value);
    const lastIdx = possibleVals.findIndex(x => x === lastValue.value);
    console.log(lastIdx);
    const nextIdx = lastIdx === -1 ? 0 : lastIdx < possibleVals.length - 1 ? lastIdx + 1 : isPassOn21 ? lastIdx : -1; // Should not be possible, player would have to reveal
    return possibleVals[nextIdx];
  };

  const passOn = async () => {
    const newState = gameState?.state as LittleMaxGameState;
    newState.lie_revealed = false;
    newState.namedValues.push({
      player: positionInSession,
      value: selectedValue ? selectedValue : rolledValue ? rolledValue : getNextValue(),
    });

    await supabase
      .from("games")
      .update({ game_state: { ...gameState, state: newState } })
      .eq("id", gameId);

    // if player did not roll use previous value
    if (rolledValue === 0) {
      supabase
        .from("little_max")
        .select()
        .eq("game_id", gameId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error(`Error quering DB little_max: ${error}`);
          }
          if (data) {
            setRolledValue(data.dice_value as PossibleLittleMaxValue);
          }
        });
    }

    await supabase
      .from("little_max")
      .update({ dice_value: rolledValue, last_player: positionInSession })
      .eq("game_id", gameId);

    await next();
  };

  const isPlayerWhoFirstPassedLittleMax = (): boolean => {
    return lastValue.value === 21 && lastValue.player === positionInSession;
  };

  return (
    <div className="flex flex-col justify-between h-[70vh]">
      <div className="h-full pt-8">
        <div className="flex justify-center gap-20 p-16">
          <DiceRoll num={Math.floor(rolledValue / 10)} roll={roll} setRoll={setRoll} />
          <DiceRoll num={rolledValue % 10} roll={roll} setRoll={setRoll} />
        </div>
        <p className="text-center text-6xl">
          {rolledValue && currentPlayer === positionInSession && !roll ? rolledValue : ""}
        </p>
      </div>
      <div className="flex flex-col justify-center gap-4 pl-4 pr-4 pt-3 ">
        <div className="justify-center flex">
          <LittleMaxGameProgress
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            lastValue={lastValue}
            disabled={currentPlayer !== positionInSession}
          />
        </div>
        <div className="flex justify-center gap-4">
          <ButtonBordered
            onPress={reveal}
            isDisabled={
              lastValue.value === 0 || // cannot use in first round
              currentPlayer !== positionInSession || // cannot use if not current player
              !isFirstRoll // cannot use after first roll
            }
          >
            Reveal
          </ButtonBordered>
          <ButtonBordered
            onPress={rollDice}
            isDisabled={
              currentPlayer !== positionInSession || // cannot use if not current player
              !isFirstRoll // cannot use after first roll
            }
          >
            Roll
          </ButtonBordered>
          <ButtonBordered
            onPress={rollAndPass}
            isDisabled={
              currentPlayer !== positionInSession || // cannot use if not current player
              (lastValue.value === 21 && !isPassOn21) // cannot pass on 21
            }
          >
            Roll and Pass On
          </ButtonBordered>
          <ButtonBordered
            onPress={passOn}
            isDisabled={
              currentPlayer !== positionInSession || // cannot use if not current player
              (lastValue.value === 21 && !isPassOn21) || // cannot pass on 21
              isPlayerWhoFirstPassedLittleMax() // cannot pass little max more than one round
            }
          >
            Pass On
          </ButtonBordered>
        </div>
      </div>
    </div>
  );
};

export default LittleMaxGame;
