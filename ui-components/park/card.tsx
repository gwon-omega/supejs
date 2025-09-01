import { ark } from "@ark-ui/react";
import { styled } from "./styled";

export const Card = styled(ark.div, {
  base: {
    background: "bg.default",
    borderRadius: "l3",
    borderWidth: "1px",
    borderColor: "border.default",
    boxShadow: "xs",
    overflow: "hidden",
  },
});

export const CardHeader = styled(ark.div, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5",
    p: "6",
  },
});

export const CardBody = styled(ark.div, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "2",
    p: "6",
    pt: "0",
  },
});

export const CardFooter = styled(ark.div, {
  base: {
    display: "flex",
    alignItems: "center",
    p: "6",
    pt: "0",
  },
});
