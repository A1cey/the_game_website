import useThemeStore from "@/hooks/useThemeStore";
import { Button, ButtonProps } from "@nextui-org/button";



const ButtonBordered = ({ onPress, children, as, href, disabled}: ButtonProps) => {
  const { theme } = useThemeStore();
  
  return (
    <Button
      className="active:scale-[0.98] hover:scale-[1.05] font-semibold"
      color="primary"
      variant={theme === "dark" ? "bordered" : "solid"}
      onPress={onPress}
      as={as}
      href={href}
      disabled= {disabled}
    >
      {children}
    </Button>
  )
};

export default ButtonBordered;