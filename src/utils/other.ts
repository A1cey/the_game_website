import type { Enum } from "@/types/other.types";
/**
 * @param {E extends Enum} e - The enum the values should be provided for.
 * @returns Array of the enum values as numeric keys. To get the representation as a string use <e>[key].
 */
export const getEnumValues = <E extends Enum>(e: E): E[keyof E][] => {
  return Object.keys(e)
    .filter(key => Number.isNaN(Number(key)))
    .map(key => e[key as keyof E]) as E[keyof E][];
};

export const formatDefaultPlayerName = (name: string, handleTranslation: (key: string) => string): string => {
  if (name.match("^player_[0-9]+$")) {
    return `${handleTranslation("player")} ${name.split("_")[1]}`;
  }

  return name;
};

export const random = (min: number, max: number): number => {
  let num = -1;
  do {
    num = Math.floor(Math.random() * 10);
  } while (num < min || num > max);

  return num;
};
