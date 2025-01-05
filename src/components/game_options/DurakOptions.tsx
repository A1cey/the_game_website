import type { DurakOptionsType } from "@/types/game.types";
import { useEffect, useRef } from "react";

type LittleMaxOptionsProps = DurakOptionsType & {
  setOptions: React.Dispatch<React.SetStateAction<DurakOptionsType>>;
};

const DurakOptions = ({ setOptions }: LittleMaxOptionsProps) => {
  const hasChanged = useRef(false);

  useEffect(() => {
    // Only update if values have actually changed from user interaction
    if (!hasChanged.current) {
      return;
    }

    setOptions({});
  }, []);

  return <div>Durak Options</div>;
};

export default DurakOptions;
