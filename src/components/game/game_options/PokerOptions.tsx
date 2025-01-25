import type { PokerOptionsType_t } from "@/types/game/poker.types";
import { useEffect, useRef } from "react";

type PokerOptionsProps = PokerOptionsType_t & {
  disabled: boolean;
  setOptions: React.Dispatch<React.SetStateAction<PokerOptionsType_t>>;
};

const PokerOptions = ({ setOptions, disabled }: PokerOptionsProps) => {
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
