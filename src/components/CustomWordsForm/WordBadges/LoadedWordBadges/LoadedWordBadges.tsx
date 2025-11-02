import { Button, Group, Popover, ScrollArea, Text } from "@mantine/core";
import {
  IconAdjustments,
  IconCheck,
  IconCopyOff,
  IconList,
  IconX,
} from "@tabler/icons-react";
import WordInfoBadge from "@/components/CustomWordsForm/WordBadges/WordInfoBadge/WordInfoBadge";
import classes from "./LoadedWordBadges.module.css";

export interface WordBadgeData {
  replaceDefaultWords: boolean;
  numDefaultWords: number;
  numWordsParsed: number;
  numCustomFormWords: number;
  failedWords: string[];
}

export default function LoadedWordsBadges({
  badgeData,
}: {
  badgeData: WordBadgeData;
}) {
  const customWordsInUse: number = badgeData.replaceDefaultWords
    ? badgeData.numWordsParsed
    : badgeData.numWordsParsed - badgeData.numDefaultWords;

  const validCustomWords: number =
    badgeData.numCustomFormWords - badgeData.failedWords.length;

  const wordsAlreadyExisting: number = validCustomWords - customWordsInUse;

  //Displayed badge text and icons
  const iconSize = 16;

  const totalWordsText: string = `${badgeData.numWordsParsed} total words`;
  const totalWordsIcon = <IconList size={iconSize} />;

  const customWordsText: string =
    !badgeData.numCustomFormWords || !validCustomWords
      ? "No custom words loaded"
      : `${validCustomWords} valid custom words parsed`;
  const customWordsIcon = <IconAdjustments size={iconSize} />;

  const alreadyExistingText: string = `${wordsAlreadyExisting} already existed in word list`;
  const alreadyExistingIcon = <IconCopyOff size={iconSize} />;

  const addedWordsText: string = `${customWordsInUse} added to word list`;
  const addedWordsIcon = <IconCheck size={iconSize} />;

  return (
    <Group>
      <WordInfoBadge icon={totalWordsIcon}>{totalWordsText}</WordInfoBadge>
      <WordInfoBadge color="yellow" icon={customWordsIcon}>
        {customWordsText}
      </WordInfoBadge>
      {wordsAlreadyExisting && (
        <WordInfoBadge color="yellow" icon={alreadyExistingIcon}>
          {alreadyExistingText}
        </WordInfoBadge>
      )}
      {customWordsInUse && (
        <WordInfoBadge color="green" icon={addedWordsIcon}>
          {addedWordsText}
        </WordInfoBadge>
      )}
      {badgeData.failedWords.length && (
        <FailedWordsBadge
          failedWords={badgeData.failedWords}
          iconSize={iconSize}
        />
      )}
    </Group>
  );
}

function FailedWordsBadge({
  failedWords,
  iconSize,
}: {
  failedWords: string[];
  iconSize: number;
}) {
  const failedWordsText: string = `${failedWords.length} Invalid words`;
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
