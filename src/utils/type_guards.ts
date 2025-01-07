import type { Json } from "@/types/database.types";
import type { Game_t } from "@/types/database_extended.types";
import {
  type AssholeOptionsType,
  type DurakOptionsType,
  Games,
  type GameState,
  type JSONGameState,
  type LittleMaxOptionsType,
  type PokerOptionsType,
  type PossibleLittleMaxValue,
  type ThirtyOneOptionsType,
  type WerwolfOptionsType,
} from "@/types/game.types";

export const isGameState = <T extends Games>(data: unknown): data is GameState<T> => {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const gameState = data as Partial<GameState<T>>;

  if (!Object.values(Games).includes(gameState.game as Games)) {
    return false;
  }

  const isValidBaseInformation = (gameState: Partial<GameState<T>>): boolean => {
    return typeof gameState.minPlayers !== "number" || typeof gameState.maxPlayers !== "number";
  };

  if (!isValidBaseInformation(gameState)) {
    return false;
  }

  switch (gameState.game) {
    case Games.ASSHOLE:
      return isValidOptions(gameState.options, {}) && isValidState(gameState.state, {});
    case Games.DURAK:
      return isValidOptions(gameState.options, {}) && isValidState(gameState.state, {});
    case Games.LITTLE_MAX:
      return (
        isValidOptions(gameState.options, { passOn21: "boolean", lives: "number" }) &&
        isValidState(gameState.state, { diceValue: "PossibleLittleMaxValue", namedValue: "PossibleLittleMaxValue" })
      );
    case Games.POKER:
      return isValidOptions(gameState.options, {}) && isValidState(gameState.state, {});
    case Games.THIRTY_ONE:
      return isValidOptions(gameState.options, {}) && isValidState(gameState.state, {});
    case Games.WERWOLF:
      return isValidOptions(gameState.options, {}) && isValidState(gameState.state, {});
    default:
      return false;
  }
};

const isValidOptions = (options: unknown, schema: Record<string, string>): boolean => {
  if (typeof options !== "object" || options == null) {
    return false;
  }

  for (const key in schema) {
    const expectedType = schema[key];
    const value = (options as Record<string, unknown>)[key];

    if (expectedType !== typeof value) {
      return false;
    }
  }

  return true;
};

const isValidJSONOptions = (options: unknown, schema: Record<string, string>): boolean => {
  if (typeof options !== "object" || options == null) {
    return false;
  }

  for (const key in schema) {
    const expectedType = schema[key];
    const value = (options as Record<string, unknown>)[key];

    if (typeof value !== expectedType) {
      return false;
    }
  }

  return true;
};

const isValidState = (state: unknown, schema: Record<string, string>): boolean => {
  if (typeof state !== "object" || state == null) {
    return false;
  }

  for (const key in schema) {
    const expectedType = schema[key];
    const value = (state as Record<string, unknown>)[key];

    if (expectedType === "PossibleLittleMaxValue" && !isPossibleLittleMaxValue(value)) {
      return false;
    } else if (typeof value !== expectedType) {
      return false;
    }
  }

  return true;
};

const isValidJSONState = (state: unknown, schema: Record<string, string>): boolean => {
  if (typeof state !== "object" || state == null) {
    return false;
  }

  for (const key in schema) {
    const expectedType = schema[key];
    const value = (state as Record<string, unknown>)[key];

    if (expectedType === "PossibleLittleMaxValue" && !isPossibleLittleMaxValue(value)) {
      return false;
    }

    if (typeof value === undefined) {
      console.error(key, " has not correct type ", expectedType, "but: ", value);
      return false;
    }
  }

  return true;
};

const isPossibleLittleMaxValue = (value: unknown): boolean => {
  const validValues = [null, 31, 32, 41, 42, 43, 51, 52, 53, 54, 61, 62, 63, 64, 65, 11, 22, 33, 44, 55, 66, 21];
  return validValues.includes(value as PossibleLittleMaxValue);
};

