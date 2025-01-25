import { z } from "zod";
import { PlayerLive } from "./shared.types";

export const PossibleLittleMaxValue = z.union([
  z.literal(0),
  z.literal(31),
  z.literal(32),
  z.literal(41),
  z.literal(42),
  z.literal(43),
  z.literal(51),
  z.literal(52),
  z.literal(53),
  z.literal(54),
  z.literal(61),
  z.literal(62),
  z.literal(63),
  z.literal(64),
  z.literal(65),
  z.literal(11),
  z.literal(22),
  z.literal(33),
  z.literal(44),
  z.literal(55),
  z.literal(66),
  z.literal(21),
]);
export type PossibleLittleMaxValue_t = z.infer<typeof PossibleLittleMaxValue>;

export const LittleMaxOldValue = z.object({
  value: PossibleLittleMaxValue,
  player: z.number(),
  orHigher: z.boolean(),
});
export type LittleMaxOldValue_t = z.infer<typeof LittleMaxOldValue>;

export const LittleMaxOptionsType = z.object({
  passOn21: z.boolean(),
  lives: z.number(),
});
export type LittleMaxOptionsType_t = z.infer<typeof LittleMaxOptionsType>;

export const LittleMaxGameState = z.object({
  namedValues: LittleMaxOldValue.array(),
  lieRevealed: z.boolean(),
  lives: PlayerLive.array(),
  activePlayers: z.number().array(),
});
export type LittleMaxGameState_t = z.infer<typeof LittleMaxGameState>;
