import supabase from "@/utils/supabase";
import GameCarousel from "@/components/GameCarousel";
import GameOptions from "@/components/game_options/GameOptions";
import useSessionStore from "@/hooks/useSessionStore";
import useGameStore from "@/hooks/useGameStore";
import ButtonBordered from "@/components/ui/ButtonBordered";
import { formatGameName, getGameImgs } from "@/utils/game";
import SessionHeader from "@/components/SessionHeader";
import { useNavigate } from "react-router-dom";
import GameRules from "@/components/GameRules";
import { useTranslation } from "react-i18next";

const Session = () => {
  const session = useSessionStore(state => state.session);
  const currentGame = useGameStore(state => state.game.game_state?.game);
  const navigate = useNavigate();
  
  const {t }= useTranslation();

  const startGame = async () => {
    supabase.rpc("start_game", { session_name: session.name }).then(({ error }) => {
      if (error) {
        console.log("Error while starting game: ", error);
      } else {
        navigate("/game");
      }
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-28 justify-center">
        <SessionHeader />
        <div className="">
          <GameCarousel gameImgs={getGameImgs(t)} />
        </div>
        <div className="flex gap-28 justify-center">
          <div className="w-1/3 flex justify-end">
            <GameRules />
          </div>
          <div className="w-1/3 flex justify-center">
            <GameOptions/>
          </div>
          <div className="flex w-1/3">
            <ButtonBordered onPress={startGame}>
              {t("startGame", {game: currentGame? formatGameName(currentGame.toString(), t) : ""})}
            </ButtonBordered>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Session;
