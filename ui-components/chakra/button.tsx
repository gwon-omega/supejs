import { Button as ChakraButton } from "@chakra-ui/react";
import { forwardRef } from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "solid" | "outline" | "ghost" | "link";
  colorScheme?: "blue" | "green" | "red" | "gray" | "teal" | "purple";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "solid", colorScheme = "blue", size = "md", ...props }, ref) => {
    return (
      <ChakraButton
        ref={ref}
        variant={variant}
        colorScheme={colorScheme}
        size={size}
        {...props}
      >
        {children}
      </ChakraButton>
    );
  }
);

Button.displayName = "Button";
