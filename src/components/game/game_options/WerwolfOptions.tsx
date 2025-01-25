import type { WerwolfOptionsType_t } from "@/types/game/werwolf.types";
import { useEffect, useRef } from "react";

type WerwolfOptionsProps = WerwolfOptionsType_t & {
  disabled: boolean;
  setOptions: React.Dispatch<React.SetStateAction<WerwolfOptionsType_t>>;
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
