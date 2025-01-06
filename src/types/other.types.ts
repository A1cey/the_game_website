import type { SVGProps } from "react";

export type Enum = Record<string | number, string | number>;

export type SVGElementProps = SVGProps<SVGSVGElement> & {
  filled?: boolean;
  size?: number | string;
};
