import { useCallback, useEffect, useRef, useState } from "react";
import { Games } from "@/types/game.types";
import { defaultDBGameState, getAltNameForGameSVG } from "@/utils/game";
import { getEnumValues } from "@/utils/other";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Button } from "@nextui-org/button";
import useThemeStore from "@/hooks/useThemeStore";
import useGameStore from "@/hooks/useGameStore";
import supabase from "@/utils/supabase";
import type { Json } from "@/types/database.types";
import useSessionStore from "@/hooks/useSessionStore";
import ArrowLeftIcon from "./icons/ArrowLeft";
import ArrowRightIcon from "./icons/ArrowRight";
import { useTranslation } from "react-i18next";

type ArrowProps = {
  // biome-ignore lint/suspicious/noExplicitAny: The type of the function is not known, so it is set to any.
  onClick?: any;
  theme: string;
};

const ArrowLeft = ({ onClick }: ArrowProps) => {
  return (
    <Button
      isIconOnly
      aria-label="Settings"
      onPress={() => onClick()}
      className="
      hover:scale-[1.05]
      absolute -top-[47.5%] left-4 lg:-left-20 lg:top-[50%] lg:translate-y-[-50%] rounded-full
      flex justify-center items-center
      lg:dark:border-2 lg:dark:border-primary 
      bg-primary dark:bg-transparent"
    >
      <ArrowLeftIcon filled={true} className="text-primary-foreground dark:text-primary size-4 lg:size-5" />
    </Button>
  );
};

const ArrowRight = ({ onClick }: ArrowProps) => {
  return (
    <Button
      isIconOnly
      aria-label="Settings"
      onPress={() => onClick()}
      className="
      hover:scale-[1.05]
      right-4 -top-[47.5%] lg:-right-[4.25rem] absolute lg:top-[50%] lg:translate-y-[-50%] rounded-full 
      flex justify-center items-center
      bg-primary dark:bg-transparent
      lg:dark:border-2 lg:dark:border-primary"
    >
      <ArrowRightIcon filled={true} className="text-primary-foreground dark:text-primary size-4 lg:size-5" />
    </Button>
  );
};

type CarouselProps = {
  gameImgs: string[];
};

const GameCarousel = ({ gameImgs }: CarouselProps) => {
  const theme = useThemeStore(state => state.theme);
  const gameId = useSessionStore(state => state.session.game_id);
  const gameState = useGameStore(state => state.game.game_state);

  const [currentGame, setCurrentGame] = useState(gameState?.game.toString() ?? Object.values(Games)[0].toString());
  const [activeSlide, setActiveSlide] = useState(gameState?.game ?? 0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const sliderRef = useRef<Slider | null>(null);
  const isRender = useRef(true);

  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateGameTypeAtDB = useCallback(() => {
    const gameName = getEnumValues(Games).find(val => Games[val] === currentGame) ?? null;

    if (!gameId) {
      console.error("Error updating the game selection: Game id not set.");
      return;
    }

    console.log("updating game type at db");
    console.log();

    supabase
      .from("games")
      .update({
        game_state: gameName === 0 || gameName ? (defaultDBGameState(gameName) as Json) : null,
      })
      .eq("id", gameId)
      .then(({ error }) => {
        if (error) {
          console.error("Error updating the game selection: ", error);
        }
      });
  }, [gameId, currentGame]);

  // handling changes from other players
  useEffect(() => {
    if (!gameState?.game) {
      return;
    }

    const newSlideIndex = getEnumValues(Games).findIndex(val => Games[val] === gameState.game.toString());

    if (newSlideIndex !== -1 && newSlideIndex !== activeSlide) {
      console.log("Setting slide");
      sliderRef.current?.slickGoTo(newSlideIndex);
    }
  }, [gameState]);

  useEffect(() => {
    if (isRender.current) {
      isRender.current = false;
      return;
    }

    setCurrentGame(Games[getEnumValues(Games)[activeSlide]]);
  }, [activeSlide, setCurrentGame]);

  useEffect(() => {
    if (isRender.current) {
      isRender.current = false;
      return;
    }

    updateGameTypeAtDB();
  }, [currentGame]);

  const settings = {
    // biome-ignore lint/suspicious/noExplicitAny: The type of the function is not known, so it is set to any.
    appendDots: (dots: any) => (
      <div>
        {" "}
        <ul className="-translate-x-2 lg:translate-x-0 translate-y-4 lg:translate-y-6 lg:m-0 flex gap-1 lg:gap-2 justify-center items-center">
          {" "}
          {dots}{" "}
        </ul>
      </div>
    ),
    customPaging: (i: number) => (
      <div
        className={`size-7 p-0 m-0 rounded-full border-2 ${
          i === activeSlide
            ? "bg-primary-300 text-primary-foreground border-0 border-primary-foreground dark:border-primary-700 dark:text-primary-700 dark:bg-transparent"
            : "bg-primary text-primary-foreground border-0 border-primary-foreground dark:border-primary hover:scale-[1.11] dark:text-primary dark:bg-transparent"
        }`}
      >
        {i + 1}
      </div>
    ),
    nextArrow: <ArrowRight theme={theme} />,
    prevArrow: <ArrowLeft theme={theme} />,
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: windowWidth < 1024 ? 2 : 3,
    slidesToScroll: 1,
    centerMode: windowWidth >= 1024,
    centerPadding: "0px",
    swipeToSlide: true,
    focusOnSelect: true,
    variableWidth: false,
    beforeChange: (_: number, next: number) => {
      setActiveSlide(next);
    },
  };

  return (
    <div className="flex-col flex gap-4 lg:gap-8">
      <h2 className="text-2xl lg:text-3xl dark:text-primary text-center">{t("selectGame")}</h2>
      <div className="relative w-[20rem] h-[10rem] lg:h-[21rem] lg:w-[58rem] mx-auto">
        <div className="absolute inset-0 dark:border-2 rounded-2xl dark:border-primary bg-foreground-200 dark:bg-transparent flex justify-center items-center">
          <div className="relative ml-3.5 lg:ml-5 z-10 lg:max-w-4xl mx-auto">
            <Slider
              ref={slider => {
                sliderRef.current = slider;
              }}
              {...settings}
              className={` w-[18rem] lg:w-[56rem] ${windowWidth >= 1024 ? "center" : ""}`}
            >
              {gameImgs.map((img, idx) => (
                // biome-igore lint/suspicious/noArrayIndexKey: The key is the index of the array, which is fine in this case.
                <div key={idx} className="bg-opacity-0">
                  <img src={img} alt={getAltNameForGameSVG(gameImgs[idx])} className="size-32 lg:size-72" />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCarousel;
