import { ark } from "@ark-ui/react";
import { styled } from "./styled";

export const Button = styled(ark.button, {
  base: {
    alignItems: "center",
    appearance: "none",
    borderRadius: "l2",
    cursor: "pointer",
    display: "inline-flex",
    fontWeight: "semibold",
    minWidth: "0",
    justifyContent: "center",
    outline: "none",
    position: "relative",
    transitionDuration: "normal",
    transitionProperty: "background, border-color, color, box-shadow",
    transitionTimingFunction: "default",
    userSelect: "none",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    _disabled: {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  },
  variants: {
    variant: {
      solid: {
        background: "colorPalette.solid",
        color: "colorPalette.contrast",
        _hover: {
          background: "colorPalette.emphasized",
        },
        _focusVisible: {
          outline: "2px solid",
          outlineColor: "colorPalette.default",
          outlineOffset: "2px",
        },
      },
      outline: {
        borderWidth: "1px",
        borderColor: "colorPalette.default",
        color: "colorPalette.text",
        _hover: {
          background: "colorPalette.subtle",
        },
        _focusVisible: {
          outline: "2px solid",
          outlineColor: "colorPalette.default",
          outlineOffset: "2px",
        },
      },
      ghost: {
        color: "colorPalette.text",
        _hover: {
          background: "colorPalette.subtle",
        },
        _focusVisible: {
          outline: "2px solid",
          outlineColor: "colorPalette.default",
          outlineOffset: "2px",
        },
      },
    },
    size: {
      xs: {
        h: "8",
        minW: "8",
        textStyle: "xs",
        px: "3",
        gap: "2",
      },
      sm: {
        h: "9",
        minW: "9",
        textStyle: "sm",
        px: "3.5",
        gap: "2",
      },
      md: {
        h: "10",
        minW: "10",
        textStyle: "sm",
        px: "4",
        gap: "2",
      },
      lg: {
        h: "11",
        minW: "11",
        textStyle: "md",
        px: "4.5",
        gap: "2",
      },
      xl: {
        h: "12",
        minW: "12",
        textStyle: "md",
        px: "5",
        gap: "2.5",
      },
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});
