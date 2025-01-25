import { z } from "zod";

export const WerwolfOptionsType = z.object({});
export type WerwolfOptionsType_t = z.infer<typeof WerwolfOptionsType>;

export const WerwolfGameState = z.object({});
export type WerwolfGameState_t = z.infer<typeof WerwolfGameState>;
