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

  return (
    <Badge
      leftSection={icon}
      variant="light"
      color={color}
      classNames={{ root: clickable ? classes.clickable_badge : undefined }}
    >
      {children}
    </Badge>
  );
}
