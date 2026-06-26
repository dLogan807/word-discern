import { Badge } from "@mantine/core";
import classes from "./WordInfoBadge.module.css";

export default function WordInfoBadge({
  children,
  icon,
  color = "blue",
  clickable,
}: {
  children: string;
  icon?: React.ReactNode;
  color?: string;
  clickable?: boolean;
}) {
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
