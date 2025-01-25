import { z } from "zod";

export const DurakOptionsType = z.object({});
export type DurakOptionsType_t = z.infer<typeof DurakOptionsType>;

export const DurakGameState = z.object({});
export type DurakGameState_t = z.infer<typeof DurakGameState>;
