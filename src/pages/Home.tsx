import { useState } from "react";
import React from "react";
import supabase from "../utils/supabase";
import { useAsyncValue } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Home = () => {
  const [sessionName, setSessionName] = useState("");

  const joinSession = async () => {
    // look for session in supabase db
    // join session
    // route to session site
    setTest("Joining " + sessionName);

    if (sessionName === "") {
      console.log("error")
      //throw Error("Provide Session ID");
    }

    const { data: session, error } = await supabase.from("sessions").select().eq("name", sessionName);

    if (error) {
      console.log("error")
      throw Error(error.message);
    } else if (!session || !session[0]) {
      console.log("session not found");
    } else {
      console.log(session)
      setTest("part of session: " + session[0].name)
    }

  }

  const createSession = async () => {
    // TODO: Sessions can have same name -> joining will always just use first session returned 
    // create new supabase entry with this sessionName -> check if already there -> maybe append invisible hash
    // join session
    // route to session site
    setTest("Creating " + sessionName);

    if (sessionName === "") {
      console.log(" Please provide Session ID")
      //throw Error("Provide Session ID");
    }

    const res = await supabase.from("sessions").insert({ id: uuidv4(), name: sessionName, game_id: null });

    if (res.error) {
      console.log("error")
      throw Error(res.error.message);
    }

    joinSession();
  }

  const [test, setTest] = useState("");

  return (
    <>
      <h1>The Game Website</h1>

      <input placeholder="Session Name" onChange={e => setSessionName(e.target.value)} ></input>

      <button onClick={createSession}>Create Session</button>
      <button onClick={joinSession}>Join Session</button>

      <p>{test}</p>
    </>
  );
};

export default Home;
