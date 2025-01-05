import type { AssholeOptionsType } from "@/types/game.types";
import { useEffect, useRef } from "react";

type AssholeOptionsProps = AssholeOptionsType & {
  setOptions: React.Dispatch<React.SetStateAction<AssholeOptionsType>>;
};

const AssholeOptions = ({ setOptions }: AssholeOptionsProps) => {
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
