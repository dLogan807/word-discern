import { Badge } from "@mantine/core";
import classes from "./CharacterBadge.module.css";

type CharacterBadgeProps = {
  character: string;
  colour: string;
  ariaHidden?: boolean;
};

export default function CharacterBadge({ colour, character, ariaHidden }: CharacterBadgeProps) {
  return (
    <Badge
      classNames={{ root: classes.character_badge_root }}
      color={colour}
      radius="xs"
      aria-hidden={ariaHidden ? "true" : "false"}
    >
      {character}
    </Badge>
  );
}
