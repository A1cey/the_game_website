import type { MaexleOptionsType } from "@/types/game.types";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
import { useEffect, useRef, useState } from "react";

type MaexleOptionsProps = MaexleOptionsType & {
  setOptions: React.Dispatch<React.SetStateAction<MaexleOptionsType>>;
};

const MaexleOptions = ({ setOptions, lives, passOn21 }: MaexleOptionsProps) => {
  const [isSelected, setIsSelected] = useState(passOn21);
  const [numOfLives, setLives] = useState(lives);
  const [debouncedLives, setDebouncedLives] = useState(lives);

  const hasChanged = useRef(false);

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

    if (hasChanged.current) {
      setOptions({
        lives: debouncedLives,
        passOn21: isSelected,
      });
      hasChanged.current = false;
    }
  }, [isSelected, debouncedLives, setOptions]);

  const handlePassOn21Change = (value: boolean) => {
    hasChanged.current = true;
    setIsSelected(value);
  };

  const handleLivesChange = (value: string) => {
    hasChanged.current = true;
    setLives(Number(value));
  };

  return (
    <div className="grid items-center space-x-2">
      <label
        htmlFor="maexle-pass-on"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Little Max can be passed to next player
      </label>
      <Checkbox
        color="success"
        id="maexle-pass-on"
        radius="sm"
        isSelected={isSelected}
        onValueChange={handlePassOn21Change}
      />
      <Input
        label="Lives"
        labelPlacement="outside"
        variant="bordered"
        className="hover:scale-[1.05]"
        defaultValue={lives.toString()}
        onChange={e => handleLivesChange(e.target.value)}
        validate={value => {
          if (Number(value)) {
            return "Only numbers allowed.";
          }
          if (Number(value) < 1) {
            return "You need at least one life to play.";
          }
        }}
      />
    </div>
  );
};

export default MaexleOptions;
