// options for games, select games, wait for members
import { useContext } from "react";
import supabase from "@/utils/supabase";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { PlayerCtx, SessionCtx } from "@/App";
import GameCarousel from "@/components/GameCarousel";
import { Button } from "@/components/ui/button";

const Session = () => {
  const [currentGame, setCurrentGame] = useState(0)
  const [playerCount, setPlayerCount] = useState(1);
  const playerCtx = useContext(PlayerCtx);

  const sessionCtx = useContext(SessionCtx);
  const sessionID = sessionCtx.id;

  if (!sessionID) {
    console.error("No session ID provided");
    return;
  }

  const countPlayers = async () => {
    const { count, error: err } = await supabase.from("players").select("*", { count: "exact" }).eq("session_id", sessionID)

    if (err) {
      console.error(err);
    }

    if (!count) {
      throw Error("This should not be possible. There needs to be at least one player in the db to call this method.")
    }
    setPlayerCount(count);
  }

  const removePlayerFromSession = async () => {
    const { error: err } = await supabase.from("players").delete().eq("id", playerCtx.id);

    if (err) {
      console.error(err);
    }
  }

  supabase
    .channel("changes")
    .on("postgres_changes", { schema: "public", table: "players", event: "*" }, countPlayers)
    .subscribe();

  // initial count
  countPlayers();

  return (
    <div className="grid gap-4 justify-center">
      <NavLink to={"/"} onClick={removePlayerFromSession}>Home</NavLink>
      <div>Players: {playerCount}</div>
      <GameCarousel gameImgs={["./assets/dummy.png", "./assets/dummy.png", "./assets/dummy.png", "./assets/dummy.png", "./assets/dummy.png", "./assets/dummy.png"]} setCurrentGame={setCurrentGame} />
      <Button>Start</Button>


    </div>
  );
}

export default Session;