export const isPartialGameT = (input: unknown): input is Partial<Game_t> => {
  if (input == null || typeof input !== "object") {
    return false;
  }

  const gameTSchema: Record<string, string> = { current_player: "number", game_state: "GameState", id: "string" };

  for (const key in gameTSchema) {
    const expectedType = gameTSchema[key];
    const value = (input as Record<string, unknown>)[key];

    // skipping over undefined values
    if (value === undefined) {
      continue;
    }

    if (expectedType === "GameState" && !isGameState(value)) {
      return false;
    } else if (typeof value !== expectedType) {
      return false;
    }
  }

  return true;
};

export const isGameT = (input: unknown): input is Game_t => {
  if (input == null || typeof input !== "object") {
    return false;
  }

  const gameTSchema: Record<string, string> = { current_player: "number", game_state: "GameState", id: "string" };

  for (const key in gameTSchema) {
    const expectedType = gameTSchema[key];
    const value = (input as Record<string, unknown>)[key];

    if (expectedType === "GameState" && !isGameState(value)) {
      return false;
    } else if (typeof value !== expectedType) {
      return false;
    }
  }

  return true;
};

export const isJson = (value: unknown): value is Json => {
  // Check for primitive types and null
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null) {
    return true;
  }

  // Check for arrays
  if (Array.isArray(value)) {
    return value.every(isJson); // Ensure all elements are Json
  }

  // Check for objects
  if (typeof value === "object" && value !== null) {
    return Object.entries(value).every(([key, val]) => {
      // Ensure key is a string and value is Json
      return typeof key === "string" && (val === undefined || isJson(val));
    });
  }

  // If none of the above, it's not Json
  return false;
};

// TODO: Function checks for GameT not gameState
export const isJSONConvertibleToGameState = <T extends Games>(json: Json): json is JSONGameState<T> => {
  if (json == null) {
    console.error("JSON game data is null or undefined.");
    return false;
  }

  if (typeof json !== "object" || Array.isArray(json)) {
    console.error(
      `JSON game data is not an object but has the type ${typeof json}. It needs to be an object to be converted into a game state.`,
    );
    return false;
  }

  const game = json["game"];

  // valid game type
  if (typeof game !== "string" || !Object.values(Games).includes(game)) {
    console.error("JSON game data does not contain valid game type.");
    return false;
  }

  // valid base information
  if (typeof json["minPlayers"] !== "number" || typeof json["maxPlayers"] !== "number") {
    console.error("JSON game data does not contain valid game base information.");
    return false;
  }

  // valid options and state
  switch (game) {
    case "ASSHOLE":
      return isValidJSONOptions(json["options"], {}) && isValidJSONState(json["state"], {});
    case "DURAK":
      return isValidJSONOptions(json["options"], {}) && isValidJSONState(json["state"], {});
    case "LITTLE_MAX":
      return (
        isValidJSONOptions(json["options"], { passOn21: "boolean", lives: "number" }) &&
        isValidJSONState(json["state"], { diceValue: "PossibleLittleMaxValue", namedValue: "PossibleLittleMaxValue" })
      );
    case "POKER":
      return isValidJSONOptions(json["options"], {}) && isValidJSONState(json["state"], {});
    case "THIRTY_ONE":
      return isValidJSONOptions(json["options"], {}) && isValidJSONState(json["state"], {});
    case "WERWOLF":
      return isValidJSONOptions(json["options"], {}) && isValidJSONState(json["state"], {});
    default:
      return false;
  }
};

export const isLittleMaxOptions = (options: any): options is LittleMaxOptionsType => {
  return (
    options &&
    typeof options === "object" &&
    Object.keys(options).includes("lives") &&
    Object.keys(options).includes("passOn21")
  );
};

export const isPokerOptions = (options: any): options is PokerOptionsType => {
  return options && typeof options === "object";
};

export const isAssholeOptions = (options: any): options is AssholeOptionsType => {
  return options && typeof options === "object";
};

export const isThirtyOneOptions = (options: any): options is ThirtyOneOptionsType => {
  return options && typeof options === "object";
};

export const isDurakOptions = (options: any): options is DurakOptionsType => {
  return options && typeof options === "object";
};

export const isWerwolfOptions = (options: any): options is WerwolfOptionsType => {
  return options && typeof options === "object";
};
