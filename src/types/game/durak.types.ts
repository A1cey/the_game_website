import { z } from "zod";

export const DurakOptionsType = z.object({});
export type DurakOptionsType = z.infer<typeof DurakOptionsType>;

export const DurakGameState = z.object({});
export type DurakGameState = z.infer<typeof DurakGameState>;
