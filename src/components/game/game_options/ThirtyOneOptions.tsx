import type { ThirtyOneOptionsType_t } from "@/types/game/thirty_one.types";
import { useEffect, useRef } from "react";

type ThirtyOneOptionsProps = ThirtyOneOptionsType_t & {
  disabled: boolean;
  setOptions: React.Dispatch<React.SetStateAction<ThirtyOneOptionsType_t>>;
};

const ThirtyOneOptions = ({ setOptions, disabled }: ThirtyOneOptionsProps) => {
  const hasChanged = useRef(false);

  useEffect(() => {
    // Only update if values have actually changed from user interaction
    if (!hasChanged.current) {
      return;
    }

    setOptions({});
  }, []);

  return <div>ThirtyOne Options</div>;
};

export default ThirtyOneOptions;
