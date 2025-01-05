import type { WerwolfOptionsType } from "@/types/game.types";
import { useEffect, useRef } from "react";

type WerwolfOptionsProps = WerwolfOptionsType & {
  setOptions: React.Dispatch<React.SetStateAction<WerwolfOptionsType>>;
};

const WerwolfOptions = ({ setOptions }: WerwolfOptionsProps) => {
  const hasChanged = useRef(false);

  useEffect(() => {
    // Only update if values have actually changed from user interaction
    if (!hasChanged.current) {
      return;
    }

    setOptions({});
  }, []);

  return <div>Werwolf Options</div>;
};

export default WerwolfOptions;
