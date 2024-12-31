export enum Games {
  Durak,
  Poker,
  Schwimmen,
  Werwolf
}

export type BaseInformation = {
  maxPlayers: number;
  current_player: string; 
}

export type DurakOptions = {

};

export type PokerOptions = {

};

export type SchwimmenOptions = {

};

export type WerwolfOptions = {

};

export type GameState = 
  | ({ game: Games.Durak } & BaseInformation & { options: DurakOptions })
  | ({ game: Games.Poker } & BaseInformation & { options: PokerOptions })
  | ({ game: Games.Schwimmen } & BaseInformation & { options: SchwimmenOptions })
  | ({ game: Games.Werwolf } & BaseInformation & { options: WerwolfOptions });
