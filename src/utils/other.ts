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
