import { Button as NextUIButton } from "@nextui-org/react";
import { forwardRef } from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "solid", color = "primary", size = "md", ...props }, ref) => {
    return (
      <NextUIButton
        ref={ref}
        variant={variant}
        color={color}
        size={size}
        {...props}
      >
        {children}
      </NextUIButton>
    );
  }
);

Button.displayName = "Button";
