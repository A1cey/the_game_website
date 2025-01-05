import type { PokerOptionsType } from "@/types/game.types";
import { useEffect, useRef } from "react";

type PokerOptionsProps = PokerOptionsType & {
  setOptions: React.Dispatch<React.SetStateAction<PokerOptionsType>>;
};

const PokerOptions = ({ setOptions }: PokerOptionsProps) => {
  const hasChanged = useRef(false);

  useEffect(() => {
    // Only update if values have actually changed from user interaction
    if (!hasChanged.current) {
      return;
    }

    setOptions({});
  }, []);

  return <div>Poker Options</div>;
};

export default PokerOptions;
