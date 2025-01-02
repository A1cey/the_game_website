export enum Games {
	ARSCHLOCH = 0,
	DURAK = 1,
	MAEXLE = 2,
	POKER = 3,
	SCHWIMMEN = 4,
	WERWOLF = 5,
}

export type GameState<T extends Games> = { game: T } & BaseInformation & {
		options: GameMap[T]["options"];
	} & GameMap[T]["state"];

type GameMap = {
	[Games.ARSCHLOCH]: {
		options: ArschlochOptions;
		state: ArschlochGameState;
	};
	[Games.DURAK]: {
		options: DurakOptions;
		state: DurakGameState;
	};
	[Games.MAEXLE]: {
		options: MaexleOptions;
		state: MaexleGameState;
	};
	[Games.POKER]: {
		options: PokerOptions;
		state: PokerGameState;
	};
	[Games.SCHWIMMEN]: {
		options: SchwimmenOptions;
		state: SchwimmenGameState;
	};
	[Games.WERWOLF]: {
		options: WerwolfOptions;
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

export type ArschlochOptions = {};
export type DurakOptions = {};
export type MaexleOptions = {
	passOn21: boolean;
	lives: number;
};
export type PokerOptions = {};
export type SchwimmenOptions = {};
export type WerwolfOptions = {};

export type ArschlochGameState = {};
export type DurakGameState = {};
export type MaexleGameState = {
	diceValue: PossibleMaexleValue;
	namedValue: PossibleMaexleValue;
};
export type PokerGameState = {};
export type SchwimmenGameState = {};
export type WerwolfGameState = {};

export type PossibleMaexleValue =
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
