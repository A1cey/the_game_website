import { useContext, useState } from "react";
import supabase from "@/utils/supabase";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { PlayerCtx, SessionCtx } from "@/App";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import "@/index.css";

const Home = () => {
  const [sessionName, setSessionName] = useState("");
  const playerCtx = useContext(PlayerCtx);
  const sessionCtx = useContext(SessionCtx);
  const navigate = useNavigate();

  const tryJoinSession = async () => {
    if (sessionName === "") {
      console.error(" Please provide Session ID")
      return;
    }

    // look for session in supabase db
    const { data: session, error: select_err } = await supabase.from("sessions").select().eq("name", sessionName);

    if (select_err) {
      console.error(select_err)
      return;
    }

    if (!session || session.length === 0) {
      console.error("session not found");
      return;
    }

    console.log(session)
    sessionCtx.id = session[0].id;
    sessionCtx.name = sessionName;
    sessionCtx.game_id = session[0].game_id;
    joinSession()
  }

  const createSession = async () => {
    // TODO: Sessions can have same name -> joining will always just use first session returned
    // create new supabase entry with this sessionName -> check if already there -> maybe append invisible hash
    if (sessionName === "") {
      console.error("Please provide Session ID")
      return;
    }

    const sessionID = uuidv4();

    const { error: err } = await supabase.from("sessions").insert({ id: sessionID, name: sessionName, game_id: null });

    if (err) {
      console.error(err)
      return;
    }

    sessionCtx.id = sessionID;
    sessionCtx.name = sessionName;
    joinSession();
  }

  const joinSession = async () => {
    const playerID = playerCtx.id;
    const sessionID = sessionCtx.id;

    if (!sessionID) {
      console.error("No session ID provided");
      return;
    }

    const { error: insert_err } = await supabase.from("players").insert({
      id: playerID,
      session_id: sessionID
    })

    if (insert_err) {
      console.error(insert_err);
      return;
    }

    playerCtx.session_id = sessionID

    navigate("session");
  }

  return (
    <div className="grid gap-4 justify-center">
      <h1 className="mt-40 text-4xl font-bold text-center">The Game Website</h1>

      <Input className="mt-20 hover:bg-gray-200 hover:scale-[1.05] " placeholder="Session Name" onChange={e => setSessionName(e.target.value)} />
      <div className="flex gap-4 justify-center">
        <Button className="active:scale-[0.98] hover:scale-[1.05] font-semibold" variant="outline" onClick={createSession}>Create Session</Button>
        <Button className="active:scale-[0.98] hover:scale-[1.05] font-semibold" variant="outline" onClick={tryJoinSession}>Join Session</Button>
      </div>
    </div>
  );
};

export default Home;
