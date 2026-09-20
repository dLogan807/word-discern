import wordsUrl from "/words.txt?url";
import { ReactNode, useMemo } from "react";
import { WordListContext } from "@/contexts/WordListContext";

export type DefaultWordsPromise = Promise<{
  defaultWords: string[];
  fetchSuccess: boolean;
}>;

let wordsPromise: DefaultWordsPromise | null = null;

function getWords(): DefaultWordsPromise {
  if (!wordsPromise) {
    wordsPromise = fetch(wordsUrl)
      .then((res) => res.text())
      .then((rawWords) => ({
        defaultWords: rawWords.split("\n").filter(Boolean),
        fetchSuccess: true,
      }))
      .catch(() => ({
        defaultWords: [],
        fetchSuccess: false,
      }));
  }

  return wordsPromise;
}

export default function WordListProvider({ children }: { children: ReactNode }) {
  const value = useMemo(
    () => ({
      defaultWordsPromise: getWords(),
    }),
    []
  );

  return <WordListContext value={value}>{children}</WordListContext>;
}
