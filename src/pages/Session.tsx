import { useContext, useState } from "react";
import supabase from "@/utils/supabase";
import { NavLink } from "react-router-dom";
import { GameCtx, PlayerCtx, SessionCtx } from "@/App";
import GameCarousel from "@/components/GameCarousel";
import { Button } from "@/components/ui/button";
import { Game_t, Player_t, Session_t } from "@/types/database_extended";

const Session = () => {
  const [currentGame, setCurrentGame] = useState("");
  const { session, updateSession } = useContext(SessionCtx);
  const { player, updatePlayer } = useContext(PlayerCtx);
  const { game, updateGame } = useContext(GameCtx);

  const sessionName = session.name;
  const gameID = session.game_id;
  const playerID = player.id;

  if (!sessionName) {
    throw Error("No session name is set.");
  }
  
  if (!playerID) {
    throw Error("No player id is set.");
  }

  if (!gameID) {
    throw Error("No game id set.");
  }
    
  const setGame = async () => {  
    console.log(gameID);  
    const { data: game, error } = await supabase.from("games").select("*").eq("id", gameID).single();

    if (error) {
      console.error(error);
      return;
    }

    if (!game || game.length == 0) {
      console.error("No game found.");
      return;
    }
    
    updateGame(game as Game_t);
  }

  const removePlayerFromSession = async () => {    
    const { error: err } = await supabase.from("players").delete().eq("id", playerID);

    if (err) {
      console.error(err);
    }
  }
  
  //setGame();
  
  //console.log(session, game, player);

  supabase
    .channel("changes")
    .on("postgres_changes", { schema: "public", table: "sessions", event: "UPDATE", filter: `name=eq.${sessionName}` }, (payload) => { 
      console.log("session changes")
      updateSession(payload.new as Session_t) })
    .subscribe();
  supabase
    .channel("changes")
    .on("postgres_changes", { schema: "public", table: "games", event: "UPDATE", filter: `session_name=eq.${sessionName}` }, (payload) => { 
       console.log("game changes")
       updateGame(payload.new as Game_t) })
    .subscribe();
  supabase
    .channel("changes")
    .on("postgres_changes", { schema: "public", table: "players", event: "UPDATE", filter: `id=eq.${playerID}` }, (payload) => { 
      console.log("player changes")
      console.log(payload);
      console.log(payload.new);
      updatePlayer(payload.new as Player_t) })
    .subscribe();

  return (
    <div className="grid gap-4 justify-center">
      <NavLink to={"/"} onClick={removePlayerFromSession}>Home</NavLink>
      <div>Players: {session.num_of_players}</div>
      <GameCarousel gameImgs={["./assets/dummy.png", "./assets/dummy.png", "./assets/dummy.png", "./assets/dummy.png", "./assets/dummy.png", "./assets/dummy.png"]} setCurrentGame={setCurrentGame} />
      <Button>Start</Button>
    </div>
  );
}

export default Session;
