import { Group } from "@mantine/core";
import {
  IconAdjustments,
  IconCheck,
  IconCopyOff,
  IconList,
} from "@tabler/icons-react";
import WordInfoBadge from "@/components/Settings/CustomWordsForm/WordBadges/WordInfoBadge/WordInfoBadge";
import FailedWordsBadge from "@/components/Settings/CustomWordsForm/WordBadges/WordInfoBadge/FailedWordBadge/FailedWordBadge";
import pluralize from "@/utils/pluralize";

export interface WordBadgeData {
  replaceDefaultWords: boolean;
  numDefaultWords: number;
  numWordsParsed: number;
  numCustomFormWords: number;
  failedWords: string[];
}

export default function WordsBadges({
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

  const totalWordsText: string = `${badgeData.numWordsParsed} total ${pluralize(
    badgeData.numWordsParsed,
    "word"
  )}`;
  const totalWordsIcon = <IconList size={iconSize} />;

  const customWordsText: string =
    !badgeData.numCustomFormWords || !validCustomWords
      ? "No custom words loaded"
      : `${validCustomWords} valid custom ${pluralize(
          validCustomWords,
          "word"
        )} parsed`;
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
