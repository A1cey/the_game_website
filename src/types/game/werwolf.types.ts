import { z } from "zod";

export const WerwolfOptionsType = z.object({});
export type WerwolfOptionsType = z.infer<typeof WerwolfOptionsType>;

export const WerwolfGameState = z.object({});
export type WerwolfGameState = z.infer<typeof WerwolfGameState>;
