import type { ArschlochOptionsType } from "@/types/game.types";
import { useEffect, useRef } from "react";

type ArschlochOptionsProps = ArschlochOptionsType & {
  setOptions: React.Dispatch<React.SetStateAction<ArschlochOptionsType>>;
};

const ArschlochOptions = ({ setOptions }: ArschlochOptionsProps) => {
  const hasChanged = useRef(false);

  useEffect(() => {
    // Only update if values have actually changed from user interaction
    if (!hasChanged.current) {
      return;
    }

    setOptions({});
  }, []);

  return <div>Arschloch Options</div>;
};

export default ArschlochOptions;
