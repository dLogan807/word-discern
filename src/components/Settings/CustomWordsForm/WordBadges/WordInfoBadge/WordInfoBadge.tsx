import { Badge } from "@mantine/core";
import classes from "./WordInfoBadge.module.css";

type WordInfoBadgeProps = {
  children: string;
  icon?: React.ReactNode;
  color?: string;
  clickable?: boolean;
};

export default function WordInfoBadge({
  children,
  icon,
  color = "blue",
  clickable,
}: WordInfoBadgeProps) {
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
