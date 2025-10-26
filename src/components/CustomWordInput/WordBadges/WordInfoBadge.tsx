import { Badge } from "@mantine/core";
import classes from "./WordInfoBadge.module.css";

export default function WordInfoBadge({
  children,
  icon,
  color,
  clickable,
}: {
  children: string;
  icon?: React.ReactNode;
  color?: string;
  clickable?: boolean;
}) {
  icon = icon ?? null;
  color = color ?? "blue";

  const clickableClass = clickable
    ? {
        root: classes.clickable_badge,
      }
    : {};

  return (
    <Badge
      leftSection={icon}
      variant="light"
      color={color}
      classNames={clickableClass}
    >
      {children}
    </Badge>
  );
}
