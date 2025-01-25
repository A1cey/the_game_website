import type { AssholeOptionsType_t } from "@/types/game/asshole.types";
import { useEffect, useRef } from "react";

type AssholeOptionsProps = AssholeOptionsType_t & {
  disabled: boolean;
  setOptions: React.Dispatch<React.SetStateAction<AssholeOptionsType_t>>;
};

const AssholeOptions = ({ setOptions, disabled }: AssholeOptionsProps) => {
  const hasChanged = useRef(false);

  useEffect(() => {
    // Only update if values have actually changed from user interaction
    if (!hasChanged.current) {
      return;
    }

    setOptions({});
  }, []);

  return <div>Asshole Options</div>;
};

export default AssholeOptions;
