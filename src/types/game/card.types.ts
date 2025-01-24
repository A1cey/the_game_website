import { z } from "zod";

export const CardValue = z.enum([
  "TWO",
  "THREE",
  "FOUR",
  "FIVE",
  "SIX",
  "SEVEN",
  "EIGHT",
  "NINE",
  "TEN",
  "JACK",
  "QUEEN",
  "KING",
  "ACE",
]);
export type CardValue = z.infer<typeof CardValue>;

export const CardType = z.enum(["CLUBS", "DIAMONDS", "HEARTS", "SPADES"]);
export type CardType = z.infer<typeof CardType>;

export const Card = z.tuple([CardType, CardValue]);
export type Card = [CardType, CardValue];
