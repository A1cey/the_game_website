import type { Dispatch, SetStateAction } from "react";
import { z } from "zod";
import { LittleMaxGameState, LittleMaxOptionsType } from "./little_max.types";
import { AssholeGameState, AssholeOptionsType } from "./asshole.types";
import { DurakOptionsType, DurakGameState } from "./durak.types";
import { PokerOptionsType, PokerGameState } from "./poker.types";
import { ThirtyOneOptionsType, ThirtyOneGameState } from "./thirty_one.types";
import { WerwolfOptionsType, WerwolfGameState } from "./werwolf.types";

export type GameProps = {
  setWinner: Dispatch<SetStateAction<string | null>>;
  onLivesChange: Dispatch<SetStateAction<PlayerLive_t[]>>;
};

export const PlayerLive = z.object({
  lives: z.number(),
  player: z.number(),
});
export type PlayerLive_t = z.infer<typeof PlayerLive>;

export const BaseInformation = z.object({
  minPlayers: z.number(),
  maxPlayers: z.number(),
});
export type BaseInformation_t = z.infer<typeof BaseInformation>;

export const GameType = z.enum(["ASSHOLE", "DURAK", "LITTLE_MAX", "POKER", "THIRTY_ONE", "WERWOLF"]);
export type GameType_t = z.infer<typeof GameType>;

export const GameMap = z.object({
  ASSHOLE: z.object({
    options: AssholeOptionsType,
    state: AssholeGameState,
  }),
  DURAK: z.object({
    options: DurakOptionsType,
    state: DurakGameState,
  }),
  LITTLE_MAX: z.object({
    options: LittleMaxOptionsType,
    state: LittleMaxGameState,
  }),
  POKER: z.object({
    options: PokerOptionsType,
    state: PokerGameState,
  }),
  THIRTY_ONE: z.object({
    options: ThirtyOneOptionsType,
    state: ThirtyOneGameState,
  }),
  WERWOLF: z.object({
    options: WerwolfOptionsType,
    state: WerwolfGameState,
  }),
});
export type GameMap_t = z.infer<typeof GameMap>;

export const GameState = z.discriminatedUnion("game", [
  z.object({
    game: z.literal("ASSHOLE"),
    ...BaseInformation.shape,
    options: GameMap.shape.ASSHOLE.shape.options,
    state: GameMap.shape.ASSHOLE.shape.state,
  }),
  z.object({
    game: z.literal("DURAK"),
    ...BaseInformation.shape,
    options: GameMap.shape.DURAK.shape.options,
    state: GameMap.shape.DURAK.shape.state,
  }),
  z.object({
    game: z.literal("LITTLE_MAX"),
    ...BaseInformation.shape,
    options: GameMap.shape.LITTLE_MAX.shape.options,
    state: GameMap.shape.LITTLE_MAX.shape.state,
  }),
  z.object({
    game: z.literal("POKER"),
    ...BaseInformation.shape,
    options: GameMap.shape.POKER.shape.options,
    state: GameMap.shape.POKER.shape.state,
  }),
  z.object({
    game: z.literal("THIRTY_ONE"),
    ...BaseInformation.shape,
    options: GameMap.shape.THIRTY_ONE.shape.options,
    state: GameMap.shape.THIRTY_ONE.shape.state,
  }),
  z.object({
    game: z.literal("WERWOLF"),
    ...BaseInformation.shape,
    options: GameMap.shape.WERWOLF.shape.options,
    state: GameMap.shape.WERWOLF.shape.state,
  }),
]);
export type GameState_t = z.infer<typeof GameState>;
