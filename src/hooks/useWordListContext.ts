import { use, useContext, useMemo } from "react";
import { WordListContext } from "@/contexts/WordListContext";
import { ParsedWordSets, parseWordsToSets } from "@/utils/wordLoading";
import { useSettingsContext } from "./useSettingsContext";

type WordListContextType = {
  fetchSuccess: boolean;
  defaultWords: string[];
  totalParsedWords: ParsedWordSets["wordNum"];
  wordSets: ParsedWordSets["wordSets"];
  invalidWords: ParsedWordSets["failed"];
  duplicateWords: ParsedWordSets["duplicates"];
};

export function useWordListContext(): WordListContextType {
  const context = useContext(WordListContext);

  if (context === undefined) {
    throw new Error("useWordListContext must be used within a WordListProvider");
  }

  const { defaultWords, fetchSuccess } = use(context.defaultWordsPromise);
  const { customWordsFormData } = useSettingsContext();

  return useMemo(() => {
    const wordsInUse = customWordsFormData.replaceDefaultWords
      ? customWordsFormData.words
      : [...defaultWords, ...customWordsFormData.words];

    const parsedWordSets = parseWordsToSets(wordsInUse, customWordsFormData.allowSpecialChars);

    return {
      fetchSuccess: fetchSuccess,
      defaultWords,
      totalParsedWords: parsedWordSets.wordNum,
      wordSets: parsedWordSets.wordSets,
      invalidWords: parsedWordSets.failed,
      duplicateWords: parsedWordSets.duplicates,
    };
  }, [defaultWords, customWordsFormData, fetchSuccess]);
}
