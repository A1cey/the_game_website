import { Enum } from "@/types/other.types";

/**
 * @param {E extends Enum} e - The enum the values should be provided for.
 * @returns Array of the enum values as numeric keys. To get the representation as a string use <e>[key].
 */
export const getEnumValues = <E extends Enum>(e: E): E[keyof E][] => {
	return Object.keys(e)
		.filter(key => Number.isNaN(Number(key)))
		.map(key => e[key as keyof E]) as E[keyof E][];
};