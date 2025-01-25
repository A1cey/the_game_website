import type { LittleMaxOptionsType_t } from "@/types/game/little_max.types";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type LittleMaxOptionsProps = LittleMaxOptionsType_t & {
  disabled: boolean;
  setOptions: Dispatch<SetStateAction<LittleMaxOptionsType_t>>;
};

const LittleMaxOptions = ({ disabled, setOptions, lives, passOn21 }: LittleMaxOptionsProps) => {
  const [isSelected, setIsSelected] = useState(passOn21);
  const [numOfLives, setLives] = useState(lives);
  const [debouncedLives, setDebouncedLives] = useState(lives);
  const [livesInputError, setLivesInputError] = useState("");
  const [isLivesInValid, setIsLivesInValid] = useState(false);

  const hasChanged = useRef(false);

  const { t } = useTranslation();

  useEffect(() => {
    setIsSelected(passOn21);
    setLives(lives);
    setDebouncedLives(lives);
  }, [passOn21, lives]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLives(numOfLives);
    }, 500);

    return () => clearTimeout(timer);
  }, [numOfLives]);

  useEffect(() => {
    if (!isLivesInValid && hasChanged.current) {
      setOptions({
        lives: debouncedLives,
        passOn21: isSelected,
      });
      hasChanged.current = false;
    }
  }, [isSelected, debouncedLives, setOptions]);

  const handlePassOn21Change = (input: boolean) => {
    hasChanged.current = true;
    setIsSelected(input);
  };

  const handleLivesChange = (input: string) => {
    validateLives(input);
    hasChanged.current = true;
    setLives(Number(input));
  };

  const validateLives = (input: string): void => {
    const num = Number(input);

    if (Number.isNaN(num)) {
      setLivesInputError(t("onlyNumsAllowed"));
      setIsLivesInValid(true);
      return;
    }

    if (num > 21) {
      setLivesInputError(t("tooManyLives"));
      setIsLivesInValid(true);
      return;
    }

    if (num < 1) {
      setLivesInputError(t("atLeastOneLive"));
      setIsLivesInValid(true);
      return;
    }

    setIsLivesInValid(false);
  };

  return (
    <div className="grid items-center justify-center space-x-2 gap-4 m-2">
      <Checkbox
        color="success"
        id="little-max-pass-on"
        radius="sm"
        isSelected={isSelected}
        onValueChange={handlePassOn21Change}
        disabled={disabled}
      >
        {t("passOn21")}
      </Checkbox>
      <div /* Needed for alignment */>
        <Input
          label={t("lives")}
          labelPlacement="inside"
          variant="bordered"
          className="hover:scale-[1.05] -ml-2" /* margin needed for alignment */
          value={Number.isNaN(Number(numOfLives)) ? "" : numOfLives.toString()}
          onValueChange={value => handleLivesChange(value)}
          errorMessage={livesInputError}
          isInvalid={isLivesInValid}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default LittleMaxOptions;
