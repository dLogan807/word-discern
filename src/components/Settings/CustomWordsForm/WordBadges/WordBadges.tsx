import { Box } from "@mantine/core";
import { IconAdjustments, IconCheck, IconCopyOff, IconList, IconX } from "@tabler/icons-react";
import { Suspense } from "react";
import WordInfoBadge from "@/components/Badges/WordInfoBadge/WordInfoBadge";
import WordListFetchFailureBadge from "@/components/Badges/WordListFetchFailureBadge/WordListFetchFailureBadge";
import WordInfoBadgePopover from "@/components/Overlays/WordInfoBadgePopover/WordInfoBadgePopover";
import WordBadgesSkeleton from "@/components/Skeletons/WordBadgesSkeleton/WordBadgesSkeleton";
import { useSettingsContext } from "@/hooks/useSettingsContext";
import { useWordListContext } from "@/hooks/useWordListContext";
import pluralize from "@/utils/pluralize";
import classes from "./WordBadge.module.css";

export default function WordsBadges() {
  return (
    <Box className={classes.badge_wrapper}>
      <Suspense fallback={<WordBadgesSkeleton />}>
        <WordsBadgesInner />
      </Suspense>
    </Box>
  );
}

function WordsBadgesInner() {
  const { customWordsFormData } = useSettingsContext();
  const { fetchSuccess, defaultWords, totalParsedWords, invalidWords, duplicateWords } =
    useWordListContext();

  const numCustomFormWords = customWordsFormData.words.length;

  const customWordsInUse = customWordsFormData.replaceDefaultWords
    ? totalParsedWords
    : totalParsedWords - defaultWords.length;
  const validCustomWords = numCustomFormWords - invalidWords.size;
  const wordsAlreadyExisting = validCustomWords - customWordsInUse;

  //Displayed badge text and icons
  const iconSize = 16;

  const totalWordsText = `${totalParsedWords} total`;
  const customWordsText =
    !numCustomFormWords || !validCustomWords
      ? "No custom words loaded"
      : `${validCustomWords} valid parsed`;
  const alreadyExistingText = `${wordsAlreadyExisting} ${pluralize(wordsAlreadyExisting, "duplicate")}`;
  const addedWordsText = `${customWordsInUse} added`;
  const invalidWordsWordsText = `${invalidWords.size} invalid ${pluralize(invalidWords.size, "word")}`;

  return (
    <>
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
      {invalidWords.size > 0 && (
        <WordInfoBadgePopover words={invalidWords} color="red" icon={<IconX size={iconSize} />}>
          {invalidWordsWordsText}
        </WordInfoBadgePopover>
      )}
      {fetchSuccess === false && <WordListFetchFailureBadge iconSize={iconSize} />}
    </>
  );
}
