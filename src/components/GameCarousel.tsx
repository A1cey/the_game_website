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
      -left-16 absolute top-[50%] translate-y-[-50%] size-6 rounded-full 
      flex justify-center items-center
      dark:border-2 dark:border-primary 
      bg-primary dark:bg-transparent"
    >
      <ArrowLeftIcon filled={true} className="text-primary-foreground dark:text-primary" />
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
      -right-16 absolute top-[50%] translate-y-[-50%] size-6 rounded-full 
      flex justify-center items-center
      bg-primary dark:bg-transparent
      dark:border-2 dark:border-primary"
    >
      <ArrowRightIcon filled={true} className="text-primary-foreground dark:text-primary" />
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
  const [activeSlide, setActiveSlide] = useState(0);

  const sliderRef = useRef<Slider | null>(null);
  const isRender = useRef(true);
  
  const {t} = useTranslation();

  const updateGameTypeAtDB = useCallback(() => {
    const gameName = getEnumValues(Games).find(val => Games[val] === currentGame) ?? null;

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
        if (error) {
          console.error("Error updating the game selection: ", error);
        }
      });
  }, [gameId, currentGame]);

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

  const settings = {
    // biome-ignore lint/suspicious/noExplicitAny: The type of the function is not known, so it is set to any.
    appendDots: (dots: any) => (
      <div>
        {" "}
        <ul className="translate-y-6 m-0 flex gap-2 justify-center items-center"> {dots} </ul>
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
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    className: "center",
    centerPadding: "0px",
    swipeToSlide: true,
    focusOnSelect: true,
    variableWidth: false,
    beforeChange: (_: number, next: number) => {
      setActiveSlide(next);
    },
    style: { width: "56rem" },
  };

  return (
    <div className="flex-col flex gap-8">
      <h2 className="text-3xl dark:text-primary text-center">{t("selectGame")}</h2>
      <div className="relative w-[58rem] mx-auto h-[21rem]">
        <div className="absolute inset-0 dark:border-2 rounded-2xl dark:border-primary bg-foreground-200 dark:bg-transparent flex justify-center items-center">
          <div className="relative z-10 max-w-4xl mx-auto">
            <Slider
              ref={slider => {
                sliderRef.current = slider;
              }}
              {...settings}
            >
              {gameImgs.map((img, idx) => (
                // biome-igore lint/suspicious/noArrayIndexKey: The key is the index of the array, which is fine in this case.
                <div key={idx} className="bg-opacity-0">
                  <img src={img} alt={getAltNameForGameSVG(gameImgs[idx])} />
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
