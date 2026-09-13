import wordsUrl from "/words.txt?url";
import { ReactNode, Suspense, use, useMemo } from "react";
import { WordListContext } from "@/contexts/WordListContext";
import { useSettingsContext } from "@/hooks/useSettingsContext";
import { ParsedWordSets, parseWordsToSets } from "@/utils/wordLoading";
import FullPageLoader from "../Loaders/FullPageLoader/FullPageLoader";

let wordsPromise: Promise<string[]> | null = null;

function getWords(): Promise<string[]> {
  if (!wordsPromise) {
    wordsPromise = fetch(wordsUrl)
      .then((res) => res.text())
      .then((rawWords) => rawWords.split("\n").filter(Boolean));
  }

  return wordsPromise;
}

function WordList({ children }: { children: ReactNode }) {
  const defaultWords = use(getWords());
  const { customWordsFormData } = useSettingsContext();

  const parsedWordSets: ParsedWordSets = useMemo(() => {
    const mergedWords: string[] = customWordsFormData.replaceDefaultWords
      ? customWordsFormData.words
      : [...defaultWords, ...customWordsFormData.words];

    return parseWordsToSets(mergedWords, customWordsFormData.allowSpecialChars);
  }, [defaultWords, customWordsFormData]);

  return (
    <WordListContext
      value={{
        defaultWords: defaultWords,
        totalParsedWords: parsedWordSets.wordNum,
        wordSets: parsedWordSets.wordSets,
        invalidWords: parsedWordSets.failed,
        duplicateWords: parsedWordSets.duplicates,
      }}
    >
      {children}
    </WordListContext>
  );
}

export default function WordListProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <WordList>{children}</WordList>
    </Suspense>
  );
}
