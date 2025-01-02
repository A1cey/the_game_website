import { useContext, useState } from "react";
import supabase from "@/utils/supabase";
import { NavLink } from "react-router-dom";
import { GameCtx, PlayerCtx, SessionCtx } from "@/App";
import GameCarousel from "@/components/GameCarousel";
import { Button } from "@/components/ui/button";
import { getGameImgs } from "@/utils/game";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox";

const Session = () => {
  const [currentGame, setCurrentGame] = useState("");
  const { session, updateSession } = useContext(SessionCtx);
  const { player, updatePlayer } = useContext(PlayerCtx);
  const { game, updateGame } = useContext(GameCtx);

  const removePlayerFromSession = async () => {
    supabase
      .from("players")
      .delete()
      .eq("id", player.id)
      .then(({ error }) => {
        if (error) console.error(error);
      });
  };

  const startGame = async () => {
    supabase
      .rpc("start_game", { session_name: session.name })
      .then(({ error }) => {
        if (error) console.log("Error while starting game: ", error);
      });
  };

  console.log(session, game, player);

  return (
    <div>
      <div className="p-2 flex gap-20 w-full">
        <NavLink
          to={"/"}
          onClick={removePlayerFromSession}
          className="ml-10 text-xl bg-blue-400 rounded"
        >
          Home
        </NavLink>
        <div className="ml-10 text-xl ">
          Players: {session.num_of_players}
        </div>
      </div>
      <div className="grid gap-4 justify-center">
        <div className="mt-40">
          <GameCarousel
            gameImgs={getGameImgs()}
            setCurrentGame={setCurrentGame}
          />
        </div>
        <p className=" text-xl">Selected Game: {currentGame}</p>
        {/* put in component options */}
        <Dialog>
          <DialogTrigger asChild className="w-40">
            <Button variant="outline">Game Options</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Game Options</DialogTitle>
            </DialogHeader>
            {/* for each game different */}
            <div className="flex items-center space-x-2">
              <label
                htmlFor="maexle-pass-on"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Little Max can be passed to next player
              </label>
              <Checkbox id="maexle-pass-on" />
            </div>
          </DialogContent>
        </Dialog>
        <Button className="w-40 text-xl" onClick={startGame}>
          Start
        </Button>
      </div>
    </div>
  );
};

export default Session;
