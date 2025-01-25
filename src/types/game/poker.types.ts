import { z } from "zod";

export const PokerOptionsType = z.object({});
export type PokerOptionsType_t = z.infer<typeof PokerOptionsType>;

export const PokerGameState = z.object({});
export type PokerGameState_t = z.infer<typeof PokerGameState>;
