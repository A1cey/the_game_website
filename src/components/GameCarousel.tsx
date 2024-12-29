import { useEffect, useState } from "react";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";

type CarouselProps = { gameImgs: string[]; setCurrentGame: React.Dispatch<React.SetStateAction<number>> }

const GameCarousel = ({ gameImgs, setCurrentGame }: CarouselProps) => {
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentGame(api.selectedScrollSnap());

    api.on("select", () => setCurrentGame(api.selectedScrollSnap()))

  }, [api]);


  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-sm"
    >
      <CarouselContent className="-ml-1 md:-ml-4">
        {
          gameImgs.map((img, idx) => (
            <CarouselItem key={idx} className="pl-1 lg:basis-1/3 md:pl-4 md:basis-1/2">
              <div className="p-1">
                <img src={img} alt={`Game image ${idx + 1}`} />
              </div>
            </CarouselItem>
          )
          )
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default GameCarousel;
