import { z } from "zod";

export const PokerOptionsType = z.object({});
export type PokerOptionsType = z.infer<typeof PokerOptionsType>;

export const PokerGameState = z.object({});
export type PokerGameState = z.infer<typeof PokerGameState>;
