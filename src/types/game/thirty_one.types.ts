import { z } from "zod";

export const ThirtyOneOptionsType = z.object({});
export type ThirtyOneOptionsType = z.infer<typeof ThirtyOneOptionsType>;

export const ThirtyOneGameState = z.object({});
export type ThirtyOneGameState = z.infer<typeof ThirtyOneGameState>;
