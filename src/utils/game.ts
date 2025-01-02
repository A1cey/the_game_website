import { type Card, CardType, CardValue, Games } from "@/types/game.types";
import { getEnumValues } from "./other";

export const getGameImgs = (): string[] => {
	return getEnumValues(Games).map(key =>
		"src/assets/".concat(Games[key].toLowerCase(), ".svg"),
	);
};

export const getAltNameForGame = (str: string): string => {
	const name = str.replace("src/assets/", "").replace(".svg", "");
	return name.substring(0, 1).toUpperCase() + name.substring(1);
};

export const getCards = (): Card[] => {
	return getEnumValues(CardType).flatMap(cardType =>
		getEnumValues(CardValue).map(
			cardValue => [cardType, cardValue] as Card,
		),
	);
};

export const validPlayerCount = (
	playerCount: number,
	minPlayersAllowed: number = 1,
	maxPlayersAllowed: number = 20,
): boolean => {
	if (minPlayersAllowed < 1) {
		console.error(
			"There need to be at least one player allowed for this game.",
		);
		return false;
	}

	if (playerCount < minPlayersAllowed) {
		console.error(
			`Too few players. There need to be at least ${minPlayersAllowed} for this game.`,
		);
		return false;
	}

	if (playerCount > maxPlayersAllowed) {
		console.error(
			`Too many players. There can only be ${minPlayersAllowed} in this game.`,
		);
		return false;
	}

	return true;
};

