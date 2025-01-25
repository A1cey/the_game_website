import type { DurakOptionsType_t } from "@/types/game/durak.types";
import { useEffect, useRef } from "react";

type DurakOptionsProps = DurakOptionsType_t & {
  disabled: boolean;
  setOptions: React.Dispatch<React.SetStateAction<DurakOptionsType_t>>;
};

const DurakOptions = ({ setOptions, disabled }: DurakOptionsProps) => {
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
