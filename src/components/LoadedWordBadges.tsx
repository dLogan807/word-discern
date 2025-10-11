import { Group } from "@mantine/core";
import {
  IconAdjustments,
  IconCheck,
  IconCopyOff,
  IconList,
  IconX,
} from "@tabler/icons-react";
import WordInfoBadge from "./WordInfoBadge";

export default function LoadedWordsBadges({
  replaceDefaultWords,
  numDefaultWords,
  numWordsParsed,
  numCustomFormWords,
  numFailedWords,
}: {
  replaceDefaultWords: boolean;
  numDefaultWords: number;
  numWordsParsed: number;
  numCustomFormWords: number;
  numFailedWords: number;
}) {
  const customWordsInUse: number = replaceDefaultWords
    ? numWordsParsed
    : numWordsParsed - numDefaultWords;

  const validCustomWords: number = numCustomFormWords - numFailedWords;

  const wordsAlreadyExisting: number = validCustomWords - customWordsInUse;

  //Displayed badge text and icons
  const iconSize = 16;

  const totalWordsText: string = `${numWordsParsed} total words`;
  const totalWordsIcon = <IconList size={iconSize} />;

  const customWordsText: string =
    !numCustomFormWords || !validCustomWords
      ? "No custom words loaded"
      : `${validCustomWords} valid custom words parsed`;
  const customWordsIcon = <IconAdjustments size={iconSize} />;

  const alreadyExistingText: string = `${wordsAlreadyExisting} already existed in word list`;
  const alreadyExistingIcon = <IconCopyOff size={iconSize} />;

  const addedWordsText: string = `${customWordsInUse} added to word list`;
  const addedWordsIcon = <IconCheck size={iconSize} />;

  const failedWordsText: string = `${numFailedWords} Invalid words`;
  const failedWordsIcon = <IconX size={iconSize} />;

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
      {numFailedWords && (
        <WordInfoBadge color="red" icon={failedWordsIcon}>
          {failedWordsText}
        </WordInfoBadge>
      )}
    </Group>
  );
}
