import { Button as AntdButton } from "antd";
import { forwardRef } from "react";

interface ButtonProps {
  children: React.ReactNode;
  type?: "default" | "primary" | "dashed" | "text" | "link";
  size?: "small" | "middle" | "large";
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  danger?: boolean;
  ghost?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, type = "primary", size = "middle", ...props }, ref) => {
    return (
      <AntdButton
        ref={ref}
        type={type}
        size={size}
        {...props}
      >
        {children}
      </AntdButton>
    );
  }
);

Button.displayName = "Button";
