import { Box, useColorModeValue } from "@chakra-ui/react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  p?: number | string;
  shadow?: string;
  borderRadius?: string;
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

export function Card({
  children,
  p = 6,
  shadow = "md",
  borderRadius = "lg",
  ...props
}: CardProps) {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      bg={bg}
      shadow={shadow}
      borderRadius={borderRadius}
      border="1px"
      borderColor={borderColor}
      p={p}
      {...props}
    >
      {children}
    </Box>
  );
}

export function CardHeader({ children, ...props }: CardHeaderProps) {
  return <Box mb={4} {...props}>{children}</Box>;
}

export function CardContent({ children, ...props }: CardContentProps) {
  return <Box {...props}>{children}</Box>;
}

export function CardFooter({ children, ...props }: CardFooterProps) {
  return <Box mt={4} {...props}>{children}</Box>;
}
