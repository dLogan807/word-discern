import { Badge } from "@mantine/core";
import classes from "./CharacterBadge.module.css";

type CharacterBadgeProps = {
  character: string;
  colour: string;
};

export default function CharacterBadge({ colour, character }: CharacterBadgeProps) {
  return (
    <Badge classNames={{ root: classes.character_badge_root }} color={colour} radius="xs">
      {character}
    </Badge>
  );
}
