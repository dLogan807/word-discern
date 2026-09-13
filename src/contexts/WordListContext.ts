import { createContext } from "react";
import { ParsedWordSets } from "@/utils/wordLoading";

export type WordListContextType = {
  defaultWords: string[];
  totalParsedWords: ParsedWordSets["wordNum"];
  wordSets: ParsedWordSets["wordSets"];
  invalidWords: ParsedWordSets["failed"];
  duplicateWords: ParsedWordSets["duplicates"];
};

export const WordListContext = createContext<WordListContextType | undefined>(undefined);
