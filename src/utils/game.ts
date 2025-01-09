import { type Card, CardType, CardValue, Games, type GameState } from "@/types/game.types";
import { getEnumValues } from "./other";
import type { Json } from "@/types/database.types";
import type { Game_t } from "@/types/database_extended.types";
import { isJson, isJSONConvertibleToGameState } from "./type_guards";

export const getGameImgs = (handleTranslation: (key: string) => string): string[] => {
  const images = import.meta.glob("../assets/game_svgs/**/*.svg", { eager: true });
  return getEnumValues(Games).map(key => {
    const fileName = `${handleTranslation(Games[key].toLowerCase()).toLowerCase()}.svg`;
    const path = `../assets/game_svgs/${Games[key].toLowerCase()}/${fileName}`;
    return (images[path] as { default: string }).default;
  });
};

export const getAltNameForGameSVG = (str: string): string => {
  const name = str.split("/").reverse()[0].replace(".svg", "");
  return name
    .split("_")
    .map(val => val.substring(0, 1).toUpperCase() + val.substring(1).toLowerCase())
    .join(" ");
};

export const formatGameName = (str: string, handleTranslation: (key: string) => string): string => {
  return handleTranslation(str.toLowerCase())
    .split("_")
    .map(val => val.substring(0, 1).toUpperCase() + val.substring(1).toLowerCase())
    .join(" ")
    .replace("ae", "ä");
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
  if (!isJson(json) || !isJSONConvertibleToGameState(json)) {
    return null;
  }

  const gameName = getEnumValues(Games).find(val => Games[val] === json.game);

  if (gameName === undefined) {
    console.error("Game name is not found in Games enum.");
    return null;
  }

  return json as GameState<typeof gameName>;
};

export const convertGamesJSONToGameT = (json: Json): Game_t | null => {
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
  const defaultAssholeGameState: GameState<Games.ASSHOLE> = {
    game: Games.ASSHOLE,
    maxPlayers: 8,
    minPlayers: 2,
    options: {},
    state: {},
  };

  const defaultDurakGameState: GameState<Games.DURAK> = {
    game: Games.DURAK,
    maxPlayers: 8,
    minPlayers: 2,
    options: {},
    state: {},
  };

  const defaultLittleMaxGameState: GameState<Games.LITTLE_MAX> = {
    game: Games.LITTLE_MAX,
    maxPlayers: 8,
    minPlayers: 2,
    options: {
      lives: 5,
      passOn21: true,
    },
    state: {
      namedValues: [],
      lie_revealed: false,
      lives: [],
    },
  };

  const defaultPokerGameState: GameState<Games.POKER> = {
    game: Games.POKER,
    maxPlayers: 8,
    minPlayers: 2,
    options: {},
    state: {},
  };

  const defaultThirtyOneGameState: GameState<Games.THIRTY_ONE> = {
    game: Games.THIRTY_ONE,
    maxPlayers: 8,
    minPlayers: 2,
    options: {},
    state: {},
  };

  const defaultWerwolfGameState: GameState<Games.WERWOLF> = {
    game: Games.WERWOLF,
    maxPlayers: 8,
    minPlayers: 2,
    options: {},
    state: {},
  };

  switch (game) {
    case Games.ASSHOLE:
      return defaultAssholeGameState;
    case Games.DURAK:
      return defaultDurakGameState;
    case Games.LITTLE_MAX:
      return defaultLittleMaxGameState;
    case Games.POKER:
      return defaultPokerGameState;
    case Games.THIRTY_ONE:
      return defaultThirtyOneGameState;
    case Games.WERWOLF:
      return defaultWerwolfGameState;
  }
};

export const defaultDBGameState = (game: Games): Json => {
  const defaultState = defaultGameState(game);
  return { ...defaultState, game: Games[game] };
};
