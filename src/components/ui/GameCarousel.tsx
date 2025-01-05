import { useCallback, useEffect, useRef, useState } from "react";
import { Games } from "@/types/game.types";
import { defaultDBGameState, getAltNameForGame } from "@/utils/game";
import { getEnumValues } from "@/utils/other";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { SVGElementProps } from "@/types/other.types";
import { Button } from "@nextui-org/button";
import useThemeStore from "@/hooks/useThemeStore";
import useGameStore from "@/hooks/useGameStore";
import supabase from "@/utils/supabase";
import { Json } from "@/types/database.types";
import useSessionStore from "@/hooks/useSessionStore";

const ArrowLeftSVG = ({ fill = "currentColor", filled, size, height, width, ...props }: SVGElementProps) => {
  return (
    <svg width={size || width || 20} height={size || height || 20} viewBox="-4.5 0 20 20" fill={filled ? fill : "none"} version="1.1" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g id="Page-1" stroke="none" strokeWidth="1" fill={filled ? fill : "none"} fillRule="evenodd">
        <g id="Dribbble-Light-Preview" transform="translate(-345.000000, -6679.000000)" fill="#000000">
          <g id="icons" transform="translate(56.000000, 160.000000)">
            <path 
              d="M299.633777,6519.29231 L299.633777,6519.29231 C299.228878,6518.90256 298.573377,6518.90256 298.169513,6519.29231 L289.606572,6527.55587 C288.797809,6528.33636 288.797809,6529.60253 289.606572,6530.38301 L298.231646,6538.70754 C298.632403,6539.09329 299.27962,6539.09828 299.685554,6538.71753 L299.685554,6538.71753 C300.100809,6538.32879 300.104951,6537.68821 299.696945,6537.29347 L291.802968,6529.67648 C291.398069,6529.28574 291.398069,6528.65315 291.802968,6528.26241 L299.633777,6520.70538 C300.038676,6520.31563 300.038676,6519.68305 299.633777,6519.29231" 
              fill={fill} />
          </g>
        </g>
      </g>
    </svg>
  )
}

const ArrowRightSVG = ({ fill = "currentColor", filled, size, height, width, ...props }: SVGElementProps) => {
  return (
    <svg width={size || width || 20} height={size || height || 20} viewBox="-4.5 0 20 20" fill={filled ? fill : "none"} version="1.1" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g id="Page-1" stroke="none" strokeWidth="1" fill={filled ? fill : "none"} fillRule="evenodd">
        <g id="Dribbble-Light-Preview" transform="translate(-305.000000, -6679.000000)" fill="#000000">
          <g id="icons" transform="translate(56.000000, 160.000000)">
            <path
              d="M249.365851,6538.70769 L249.365851,6538.70769 C249.770764,6539.09744 250.426289,6539.09744 250.830166,6538.70769 L259.393407,6530.44413 C260.202198,6529.66364 260.202198,6528.39747 259.393407,6527.61699 L250.768031,6519.29246 C250.367261,6518.90671 249.720021,6518.90172 249.314072,6519.28247 L249.314072,6519.28247 C248.899839,6519.67121 248.894661,6520.31179 249.302681,6520.70653 L257.196934,6528.32352 C257.601847,6528.71426 257.601847,6529.34685 257.196934,6529.73759 L249.365851,6537.29462 C248.960938,6537.68437 248.960938,6538.31795 249.365851,6538.70769"
              fill={fill} />
          </g>
        </g>
      </g>
    </svg>
  )
}

type ArrowProps = {
  onClick?: React.MouseEventHandler<SVGSVGElement> ,
  theme: string
}


const ArrowLeft = ({ onClick }: ArrowProps) => {
  return (
    <Button isIconOnly aria-label="Settings" className="
      hover:scale-[1.05]
      -left-16 absolute top-[50%] translate-y-[-50%] size-6 rounded-full 
      flex justify-center items-center
      dark:border-2 dark:border-primary 
      bg-primary dark:bg-transparent"
      >
      <ArrowLeftSVG filled={true} className="text-primary-foreground dark:text-primary" onClick={onClick} />
    </Button>
  )
}

const ArrowRight = ({ onClick }: ArrowProps) => {
  return (
    <Button isIconOnly aria-label="Settings" 
      className="
      hover:scale-[1.05]
      -right-16 absolute top-[50%] translate-y-[-50%] size-6 rounded-full 
      flex justify-center items-center
      bg-primary dark:bg-transparent
      dark:border-2 dark:border-primary">
      <ArrowRightSVG filled={true} className="text-primary-foreground dark:text-primary" onClick={onClick} />
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
    console.log("Setting current game: ", activeSlide, Games[getEnumValues(Games)[activeSlide]])
    setCurrentGame(Games[getEnumValues(Games)[activeSlide]]);
  }, [activeSlide, setCurrentGame]);
  
  useEffect(() => {
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
    appendDots: (dots: any) => (<div> <ul className="m-0 flex gap-2 justify-center items-center"> {dots} </ul></div>),
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
    <div className="p-10 max-w-4xl mx-0">
      <Slider
        ref={slider => {sliderRef.current = slider}}       
        {...settings}>
        {gameImgs.map((img, idx) => (
          <div key={idx} className="bg-opacity-0">
            <img src={img} alt={getAltNameForGame(gameImgs[idx])} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default GameCarousel;
