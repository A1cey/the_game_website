import { type Card, CardType, CardValue, Games, type GameState } from "@/types/game.types";
import { getEnumValues } from "./other";
import type { Json } from "@/types/database.types";
import type { Game_t } from "@/types/database_extended.types";

export const getGameImgs = (): string[] => {
  return getEnumValues(Games).map(key => "src/assets/".concat(Games[key].toLowerCase(), ".svg"));
};

export const getAltNameForGame = (str: string): string => {
  const name = str.replace("src/assets/", "").replace(".svg", "");
  return name.substring(0, 1).toUpperCase() + name.substring(1);
};

export const getCards = (): Card[] => {
  return getEnumValues(CardType).flatMap(cardType =>
    getEnumValues(CardValue).map(cardValue => [cardType, cardValue] as Card),
  );
};

export const validPlayerCount = (playerCount: number, minPlayersAllowed = 1, maxPlayersAllowed = 20): boolean => {
  if (minPlayersAllowed < 1) {
    console.error("There need to be at least one player allowed for this game.");
    return false;
  }

  if (playerCount < minPlayersAllowed) {
    console.error(`Too few players. There need to be at least ${minPlayersAllowed} for this game.`);
    return false;
  }

  if (playerCount > maxPlayersAllowed) {
    console.error(`Too many players. There can only be ${minPlayersAllowed} in this game.`);
    return false;
  }

  return true;
};

export const convertGamesStateJSONToGameStateType = (json: Json | null): GameState<Games> | null => {
  if (json == null) {
    console.error("JSON game state is null or undefined.");
    return null;
  }

  if (typeof json === "boolean" || typeof json === "number" || typeof json === "string" || Array.isArray(json)) {
    console.error(
      `JSON game state is not an object but has the type "${typeof json}". It needs to be an object to be converted into a game state.`,
    );
    return null;
  }

  const game = json["game"];

  if (!game) {
    console.error("Game type is undefined");
    return null;
  }

  const gameName = getEnumValues(Games).find(val => Games[val] === game) || null;

  if (!gameName) {
    console.error("Game name is null");
    return null;
  }

  return json as GameState<typeof gameName>;
};

export const convertGamesJSONToGameT = (json: Json | null | Game_t): Game_t | null => {
  console.log(json);

  if (json == null) {
    console.error("JSON game data is null or undefined.");
    return null;
  }

  if (typeof json === "boolean" || typeof json === "number" || typeof json === "string" || Array.isArray(json)) {
    console.error(
      `JSON game data is not an object but has the type ${typeof json}. It needs to be an object to be converted into a game state.`,
    );
    return null;
  }

  const id = json["id"];

  if (!id) {
    console.error("Game id is undefined.");
    return null;
  }

  if (typeof id !== "string") {
    console.error("JSON game id is not a string.");
    return null;
  }

  const currentPlayer = json["current_player"];

  if (!currentPlayer) {
    console.error("Current player is undefined.");
    return null;
  }

  if (typeof currentPlayer !== "number") {
    console.error("Current player JSON is not a number.");
    return null;
  }

  return {
    current_player: currentPlayer,
    id: id,
    game_state: json["game_state"] ? convertGamesStateJSONToGameStateType(json["game_state"] as Json) : null,
  };
};

export const defaultGameState = (game: Games): GameState<Games> => {
  const defaultArschlochGameState: GameState<Games.ARSCHLOCH> = {
    game: Games.ARSCHLOCH,
    maxPlayers: 8,
    minPlayers: 2,
    options: {},
  };

  const defaultDurakGameState: GameState<Games.DURAK> = {
    game: Games.DURAK,
    maxPlayers: 8,
    minPlayers: 2,
    options: {},
  };

  const defaultMaexleGameState: GameState<Games.MAEXLE> = {
    game: Games.MAEXLE,
    maxPlayers: 8,
    minPlayers: 2,
    options: {
      lives: 5,
      passOn21: true,
    },
    diceValue: 31,
    namedValue: 31,
  };

  const defaultPokerGameState: GameState<Games.POKER> = {
    game: Games.POKER,
    maxPlayers: 8,
    minPlayers: 2,
    options: {},
  };

  const defaultSchwimmenGameState: GameState<Games.SCHWIMMEN> = {
    game: Games.SCHWIMMEN,
    maxPlayers: 8,
    minPlayers: 2,
    options: {},
  };

  const defaultWerwolfGameState: GameState<Games.WERWOLF> = {
    game: Games.WERWOLF,
    maxPlayers: 8,
    minPlayers: 2,
    options: {},
  };

  switch (game) {
    case Games.ARSCHLOCH:
      return defaultArschlochGameState;
    case Games.DURAK:
      return defaultDurakGameState;
    case Games.MAEXLE:
      return defaultMaexleGameState;
    case Games.POKER:
      return defaultPokerGameState;
    case Games.SCHWIMMEN:
      return defaultSchwimmenGameState;
    case Games.WERWOLF:
      return defaultWerwolfGameState;
  }
};

export const defaultDBGameState = (game: Games): Json => {
  const defaultState = defaultGameState(game);
  console.log(Games[game]);
  return { ...defaultState, game: Games[game] };
};
