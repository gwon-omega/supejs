import { Card as NextUICard, CardHeader, CardBody, CardFooter } from "@nextui-org/react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: "none" | "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg";
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, shadow = "md", radius = "lg", ...props }: CardProps) {
  return (
    <NextUICard shadow={shadow} radius={radius} {...props}>
      {children}
    </NextUICard>
  );
}

export function CardHeader({ children, ...props }: CardHeaderProps) {
  return <CardHeader {...props}>{children}</CardHeader>;
}

export function CardContent({ children, ...props }: CardContentProps) {
  return <CardBody {...props}>{children}</CardBody>;
}

export function CardFooter({ children, ...props }: CardFooterProps) {
  return <CardFooter {...props}>{children}</CardFooter>;
}
