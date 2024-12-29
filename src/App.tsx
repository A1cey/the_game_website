import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import { createContext } from "react";
import type { Session_t,Game_t,Player_t } from "@/types/database_extended";
import Game from "@/pages/Game";
import Session from "@/pages/Session"; 
import { v4 as uuidv4 } from "uuid";

export const SessionCtx = createContext<Session_t>({id: null, game_id: null, name: null});
export const GameCtx =  createContext<Game_t>({id: null, options: null, type: null});
export const PlayerCtx = createContext<Player_t>({id: uuidv4(), session_id: null});

const App = () => { 
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/session" element={<Session/>} />
      <Route path="/game" element={<Game />} />
    </Routes>
  );
};

export default App;
