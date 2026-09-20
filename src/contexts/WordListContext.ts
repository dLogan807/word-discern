import { createContext } from "react";
import { DefaultWordsPromise } from "@/components/Providers/WordListProvider";

export type WordListResourceContextType = {
  defaultWordsPromise: DefaultWordsPromise;
};

export const WordListContext = createContext<WordListResourceContextType | undefined>(undefined);
