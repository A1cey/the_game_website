import { useEffect, useState } from "react";
import { Games } from "@/types/game.types";
import { getAltNameForGame } from "@/utils/game";
import { getEnumValues } from "@/utils/other";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

type ArrowProps = {
  direction: "next" | "prev",
  onClick: any,
  style: any
  className: any
}

const Arrow = ({ direction, onClick, style, className }: ArrowProps) => {
  return ( <div
       className={`${className} border-2px border-primary rounded-3xl`}
       style={{ ...style }}
       onClick={onClick}
     />
  );
}

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
    appendDots: (dots: any) => (<div> <ul className="m-0 flex gap-2 justify-center items-center"> {dots} </ul></div>),
    customPaging: (i: number) => (<div className={`size-7 p-0 m-0 rounded-3xl border-2 ${i === activeSlide ? "border-primary-700 text-primary-700" : "border-primary hover:scale-[1.11] text-primary"}`} >{i + 1}</div>),
    //nextArrow: <Arrow direction="next" />,
    prevArrow: <Arrow direction="prev" />,
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
