import { Box } from "@mantine/core";
import { IconAdjustments, IconCheck, IconCopyOff, IconList, IconX } from "@tabler/icons-react";
import WordInfoBadge from "@/components/Badges/WordInfoBadge/WordInfoBadge";
import WordInfoBadgePopover from "@/components/Overlays/WordInfoBadgePopover/WordInfoBadgePopover";
import pluralize from "@/utils/pluralize";
import classes from "./WordBadge.module.css";

export type WordBadgesProps = {
  replaceDefaultWords: boolean;
  numDefaultWords: number;
  numWordsParsed: number;
  numCustomFormWords: number;
  failedWords: Set<string>;
  duplicateWords: Set<string>;
};

export default function WordsBadges({
  replaceDefaultWords,
  numDefaultWords,
  numWordsParsed,
  numCustomFormWords,
  failedWords,
  duplicateWords,
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
      : `${validCustomWords} valid parsed`;
  const alreadyExistingText = `${wordsAlreadyExisting} ${pluralize(wordsAlreadyExisting, "duplicate")}`;
  const addedWordsText = `${customWordsInUse} added`;
  const failedWordsText = `${failedWords.size} invalid ${pluralize(failedWords.size, "word")}`;

  return (
    <Box className={classes.badge_wrapper}>
      <WordInfoBadge icon={<IconList size={iconSize} />}>{totalWordsText}</WordInfoBadge>
      <WordInfoBadge color="yellow" icon={<IconAdjustments size={iconSize} />}>
        {customWordsText}
      </WordInfoBadge>
      {wordsAlreadyExisting > 0 && (
        <WordInfoBadgePopover
          words={duplicateWords}
          color="yellow"
          icon={<IconCopyOff size={iconSize} />}
        >
          {alreadyExistingText}
        </WordInfoBadgePopover>
      )}
      {customWordsInUse > 0 && (
        <WordInfoBadge color="green" icon={<IconCheck size={iconSize} />}>
          {addedWordsText}
        </WordInfoBadge>
      )}
      {failedWords.size > 0 && (
        <WordInfoBadgePopover words={failedWords} color="red" icon={<IconX size={iconSize} />}>
          {failedWordsText}
        </WordInfoBadgePopover>
      )}
    </Box>
  );
}
