import { Badge } from "@mantine/core";

export default function WordInfoBadge({
  children,
  icon,
  color,
}: {
  children: string;
  icon?: React.ReactNode;
  color?: string;
}) {
  icon = icon ?? null;
  color = color ?? "blue";

  return (
    <Badge leftSection={icon} variant="light" color={color}>
      {children}
    </Badge>
  );
}
