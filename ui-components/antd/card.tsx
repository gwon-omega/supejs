import { Card as AntdCard } from "antd";

interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
  size?: "default" | "small";
  bordered?: boolean;
  hoverable?: boolean;
  loading?: boolean;
}

interface CardMetaProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  avatar?: React.ReactNode;
}

export function Card({
  children,
  title,
  size = "default",
  bordered = true,
  hoverable = false,
  ...props
}: CardProps) {
  return (
    <AntdCard
      title={title}
      size={size}
      bordered={bordered}
      hoverable={hoverable}
      {...props}
    >
      {children}
    </AntdCard>
  );
}

export function CardMeta({ title, description, avatar }: CardMetaProps) {
  return <AntdCard.Meta title={title} description={description} avatar={avatar} />;
}
