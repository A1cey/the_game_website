import { useEffect, useState } from "react";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Games } from "@/types/game.types";
import { getAltNameForGame } from "@/utils/game";

type CarouselProps = {
	gameImgs: string[];
	setCurrentGame: React.Dispatch<React.SetStateAction<string>>;
};

const GameCarousel = ({ gameImgs, setCurrentGame }: CarouselProps) => {
	const [api, setApi] = useState<CarouselApi>();

	useEffect(() => {
		if (!api) {
			return;
		}

		setCurrentGame(
			Object.keys(Games).filter(key => isNaN(Number(key)))[
				api.selectedScrollSnap()
			],
		);

		api.on("select", () =>
			setCurrentGame(
				Object.keys(Games).filter(key => isNaN(Number(key)))[
					api.selectedScrollSnap()
				],
			),
		);
	}, [api, setCurrentGame]);

	console.log(gameImgs);

	return (
		<Carousel
			setApi={setApi}
			opts={{
				align: "center",
				loop: true,
			}}
			className="w-full max-w-5xl"
		>
			<CarouselContent className="-ml-1 md:-ml-4">
				{gameImgs.map((img, idx) => (
					<CarouselItem
						key={idx}
						className="pl-1 lg:basis-1/3 md:pl-4 md:basis-1/2"
					>
						<div className="p-1">
							<img
								src={img}
								alt={getAltNameForGame(gameImgs[idx])}
							/>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
};

export default GameCarousel;
