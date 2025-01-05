export enum Games {
  ASSHOLE = 0,
  DURAK = 1,
  LITTLE_MAX = 2,
  POKER = 3,
  THIRTY_ONE = 4,
  WERWOLF = 5,
}

export type JSONGameState<T extends Games> = { game: string | T } & BaseInformation & {
    options: Record<string, string | number | boolean> | GameMap[T]["options"];
  } & { state: Record<string, string | number | boolean | null> | GameMap[T]["state"] };

export type GameState<T extends Games> = { game: T } & BaseInformation & { options: GameMap[T]["options"] } & {
    state: GameMap[T]["state"];
  };

export type GameMap = {
  [Games.ASSHOLE]: {
    options: AssholeOptionsType;
    state: AssholeGameState;
  };
  [Games.DURAK]: {
    options: DurakOptionsType;
    state: DurakGameState;
  };
  [Games.LITTLE_MAX]: {
    options: LittleMaxOptionsType;
    state: LittleMaxGameState;
  };
  [Games.POKER]: {
    options: PokerOptionsType;
    state: PokerGameState;
  };
  [Games.THIRTY_ONE]: {
    options: ThirtyOneOptionsType;
    state: ThirtyOneGameState;
  };
  [Games.WERWOLF]: {
    options: WerwolfOptionsType;
    state: WerwolfGameState;
  };
};

export type Card = [CardType, CardValue];

export enum CardValue {
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  NINE = 9,
  TEN = 10,
  JACK = 11,
  QUEEN = 12,
  KING = 13,
  ACE = 14,
}

export enum CardType {
  CLUBS = 0,
  DIAMONDS = 1,
  HEARTS = 2,
  SPADES = 3,
}

export type BaseInformation = {
  minPlayers: number;
  maxPlayers: number;
};

export type AssholeOptionsType = {};
export type DurakOptionsType = {};
export type LittleMaxOptionsType = {
  passOn21: boolean;
  lives: number;
};
export type PokerOptionsType = {};
export type ThirtyOneOptionsType = {};
export type WerwolfOptionsType = {};

export type AssholeGameState = {};
export type DurakGameState = {};
export type LittleMaxGameState = {
  diceValue: PossibleLittleMaxValue;
  namedValue: PossibleLittleMaxValue;
};
export type PokerGameState = {};
export type ThirtyOneGameState = {};
export type WerwolfGameState = {};

export type PossibleLittleMaxValue =
  | null
  | 31
  | 32
  | 41
  | 42
  | 43
  | 51
  | 52
  | 53
  | 54
  | 61
  | 62
  | 63
  | 64
  | 65
  | 11
  | 22
  | 33
  | 44
  | 55
  | 66
  | 21;
