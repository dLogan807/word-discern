import { Button, Popover, ScrollArea, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import WordInfoBadge from "@/components/Settings/CustomWordsForm/WordBadges/WordInfoBadge/WordInfoBadge";
import classes from "./FailedWordBadge.module.css";
import pluralize from "@/utils/pluralize";

export default function FailedWordsBadge({
  failedWords,
  iconSize,
}: {
  failedWords: string[];
  iconSize: number;
}) {
  const failedWordsText: string = `${failedWords.length} invalid ${pluralize(
    failedWords.length,
    "word"
  )}`;
  const failedWordsIcon = <IconX size={iconSize} />;
  return (
    <Popover position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button
          variant="transparent"
          classNames={{
            root: classes.failed_words_button,
          }}
        >
          <WordInfoBadge color="red" icon={failedWordsIcon} clickable={true}>
            {failedWordsText}
          </WordInfoBadge>
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <ScrollArea.Autosize mah={250} maw={250}>
          <Text>{failedWords.join(", ")}</Text>
        </ScrollArea.Autosize>
      </Popover.Dropdown>
    </Popover>
  );
}
