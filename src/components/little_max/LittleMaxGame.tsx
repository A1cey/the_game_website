import { useEffect, useState } from "react";
import ButtonBordered from "../ui/ButtonBordered";
import LittleMaxGameProgress from "./LittleMaxGameProgress";
import type {
  GameProps,
  LittleMaxGameState,
  LittleMaxOldValue,
  LittleMaxOptionsType,
  PossibleLittleMaxValue,
} from "@/types/game.types";
import supabase, { getPlayerNames } from "@/utils/supabase";
import useGameStore from "@/hooks/useGameStore";
import usePlayerStore from "@/hooks/usePlayerStore";
import DiceRoll from "./Dice";
import { random } from "@/utils/other";
import useSessionStore from "@/hooks/useSessionStore";
import { useTranslation } from "react-i18next";
import { Modal, ModalBody, ModalContent, useDisclosure } from "@nextui-org/modal";
import useThemeStore from "@/hooks/useThemeStore";

const LittleMaxGame = ({ setWinner, onLivesChange }: GameProps) => {
  const positionInSession = usePlayerStore(state => state.player.position_in_session as number);
  const gameState = useGameStore(state => state.game.game_state);
  const currentPlayer = useGameStore(state => state.game.current_player);
  const namedValues = useGameStore(state => (state.game.game_state?.state as LittleMaxGameState).namedValues);
  const lieRevealed = useGameStore(state => (state.game.game_state?.state as LittleMaxGameState).lieRevealed);
  const activePlayers = useGameStore(state => (state.game.game_state?.state as LittleMaxGameState).activePlayers);
  const gameId = useGameStore(state => state.game.id);
  const sessionName = useSessionStore(state => state.session.name);
  const numOfPlayers = useSessionStore(state => state.session.num_of_players);
  const isPassOn21 = useGameStore(state => (state.game.game_state?.options as LittleMaxOptionsType).passOn21);
  const lives = useGameStore(state => (state.game.game_state?.state as LittleMaxGameState).lives);

  const [selectedValue, setSelectedValue] = useState<PossibleLittleMaxValue>(0);
  const [isSelectedAsOrHigher, setIsSelectedAsOrHigher] = useState(false);
  const [rolledValue, setRolledValue] = useState<PossibleLittleMaxValue>(0);
  const [isFirstRoll, setIsFirstRoll] = useState(true);
  const [roll, setRoll] = useState(false);
  const [lastValue, setLastValue] = useState<LittleMaxOldValue>({ value: 0, player: 1, orHigher: false });
  const [isLie, setIsLie] = useState<boolean | null>(null);
  const [lieRevealText, setLieRevealText] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const theme = useThemeStore(state => state.theme);

  const { t } = useTranslation();

  // set Winner
  useEffect(() => {
    if (activePlayers && activePlayers.length === 1) {
      supabase
        .rpc("end_game", { session_name: sessionName })
        .then(({ error }) => error && console.error(`error ending the game: ${error}`));
      getPlayerNames(sessionName, t).then(names => {
        setWinner(names[activePlayers[0] - 1]);
      });
    }
  }, [activePlayers]);

  const reset = () => {
    setSelectedValue(0);
    setRolledValue(0);
    setIsFirstRoll(true);
    setRoll(false);
    setIsSelectedAsOrHigher(false);
  };

  useEffect(() => {
    reset();
  }, [currentPlayer]);

  useEffect(() => {
    if (!namedValues) {
      return;
    }

    const len = namedValues.length;
    if (len === 0) {
      setLastValue({ value: 0, player: 1, orHigher: false });
    } else {
      setLastValue(namedValues[len - 1]);
    }
  }, [namedValues]);

  useEffect(() => {
    if (lives === undefined) {
      return;
    }

    onLivesChange(lives);
  }, [lives]);

  useEffect(() => {
    if (isLie === null) {
      return;
    }

    if (isLie) {
      setLieRevealText("LIE");
    } else {
      setLieRevealText("TRUTH");
    }

    new Promise(resolve => setTimeout(resolve, 2000)).then(() => {
      onClose();
      // player lied or revealed wrongly
      if ((!isLie && positionInSession === currentPlayer) || (isLie && positionInSession === lastValue.player)) {
        decrementLives();
      }
    });
  }, [isLie]);

  const decrementLives = () => {
    const newState = gameState?.state as LittleMaxGameState;
    const idx = newState.lives.findIndex(val => val.player === positionInSession);

    const newLives = newState.lives[idx].lives - 1;

    // remove players with 0 lives
    if (newLives === 0) {
      newState.activePlayers = newState.activePlayers.filter(pos => pos !== positionInSession);
    }

    newState.lives[idx] = { lives: newLives, player: positionInSession };
    newState.lieRevealed = false;
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
  };

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
          onOpen();
          setLieRevealText("Revealing...");

          new Promise(resolve => setTimeout(resolve, 3000)).then(() => {
            if (data.dice_value == null) {
              console.error("Could not evaluate lie. Dice value is null.");
              return;
            }

            evaluateReveal(data.dice_value as PossibleLittleMaxValue);
          });
        }
      });
  }, [lieRevealed, gameId]);

  const evaluateReveal = (diceValue: PossibleLittleMaxValue) => {
    // dice value same or higher as told value
    if (lastValue.orHigher) {
      setIsLie(diceValue >= lastValue.value);
    }
    // dice value same as told value
    else {
      setIsLie(diceValue === lastValue.value);
    }
  };

  const getRandomDiceValues = (): PossibleLittleMaxValue => {
    const a = random(1, 6);
    const b = random(1, 6);

    const result = a >= b ? a * 10 + b : b * 10 + a;

    return result as PossibleLittleMaxValue;
  };

  const rollDice = async () => {
    setRolledValue(getRandomDiceValues());
    setRoll(true);
    setIsFirstRoll(false);
  };

  const reveal = async () => {
    const newState = gameState?.state as LittleMaxGameState;
    newState.lieRevealed = true;

    await supabase
      .from("games")
      .update({ game_state: { ...gameState, state: newState } })
      .eq("id", gameId);
  };

  const rollAndPass = async () => {
    const val = getRandomDiceValues();
    setRolledValue(val);

    const newState = gameState?.state as LittleMaxGameState;
    newState.lieRevealed = false;
    newState.namedValues.push({
      player: positionInSession,
      value: selectedValue ? selectedValue : getNextValue(),
      orHigher: isSelectedAsOrHigher,
    });

    await supabase
      .from("games")
      .update({ game_state: { ...gameState, state: newState } })
      .eq("id", gameId);

    await supabase.from("little_max").update({ dice_value: val, last_player: positionInSession }).eq("game_id", gameId);

    next();
  };

  const next = () => {
    const newState = gameState?.state as LittleMaxGameState;

    // find next player
    let nextPlayer = positionInSession + 1;
    while (true) {
      if (nextPlayer > numOfPlayers) {
        nextPlayer = 1;
        continue;
      }
      if (newState.activePlayers.find(pos => pos === nextPlayer) !== undefined) {
        break;
      }
      nextPlayer++;
    }

    reset();

    supabase
      .from("games")
      .update({ game_state: { ...gameState, state: newState }, current_player: nextPlayer })
      .eq("id", gameId)
      .then(({ error }) => {
        if (error) {
          console.error(`Error occurred when updating the lives of player: ${positionInSession}, ${error}`);
        }
      });
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
    newState.lieRevealed = false;
    newState.namedValues.push({
      player: positionInSession,
      value: selectedValue ? selectedValue : rolledValue ? rolledValue : getNextValue(),
      orHigher: isSelectedAsOrHigher,
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

    next();
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
            isSelectedAsOrHigher={isSelectedAsOrHigher}
            setIsSelectedAsOrHigher={setIsSelectedAsOrHigher}
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
            {t("Reveal")}
          </ButtonBordered>
          <ButtonBordered
            onPress={rollDice}
            isDisabled={
              currentPlayer !== positionInSession || // cannot use if not current player
              !isFirstRoll // cannot use after first roll
            }
          >
            {t("Roll")}
          </ButtonBordered>
          <ButtonBordered
            onPress={rollAndPass}
            isDisabled={
              currentPlayer !== positionInSession || // cannot use if not current player
              (lastValue.value === 21 && !isPassOn21) // cannot pass on 21
            }
          >
            {`${t("Roll")} ${t("and")} ${t("PassOn", {
              value: selectedValue ? selectedValue : rolledValue && !roll ? rolledValue : getNextValue(),
              orHigher: isSelectedAsOrHigher ? t("orHigher") : "",
            })}`}
          </ButtonBordered>
          <ButtonBordered
            onPress={passOn}
            isDisabled={
              currentPlayer !== positionInSession || // cannot use if not current player
              (lastValue.value === 21 && !isPassOn21) || // cannot pass on 21
              isPlayerWhoFirstPassedLittleMax() || // cannot pass little max more than one round
              (lastValue.value === 0 && isFirstRoll) // cannot pass on without rolling in first round
            }
          >
            {t("PassOn", {
              value: selectedValue ? selectedValue : rolledValue && !roll ? rolledValue : getNextValue(),
              orHigher: isSelectedAsOrHigher ? t("orHigher") : "",
            })}
          </ButtonBordered>
        </div>
      </div>
      <Modal
        hideCloseButton={true}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        size="lg"
        className="bg-transparent shadow-none"
        classNames={{
          body: "",
          backdrop: "bg-transparent",
          wrapper: "",
        }}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalBody>
                <div className="size-full flex justify-center items-center text-5xl text-warning text-center text-nowrap bg-transparent">
                  {lieRevealText}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default LittleMaxGame;
