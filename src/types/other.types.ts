import type { SVGProps } from "react";

export type SVGElementProps = SVGProps<SVGSVGElement> & {
  filled?: boolean;
  size?: number | string;
};
