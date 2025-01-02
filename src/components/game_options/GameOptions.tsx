import { Games } from "@/types/game.types";
import ArschlochOptions from "./ArschlochOptions";
import DurakOptions from "./DurakOptions";
import MaexleOptions from "./MaexleOptions";
import PokerOptions from "./PokerOptions";
import SchwimmenOptions from "./SchwimmenOptions";
import WerwolfOptions from "./WerwolfOptions";

const GameOptions = ({ currentGame }: { currentGame: Games | undefined }) => {
	let currentOptions = null;

	if (typeof currentGame !== "undefined") {
		switch (Number(currentGame)) {
			case Games.ARSCHLOCH:
				currentOptions = <ArschlochOptions />;
				break;
			case Games.DURAK:
				currentOptions = <DurakOptions />;
				break;
			case Games.MAEXLE:
				currentOptions = <MaexleOptions />;
				break;
			case Games.POKER:
				currentOptions = <PokerOptions />;
				break;
			case Games.SCHWIMMEN:
				currentOptions = <SchwimmenOptions />;
				break;
			case Games.WERWOLF:
				currentOptions = <WerwolfOptions />;
				break;
		}
	}

	return (
		<Popover>
			<PopoverTrigger className="w-40">
				<Button variant="outline" disabled={!currentOptions}>
					Game Options
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				{currentOptions || <div>No options available</div>}
			</PopoverContent>
		</Popover>
	);
};

export default GameOptions;
