import { z } from "zod";

export const PlayerLive = z.object({
  lives: z.number(),
  player: z.number(),
});
export type PlayerLive_t = z.infer<typeof PlayerLive>;

export const BaseInformation = z.object({
  minPlayers: z.number(),
  maxPlayers: z.number(),
});
export type BaseInformation_t = z.infer<typeof BaseInformation>;