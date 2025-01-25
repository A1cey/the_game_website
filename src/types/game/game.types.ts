import type { Dispatch, SetStateAction } from "react";
import { z } from "zod";
import { AssholeGameState, AssholeOptionsType } from "./asshole.types";
import { DurakGameState, DurakOptionsType } from "./durak.types";
import { LittleMaxGameState, LittleMaxOptionsType } from "./little_max.types";
import { PokerGameState, PokerOptionsType } from "./poker.types";
import { BaseInformation, type PlayerLive_t } from "./shared.types";
import { ThirtyOneGameState, ThirtyOneOptionsType } from "./thirty_one.types";
import { WerwolfGameState, WerwolfOptionsType } from "./werwolf.types";

export type GameProps = {
  setWinner: Dispatch<SetStateAction<string | null>>;
  onLivesChange: Dispatch<SetStateAction<PlayerLive_t[]>>;
};

export const GameType = z.enum(["ASSHOLE", "DURAK", "LITTLE_MAX", "POKER", "THIRTY_ONE", "WERWOLF"]);
export type GameType_t = z.infer<typeof GameType>;

export const GameState = z.discriminatedUnion("game", [
  z
    .object({
      game: z.literal(GameType.enum.ASSHOLE),
      options: AssholeOptionsType,
      state: AssholeGameState,
    })
    .merge(BaseInformation),
  z
    .object({
      game: z.literal(GameType.enum.DURAK),
      options: DurakOptionsType,
      state: DurakGameState,
    })
    .merge(BaseInformation),
  z
    .object({
      game: z.literal(GameType.enum.LITTLE_MAX),
      options: LittleMaxOptionsType,
      state: LittleMaxGameState,
    })
    .merge(BaseInformation),
  z
    .object({
      game: z.literal(GameType.enum.POKER),
      options: PokerOptionsType,
      state: PokerGameState,
    })
    .merge(BaseInformation),
  z
    .object({
      game: z.literal(GameType.enum.THIRTY_ONE),
      options: ThirtyOneOptionsType,
      state: ThirtyOneGameState,
    })
    .merge(BaseInformation),
  z
    .object({
      game: z.literal(GameType.enum.WERWOLF),
      options: WerwolfOptionsType,
      state: WerwolfGameState,
    })
    .merge(BaseInformation),
]);
export type GameState_t = z.infer<typeof GameState>;

const GameRules = z.object({
  en: z.string(),
  de: z.string(),
});

const GameRulesMap = z.object({
  [GameType.enum.ASSHOLE]: GameRules,
  [GameType.enum.DURAK]: GameRules,
  [GameType.enum.LITTLE_MAX]: GameRules,
  [GameType.enum.POKER]: GameRules,
  [GameType.enum.THIRTY_ONE]: GameRules,
  [GameType.enum.WERWOLF]: GameRules,
});
export type GameRulesMap_t = z.infer<typeof GameRulesMap>;

export const GameOptionsType = z.union([
  AssholeOptionsType,
  DurakOptionsType,
  LittleMaxOptionsType,
  PokerOptionsType,
  ThirtyOneOptionsType,
  WerwolfOptionsType,
]);
export type GameOptionsType_t = z.infer<typeof GameOptionsType>;
