import { useEffect, useState } from "react";
import { Games } from "@/types/game.types";
import { getAltNameForGame } from "@/utils/game";
import { getEnumValues } from "@/utils/other";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

type CarouselProps = {
  gameImgs: string[];
  setCurrentGame: React.Dispatch<React.SetStateAction<string>>;
};

const GameCarousel = ({ gameImgs, setCurrentGame }: CarouselProps) => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setCurrentGame(Games[getEnumValues(Games)[activeSlide]]);
  }, [activeSlide, setCurrentGame]);

  const settings = {
    customPaging: (i: number) => {
      return (
        <a>
          <img src={gameImgs[i]} alt={getAltNameForGame(gameImgs[i])} />
        </a>
      );
    },
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
    <div className="p-10 max-w-4xl mx-auto">
      <Slider {...settings}>
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
