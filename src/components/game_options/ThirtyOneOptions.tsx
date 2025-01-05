import type { ThirtyOneOptionsType } from "@/types/game.types";
import { useEffect, useRef } from "react";

type ThirtyOneOptionsProps = ThirtyOneOptionsType & {
  setOptions: React.Dispatch<React.SetStateAction<ThirtyOneOptionsType>>;
};

const ThirtyOneOptions = ({ setOptions }: ThirtyOneOptionsProps) => {
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
