import useThemeStore from "@/hooks/useThemeStore";
import { Button, ButtonProps } from "@nextui-org/button";
import React from "react";

const ButtonBordered = React.forwardRef<HTMLButtonElement, ButtonProps>((
  { onPress, children, as, href, disabled, ...props}, ref
) => {
  const { theme } = useThemeStore();
  
  return (
    <Button
      ref={ref}
      className="active:scale-[0.98] hover:scale-[1.05] font-semibold"
      color="primary"
      variant={theme === "dark" ? "bordered" : "solid"}
      onPress={onPress}
      as={as}
      href={href}
      disabled= {disabled}
      {...props}
    >
      {children}
    </Button>
  )
});

ButtonBordered.displayName = "ButtonBordered";

export default ButtonBordered;