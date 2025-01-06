import { useCallback, useEffect, useRef, useState } from "react";
import { Games } from "@/types/game.types";
import { defaultDBGameState, getAltNameForGame } from "@/utils/game";
import { getEnumValues } from "@/utils/other";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Button } from "@nextui-org/button";
import useThemeStore from "@/hooks/useThemeStore";
import useGameStore from "@/hooks/useGameStore";
import supabase from "@/utils/supabase";
import { Json } from "@/types/database.types";
import useSessionStore from "@/hooks/useSessionStore";
import ArrowLeftIcon from "./icons/ArrowLeft";
import ArrowRightIcon from "./icons/ArrowRight";

type ArrowProps = {
  onClick?: any,
  theme: string
}

const ArrowLeft = ({ onClick }: ArrowProps) => {
  return (
    <Button isIconOnly aria-label="Settings" onPress={()=> onClick()}
      className="
      hover:scale-[1.05]
      -left-16 absolute top-[50%] translate-y-[-50%] size-6 rounded-full 
      flex justify-center items-center
      dark:border-2 dark:border-primary 
      bg-primary dark:bg-transparent"
      >
        <ArrowLeftIcon filled={true} className="text-primary-foreground dark:text-primary" />
    </Button>
  )
}

const ArrowRight = ({ onClick}: ArrowProps) => {
  return (
    <Button isIconOnly aria-label="Settings" onPress={()=> onClick()}
      className="
      hover:scale-[1.05]
      -right-16 absolute top-[50%] translate-y-[-50%] size-6 rounded-full 
      flex justify-center items-center
      bg-primary dark:bg-transparent
      dark:border-2 dark:border-primary">
      <ArrowRightIcon filled={true} className="text-primary-foreground dark:text-primary" />
    </Button>
  )
}

type CarouselProps = {
  gameImgs: string[];
};

const GameCarousel = ({ gameImgs }: CarouselProps) => {
  const theme = useThemeStore(state => state.theme);
  const gameId = useSessionStore(state => state.session.game_id);
  const gameState = useGameStore(state => state.game.game_state);
  
  const [currentGame, setCurrentGame] = useState(gameState?.game.toString() ?? Object.values(Games)[0].toString());
  const [activeSlide, setActiveSlide] = useState(0);
  
  const sliderRef = useRef<Slider | null>(null); 
  const isRender = useRef(true);
  
  const updateGameTypeAtDB = useCallback(() => {
    const gameName = getEnumValues(Games).find(val => Games[val] === currentGame) ?? null;

    console.log("Setting new game: ", gameName);
    
    if (!gameId) {
      console.error("Error updating the game selection: Game id not set.");
      return;
    }
    
    supabase
      .from("games")
      .update({
        game_state: gameName === 0 || gameName ? (defaultDBGameState(gameName) as Json) : null,
      })
      .eq("id", gameId)
      .then(({ error }) => {
        if (error) console.error("Error updating the game selection: ", error);
      });
  }, [gameId, currentGame]);
  
  useEffect(() => {
    if (isRender.current) {
      isRender.current = false;
      return;
    }
    
    console.log("Setting current game: ", activeSlide, Games[getEnumValues(Games)[activeSlide]])
    setCurrentGame(Games[getEnumValues(Games)[activeSlide]]);
  }, [activeSlide, setCurrentGame]);
  
  useEffect(() => {
    if (isRender.current) {
      isRender.current = false;
      return;
    }
    
    updateGameTypeAtDB();
  }, [currentGame]);
  
  // handling changes from other players
  useEffect(() => {
    console.log("checking for needed slide update");
    if (!gameState?.game) {
      return;
    }
    
    const newSlideIndex = getEnumValues(Games).findIndex(
      val => Games[val] === gameState.game.toString()
    );
    
    if (newSlideIndex !== -1 && newSlideIndex !== activeSlide) {
      console.log("Setting slide");
      sliderRef.current?.slickGoTo(newSlideIndex);
    }
  }, [gameState]);

  const settings = {
    appendDots: (dots: any) => (<div> <ul className="translate-y-4 m-0 flex gap-2 justify-center items-center"> {dots} </ul></div>),
    customPaging: (i: number) => (<div className={`size-7 p-0 m-0 rounded-full border-2 ${i === activeSlide 
      ? "bg-primary-300 text-primary-foreground border-0 border-primary-foreground dark:border-primary-700 dark:text-primary-700 dark:bg-transparent" 
      : "bg-primary text-primary-foreground border-0 border-primary-foreground dark:border-primary hover:scale-[1.11] dark:text-primary dark:bg-transparent"}`
    } >{i + 1}</div>),
    nextArrow: <ArrowRight theme={theme} />,
    prevArrow: <ArrowLeft theme={theme} />,
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    className: "center",
    centerPadding: "0px",
    swipeToSlide: true,
    focusOnSelect: true,
    beforeChange: (_: number, next: number) => {
      setActiveSlide(next);
    },    
  };

  return (
    <div className="flex-col flex gap-8">
    <h2 className="text-3xl dark:text-primary text-center">Select a Game</h2>
    <div className="dark:border-2 relative overflow-visible h-[19rem] w-[53rem] rounded-2xl dark:border-primary flex justify-center bg-foreground-200 dark:bg-transparent">
      <div className="-translate-y-[1.75rem] absolute p-10 max-w-4xl mx-0 overflow-visible ">
        <Slider
          ref={slider => {sliderRef.current = slider}}       
          {...settings}>
          {gameImgs.map((img, idx) => (
            <div key={idx} className="bg-opacity-0 ">
              <img src={img} alt={getAltNameForGame(gameImgs[idx])} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
    </div>
  );
};

export default GameCarousel;
