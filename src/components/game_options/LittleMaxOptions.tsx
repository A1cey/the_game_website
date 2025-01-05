import type { LittleMaxOptionsType } from "@/types/game.types";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
import { useEffect, useRef, useState } from "react";

type LittleMaxOptionsProps = LittleMaxOptionsType & {
  setOptions: React.Dispatch<React.SetStateAction<LittleMaxOptionsType>>;
};

const LittleMaxOptions = ({ setOptions, lives, passOn21 }: LittleMaxOptionsProps) => {
  const [isSelected, setIsSelected] = useState(passOn21);
  const [numOfLives, setLives] = useState(lives);
  const [debouncedLives, setDebouncedLives] = useState(lives);
  const [livesInputError, setLivesInputError] = useState("");
  const [isLivesInValid, setIsLivesInValid] = useState(false);

  const hasChanged = useRef(false);

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
    // Only update if values have actually changed from user interaction
    console.log("option change: ", {
      lives: debouncedLives,
      passOn21: isSelected,
    });

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
    console.log("Validating: ", num)
    
    if (Number.isNaN(num)) {
      console.log("not a number");
      setLivesInputError("Only numbers allowed.")
      setIsLivesInValid(true);
      return;
    }
    
    if (num > 21) {
      console.log("Too big")
      setLivesInputError("Too many lives. Be reasonable")
      setIsLivesInValid(true);
      return;
    }
    
    if (num < 1) {
      console.log("Too small")
      setLivesInputError("You need at least one life to play.")
      setIsLivesInValid(true);
      return;
    }
    
    setIsLivesInValid(false);
  }

  return (
    <div className="grid items-center justify-center space-x-2 gap-4 m-2">
        <Checkbox
          color="success"
          id="little-max-pass-on"
          radius="sm"
          isSelected={isSelected}
          onValueChange={handlePassOn21Change}
        > 
          Little Max can be passed to next player.
        </Checkbox>
      <div /* Needed for alignment */ >
        <Input
          label="Lives"
          labelPlacement="inside"
          variant="bordered"
          className="hover:scale-[1.05] -ml-2" /* margin needed for alignment */
          value={numOfLives.toString()}
          onValueChange={value => handleLivesChange(value)}
          errorMessage={livesInputError}
          isInvalid={isLivesInValid}
        />
      </div>
    </div>
  );
};

export default LittleMaxOptions;
