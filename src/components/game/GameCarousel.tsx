import { defaultGameState, getAltNameForGameSVG } from "@/utils/game";
import {  useEffect, useMemo, useRef, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useGameStore from "@/hooks/useGameStore";
import usePlayerStore from "@/hooks/usePlayerStore";
import useSessionStore from "@/hooks/useSessionStore";
import useThemeStore from "@/hooks/useThemeStore";
import { GameType, type GameType_t } from "@/types/game/game.types";
import { updateDBGameState } from "@/utils/supabase";
import { Button } from "@nextui-org/button";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import ArrowLeftIcon from "../icons/ArrowLeft";
import ArrowRightIcon from "../icons/ArrowRight";

type ArrowProps = {
  // biome-ignore lint/suspicious/noExplicitAny: The type of the function is not known, so it is set to any.
  onClick?: any;
  theme: string;
  disabled: boolean;
};

const ArrowLeft = ({ onClick, disabled }: ArrowProps) => {
  return (
    <Button
      disabled={disabled}
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

const ArrowRight = ({ onClick, disabled }: ArrowProps) => {
  return (
    <Button
      disabled={disabled}
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
  const host = useSessionStore(state => state.session.host);
  const playerId = usePlayerStore(state => state.player.id);

  const disabled = useMemo(() => !!(host && playerId &&playerId !== host), [host, playerId]);
  const [activeSlide, setActiveSlide] = useState(
    Object.values(GameType.enum).indexOf(gameState?.game ?? GameType.enum.ASSHOLE),
  );

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const sliderRef = useRef<Slider | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateGameTypeAtDB = async (nextGame: GameType_t) => {
    if (!gameId) {
      console.error("Error updating the game selection: Game id not set.");
      return;
    }

    console.log("updating game type at db");

    await updateDBGameState(gameId, gameState?.state ?? {}, nextGame ? defaultGameState(nextGame) : {});
  };

  // handling changes from db
  useEffect(() => {
    if (!gameState?.game) {
      return;
    }

    const newSlideIndex = Object.values(GameType.enum).indexOf(gameState.game);

    if (newSlideIndex !== -1 && newSlideIndex !== activeSlide) {
      console.log("Setting slide");
      sliderRef.current?.slickGoTo(newSlideIndex);
    }
  }, [gameState]);

  // update db if player is host
  useEffect(() => {
    if (disabled) {
      return;
    }

    const nextGame = Object.values(GameType.enum)[activeSlide];
    updateGameTypeAtDB(nextGame);
  }, [activeSlide]);

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
    nextArrow: <ArrowRight theme={theme} disabled={disabled} />,
    prevArrow: <ArrowLeft theme={theme} disabled={disabled} />,
    dots: true,
    arrows: !disabled,
    infinite: true,
    speed: 600,
    slidesToShow: windowWidth < 1024 ? 2 : 3,
    slidesToScroll: 1,
    centerMode: windowWidth >= 1024,
    centerPadding: "0px",
    swipeToSlide: !disabled,
    swipe: !disabled,
    draggable: !disabled,
    touchMove: !disabled,
    focusOnSelect: true,
    variableWidth: false,
    beforeChange: (_: number, next: number) => {
      setActiveSlide(next);
    },
  };

  return (
    <div className="flex-col flex gap-4 lg:gap-8">
      <h2 className="text-2xl lg:text-3xl dark:text-primary text-center">
        {disabled ? t("waitGameSelect") : t("selectGame")}
      </h2>
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
                // biome-ignore lint/suspicious/noArrayIndexKey: The key is the index of the array, which is fine in this case.
                <div key={idx} className="bg-opacity-0">
                  <img src={img} alt={getAltNameForGameSVG(gameImgs[idx])} className="size-32 lg:size-72" />
                </div>
              ))}
            </Slider>
            <style>{
              // disables dots when not host
              `.slick-dots li div {
                pointer-events: ${disabled ? 'none': 'auto' };
              }
              .slick-dots li  {
                cursor: ${disabled ? 'default': 'pointer' };
              }
              `
            }</style>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCarousel;
