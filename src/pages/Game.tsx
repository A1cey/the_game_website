import GameHeader from "@/components/GameHeader";
import LittleMaxGame from "@/components/little_max/LittleMaxGame";
import useGameStore from "@/hooks/useGameStore";
import useSessionStore from "@/hooks/useSessionStore";
import useThemeStore from "@/hooks/useThemeStore";
import { Games, LittleMaxGameState, PlayerLive } from "@/types/game.types";
import supabase from "@/utils/supabase";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, useDisclosure } from "@nextui-org/modal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Game = () => {
  const currentGame = useGameStore(state => state.game.game_state?.game);
  const [showLives, setShowLives] = useState(true);
  const [lives, setLives] = useState<PlayerLive[]>([]);
  const gameState = useGameStore(state => state.game.game_state?.state);
  const [game, setGame] = useState<JSX.Element | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const navigate = useNavigate();
  const sessionName = useSessionStore(state => state.session.name);

  const [isNavigating, setIsNavigating] = useState(false);
  
  const theme = useThemeStore(state => state.theme);

  useEffect(() => {
    if (winner) {
      handleGameEnd();
    }
  }, [winner]);
  
  useEffect(() => {
    if (currentGame === undefined) {
      console.error("No game chosen.");
      return;
    }

    const game = Games[currentGame as unknown as keyof typeof Games] as unknown as Games;

    switch (Number(game)) {
      case Games.ASSHOLE:
        setGame(<div>Not implemented.</div>);
        break;
      case Games.DURAK:
        setGame(<div>Not implemented.</div>);
        break;
      case Games.LITTLE_MAX:
        setLives((gameState as LittleMaxGameState).lives);
        setShowLives(true);
        setGame(<LittleMaxGame setWinner={setWinner} onLivesChange={setLives} />);
        break;
      case Games.POKER:
        setGame(<div>Not implemented.</div>);
        break;
      case Games.THIRTY_ONE:
        setGame(<div>Not implemented.</div>);
        break;
      case Games.WERWOLF:
        setGame(<div>Not implemented.</div>);
        break;
      default:
        throw new Error(`Unknown game: ${currentGame}`);
    }
  }, [currentGame, setGame]);

  const handleGameEnd = async () => {
      if (!winner || isNavigating) return;
      setIsNavigating(true);
      
      try {
        console.log("showing end screen")
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log("navigating to session")
        navigate("/session", { replace: true });
      } catch (error) {
        console.error("Error ending game:", error);
        setIsNavigating(false);
      }
    };

  
  if (isNavigating) {
    return (<Modal
      hideCloseButton={true}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={true}
      size="5xl"
      classNames={{
        body: ` ${theme === "dark" ? "bg-default-800 text-default" : ""}`,
      }}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalBody>
              <div className="size-full h-96 flex justify-center items-center text-9xl text-warning text-center  text-nowrap">
                {`${winner} won!`}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>);
  }
  
  return (
    <div className="h-full">
      <GameHeader showLives={showLives} lives={lives} />
      {game}      
    </div>
  );
};

export default Game;
