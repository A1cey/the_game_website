import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import { createContext, useState } from "react";
import type { Session_t, Game_t, Player_t } from "@/types/database_extended";
import Game from "@/pages/Game";
import Session from "@/pages/Session";

export const SessionCtx = createContext<{
  session: Session_t;
  updateSession: (data: Session_t) => void;
}>({
  session: {
    created_at: null,
    game_id: null,
    game_started_at: null,
    last_update_at: null,
    max_num_of_players: null,
    name: null,
    num_of_players: null,
  },
  updateSession: () => { },
});

export const GameCtx = createContext<{
  game: Game_t;
  updateGame: (data: Game_t) => void;
}>({
  game: {
    game_state: null,
    id: null
  },
  updateGame: () => { }
});

export const PlayerCtx = createContext<{
  player: Player_t;
  updatePlayer: (data: Player_t) => void;
}>({
  player: {
    id: null,
    joined_at: null,
    name: null,
    player_game_state: null,
    session_name: null,
  },
  updatePlayer: () => { }
});

const App = () => {
  const [session, setSession] = useState<Session_t>({
    created_at: null,
    game_id: null,
    game_started_at: null,
    last_update_at: null,
    max_num_of_players: null,
    name: null,
    num_of_players: null,
  });

  const updateSession = (data: Session_t) => {
    setSession(data);
  };

  const [game, setGame] = useState<Game_t>({
    game_state: null,
    id: null,
  });

  const updateGame = (data: Game_t) => {
    setGame(data);
  };

  const [player, setPlayer] = useState<Player_t>({
    id: null,
    joined_at: null,
    name: null,
    player_game_state: null,
    session_name: null,
  });

  const updatePlayer = (data: Player_t) => {
    setPlayer(data);
  };

  return (
    <SessionCtx.Provider value={{ session, updateSession }}>
      <GameCtx.Provider value={{ game, updateGame }}>
        <PlayerCtx.Provider value={{ player, updatePlayer }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/session" element={<Session />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </PlayerCtx.Provider>
      </GameCtx.Provider>
    </SessionCtx.Provider>
  );
};

export default App;
