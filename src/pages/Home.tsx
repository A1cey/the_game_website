import { useContext, useState } from "react";
import supabase from "@/utils/supabase";
import { useNavigate } from "react-router-dom";
import { PlayerCtx, SessionCtx } from "@/App";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import "@/index.css";
import type { Player_t, Session_t } from "@/types/database_extended.types";

const Home = () => {
	const [sessionName, setSessionName] = useState("");
	const [playerName, setPlayerName] = useState("");
	const { updatePlayer } = useContext(PlayerCtx);
	const { updateSession } = useContext(SessionCtx);
	const navigate = useNavigate();

	const createPlayer = async () => {
		const { data, error } = await supabase
			.from("players")
			.insert({
				session_name: sessionName,
				name: playerName !== "" ? playerName : null,
			})
			.select()
			.single();

		if (error) {
			console.error("Error fetching session:", error);
			return;
		}

		if (data) {
			updatePlayer(data as Player_t);
		}
	};

	const createSession = async () => {
		if (sessionName === "") {
			console.error("Please provide Session Name");
			return;
		}

		const { data, error } = await supabase
			.from("sessions")
			.insert({ name: sessionName })
			.select()
			.single();

		if (error) {
			console.error("Error fetching session:", error);
			return;
		}

		if (data) {
			updateSession(data as Session_t);

			await createPlayer();

			navigate("session");
		}
	};

	const joinSession = async () => {
		console.log("Joining");

		if (sessionName === "") {
			console.error(" Please provide a session name.");
			return;
		}

		const { data, error } = await supabase
			.from("sessions")
			.select()
			.eq("name", sessionName)
			.single();

		if (error) {
			console.error("Error fetching session:", error);
			return;
		}

		if (data) {
			if (data.num_of_players === data.max_num_of_players) {
				console.warn("Session is full.");
				return;
			}

			if (data.game_started_at) {
				console.warn("Session is currently in a game.");
				return;
			}

			updateSession(data as Session_t);

			await createPlayer();

			navigate("session");
		}
	};

	return (
		<div className="grid gap-4 justify-center">
			<h1 className="mt-40 text-4xl font-bold text-center">
				The Game Website
			</h1>

			<Input
				className="mt-20 hover:bg-gray-200 hover:scale-[1.05] "
				placeholder="Player Name"
				onChange={e => setPlayerName(e.target.value)}
			/>
			<Input
				className="hover:bg-gray-200 hover:scale-[1.05] "
				placeholder="Session Name"
				onChange={e => setSessionName(e.target.value)}
			/>
			<div className="flex gap-4 justify-center">
				<Button
					className="active:scale-[0.98] hover:scale-[1.05] font-semibold"
					variant="outline"
					onClick={createSession}
				>
					Create Session
				</Button>
				<Button
					className="active:scale-[0.98] hover:scale-[1.05] font-semibold"
					variant="outline"
					onClick={joinSession}
				>
					Join Session
				</Button>
			</div>
		</div>
	);
};

export default Home;
