import { useContext } from "react";
import { WordListContext, WordListContextType } from "@/contexts/WordListContext";

export function useWordListContext(): WordListContextType {
  const context = useContext(WordListContext);

  if (context === undefined) {
    throw new Error("useWordListContext must be used within a WordListProvider");
  }

  return context;
}
