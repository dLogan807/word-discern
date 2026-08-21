import { Box } from "@mantine/core";
import { IconAdjustments, IconCheck, IconCopyOff, IconList } from "@tabler/icons-react";
import FailedWordsBadge from "@/components/Settings/CustomWordsForm/WordBadges/WordInfoBadge/FailedWordBadge/FailedWordBadge";
import WordInfoBadge from "@/components/Settings/CustomWordsForm/WordBadges/WordInfoBadge/WordInfoBadge";
import pluralize from "@/utils/pluralize";
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

  const totalWordsText = `${numWordsParsed} total ${pluralize(numWordsParsed, "word")}`;
  const totalWordsIcon = <IconList size={iconSize} />;

  const customWordsText =
    !numCustomFormWords || !validCustomWords
      ? "No custom words loaded"
      : `${validCustomWords} valid custom ${pluralize(validCustomWords, "word")} parsed`;
  const customWordsIcon = <IconAdjustments size={iconSize} />;

  const alreadyExistingText = `${wordsAlreadyExisting} already existed in word list`;
  const alreadyExistingIcon = <IconCopyOff size={iconSize} />;

  const addedWordsText = `${customWordsInUse} added to word list`;
  const addedWordsIcon = <IconCheck size={iconSize} />;

  return (
    <Box className={classes.badge_wrapper}>
      <WordInfoBadge icon={totalWordsIcon}>{totalWordsText}</WordInfoBadge>
      <WordInfoBadge color="yellow" icon={customWordsIcon}>
        {customWordsText}
      </WordInfoBadge>
      {wordsAlreadyExisting > 0 && (
        <WordInfoBadge color="yellow" icon={alreadyExistingIcon}>
          {alreadyExistingText}
        </WordInfoBadge>
      )}
      {customWordsInUse > 0 && (
        <WordInfoBadge color="green" icon={addedWordsIcon}>
          {addedWordsText}
        </WordInfoBadge>
      )}
      {failedWords.size > 0 && <FailedWordsBadge failedWords={failedWords} iconSize={iconSize} />}
    </Box>
  );
}
