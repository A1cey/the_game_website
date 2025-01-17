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
    console.log("not and object or null");
    return false;
  }

  const gameState = data as Partial<GameState<T>>;

  if (!Object.values(Games).includes(gameState.game as Games)) {
    console.log("invalid game");
    return false;
  }

  const isValidBaseInformation = (gameState: Partial<GameState<T>>): boolean => {
    return typeof gameState.minPlayers === "number" || typeof gameState.maxPlayers === "number";
  };

  if (!isValidBaseInformation(gameState)) {
    console.log("invalid base information");
    return false;
  }

  const game = Games[gameState.game as unknown as keyof typeof Games] as unknown as Games;
  switch (Number(game)) {
    case Games.ASSHOLE:
      return isValidOptions(gameState.options, {}) && isValidState(gameState.state, {});
    case Games.DURAK:
      return isValidOptions(gameState.options, {}) && isValidState(gameState.state, {});
    case Games.LITTLE_MAX:
      return (
        isValidOptions(gameState.options, { passOn21: "boolean", lives: "number" }) &&
        isValidState(gameState.state, {
          lieRevealed: "boolean",
          namedValues: "NamedValuesArray",
          lives: "PlayerLivesArray",
        })
      );
    case Games.POKER:
      return isValidOptions(gameState.options, {}) && isValidState(gameState.state, {});
    case Games.THIRTY_ONE:
      return isValidOptions(gameState.options, {}) && isValidState(gameState.state, {});
    case Games.WERWOLF:
      return isValidOptions(gameState.options, {}) && isValidState(gameState.state, {});
    default:
      console.log("invalud game");
      return false;
  }
};

const isValidOptions = (options: unknown, schema: Record<string, string>): boolean => {
  console.log("checking options");
  if (typeof options !== "object" || options == null) {
    console.log("invalid options");
    return false;
  }

  for (const key in schema) {
    const expectedType = schema[key];
    const value = (options as Record<string, unknown>)[key];

    if (expectedType !== typeof value) {
      console.log("invalid options: type: ", typeof value, "expected: ", expectedType);
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
  console.log("checking state");
  if (typeof state !== "object" || state == null) {
    console.log("invalid state");
    return false;
  }

  for (const key in schema) {
    const expectedType = schema[key];
    const value = (state as Record<string, unknown>)[key];

    if (expectedType === "NamedValuesArray") {
      if (!Array.isArray(value) || value.some(x => !isNamedValue(x))) {
        console.log("invalid possible little max value array: type: ", value);
        return false;
      }
    } else if (expectedType === "PlayerLivesArray") {
      if (!Array.isArray(value) || value.some(x => !isPlayerLive(x))) {
        console.log("invalid player lives array: type: ", value);
        return false;
      }
    } else if (typeof value !== expectedType) {
      console.log("invalid state: type: ", typeof value, "expected: ", expectedType);
      return false;
    }
  }

  return true;
};

const isNamedValue = (x: any): boolean => {
  return (
    typeof x === "object" &&
    x["value"] &&
    isPossibleLittleMaxValue(x["value"]) &&
    typeof x["player"] === "number" &&
    typeof x["orHigher"] === "boolean"
  );
};

const isPlayerLive = (x: any): boolean => {
  return typeof x === "object" && typeof x["player"] === "number" && typeof x["lives"] === "number";
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

    if (expectedType === "GameState") {
      if (!isGameState(value)) {
        console.log("invalid game State: ", value);
        return false;
      }
    } else if (typeof value !== expectedType) {
      console.log("invalid type:", value, "expected: ", expectedType);
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

    if (expectedType === "GameState") {
      if (!isGameState(value)) {
        return false;
      }
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
  if (
    !(
      (typeof game === "string" && Object.keys(Games).includes(game)) ||
      (typeof game === "number" && Object.values(Games).includes(game))
    )
  ) {
    console.error(`JSON game data does not contain valid game type: ${game}, ${typeof game}`);
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
        isValidJSONState(json["state"], { lie_revealed: "boolean", namedValue: "PossibleLittleMaxValueArray" })
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
