import { z } from "zod";

export const AssholeOptionsType = z.object({});
export type AssholeOptionsType_t = z.infer<typeof AssholeOptionsType>;

export const AssholeGameState = z.object({});
export type AssholeGameState_t = z.infer<typeof AssholeGameState>;
