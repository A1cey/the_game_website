import { z } from "zod";

export const AssholeOptionsType = z.object({});
export type AssholeOptionsType = z.infer<typeof AssholeOptionsType>;

export const AssholeGameState = z.object({});
export type AssholeGameState = z.infer<typeof AssholeGameState>;
