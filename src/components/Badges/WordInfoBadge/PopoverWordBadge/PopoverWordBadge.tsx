import { Button, List, ListItem, Popover, ScrollArea } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import WordInfoBadge from "@/components/Badges/WordInfoBadge/WordInfoBadge";
import classes from "./PopoverWordBadge.module.css";

type PopoverWordBadgeProps = {
  words: Set<string>;
  text: string;
  iconSize: number;
  color: string;
};

export default function PopoverWordBadge({ words, text, iconSize, color }: PopoverWordBadgeProps) {
  return (
    <Popover position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button
          variant="transparent"
          classNames={{
            root: classes.word_badge_button,
          }}
        >
          <WordInfoBadge color={color} icon={<IconX size={iconSize} />} clickable>
            {text}
          </WordInfoBadge>
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <ScrollArea.Autosize mah={250} maw={300}>
          <List>
            {Array.from(words, (word) => (
              <ListItem key={word}>{word}</ListItem>
            ))}
          </List>
        </ScrollArea.Autosize>
      </Popover.Dropdown>
    </Popover>
  );
}
