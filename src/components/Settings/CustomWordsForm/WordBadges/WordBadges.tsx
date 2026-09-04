import { Box } from "@mantine/core";
import { IconAdjustments, IconCheck, IconCopyOff, IconList } from "@tabler/icons-react";
import FailedWordsBadge from "@/components/Settings/CustomWordsForm/WordBadges/WordInfoBadge/FailedWordBadge/FailedWordBadge";
import WordInfoBadge from "@/components/Settings/CustomWordsForm/WordBadges/WordInfoBadge/WordInfoBadge";
import classes from "./WordBadge.module.css";

export type WordBadgesProps = {
  replaceDefaultWords: boolean;
  numDefaultWords: number;
  numWordsParsed: number;
  numCustomFormWords: number;
  failedWords: Set<string>;
};

export default function WordsBadges({
  replaceDefaultWords,
  numDefaultWords,
  numWordsParsed,
  numCustomFormWords,
  failedWords,
}: WordBadgesProps) {
  const customWordsInUse = replaceDefaultWords ? numWordsParsed : numWordsParsed - numDefaultWords;

  const validCustomWords = numCustomFormWords - failedWords.size;

  const wordsAlreadyExisting = validCustomWords - customWordsInUse;

  //Displayed badge text and icons
  const iconSize = 16;

  const totalWordsText = `${numWordsParsed} total`;
  const customWordsText =
    !numCustomFormWords || !validCustomWords
      ? "No custom words loaded"
      : `${validCustomWords} parsed`;
  const alreadyExistingText = `${wordsAlreadyExisting} duplicates`;
  const addedWordsText = `${customWordsInUse} added`;

  return (
    <Box className={classes.badge_wrapper}>
      <WordInfoBadge icon={<IconList size={iconSize} />}>{totalWordsText}</WordInfoBadge>
      <WordInfoBadge color="yellow" icon={<IconAdjustments size={iconSize} />}>
        {customWordsText}
      </WordInfoBadge>
      {wordsAlreadyExisting > 0 && (
        <WordInfoBadge color="yellow" icon={<IconCopyOff size={iconSize} />}>
          {alreadyExistingText}
        </WordInfoBadge>
      )}
      {customWordsInUse > 0 && (
        <WordInfoBadge color="green" icon={<IconCheck size={iconSize} />}>
          {addedWordsText}
        </WordInfoBadge>
      )}
      {failedWords.size > 0 && <FailedWordsBadge failedWords={failedWords} iconSize={iconSize} />}
    </Box>
  );
}
