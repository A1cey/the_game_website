import { useContext, useState } from "react";
import supabase from "@/utils/supabase";
import { useNavigate } from "react-router-dom";
import { PlayerCtx, SessionCtx } from "@/App";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import "@/index.css";

const Home = () => {
  const [sessionName, setSessionName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const { updatePlayer } = useContext(PlayerCtx);
  const { updateSession } = useContext(SessionCtx);
  const navigate = useNavigate();

  const createSession = async () => {
    // TODO: Sessions can have same name -> joining will always just use first session returned
    // create new supabase entry with this sessionName -> check if already there -> maybe append invisible hash
    if (sessionName === "") {
      console.error("Please provide Session Name")
      return;
    }

    const { error: err } = await supabase.from("sessions").insert({ name: sessionName });

    if (err) {
      console.error(err)
      return;
    }

    joinSession(sessionName);
  }

  const joinSession = async (sessionName: string) => {
    console.log("Joining")
    if (sessionName === "") {
      console.error(" Please provide Session Name")
      return;
    }

    const { data: session, error: select_err } = await supabase.from("sessions").select().eq("name", sessionName).single();

    if (select_err) {
      console.error(select_err)
      return;
    }

    if (!session) {
      console.error("session not found");
      return;
    }

    if (session.num_of_players == session.max_num_of_players) {
      console.warn("Session is full.");
      return;
    }

    if (session.game_started_at) {
      console.warn("Session is currently in a game.");
      return;
    }

    console.log(session);
    updateSession(session);

    const { data: player, error: insert_err } = await supabase.from("players").insert({
      session_name: sessionName,
      name: playerName !== "" ? playerName : null
    }).select().single();

    if (insert_err) {
      console.error(insert_err);
      return;
    }

    if (!player) {
      console.error("player not found");
      return;
    }

    updatePlayer(player);

    navigate("session");
  }

  return (
    <div className="grid gap-4 justify-center">
      <h1 className="mt-40 text-4xl font-bold text-center">The Game Website</h1>

      <Input className="mt-20 hover:bg-gray-200 hover:scale-[1.05] " placeholder="Player Name" onChange={e => setPlayerName(e.target.value)} />
      <Input className="hover:bg-gray-200 hover:scale-[1.05] " placeholder="Session Name" onChange={e => setSessionName(e.target.value)} />
      <div className="flex gap-4 justify-center">
        <Button className="active:scale-[0.98] hover:scale-[1.05] font-semibold" variant="outline" onClick={createSession}>Create Session</Button>
        <Button className="active:scale-[0.98] hover:scale-[1.05] font-semibold" variant="outline" onClick={() => joinSession(sessionName)}>Join Session</Button>
      </div>
    </div>
  );
};

export default Home;
