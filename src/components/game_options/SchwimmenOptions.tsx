import type { SchwimmenOptionsType } from "@/types/game.types";
import { useEffect, useRef } from "react";

type SchwimmenOptionsProps = SchwimmenOptionsType & {
  setOptions: React.Dispatch<React.SetStateAction<SchwimmenOptionsType>>;
};

const SchwimmenOptions = ({ setOptions }: SchwimmenOptionsProps) => {
  const hasChanged = useRef(false);

  useEffect(() => {
    // Only update if values have actually changed from user interaction
    if (!hasChanged.current) {
      return;
    }

    setOptions({});
  }, []);

  return <div>Schwimmen Options</div>;
};

export default SchwimmenOptions;
