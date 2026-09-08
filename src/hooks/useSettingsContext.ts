import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { CustomWordsFormData } from "@/components/Settings/CustomWordsForm/CustomWordsForm";

export type SettingsContextType = {
  customWordsFormData: CustomWordsFormData;
  setCustomWordsFormData: Dispatch<SetStateAction<CustomWordsFormData>>;
  doAnimations: boolean;
  setDoAnimations: Dispatch<SetStateAction<boolean>>;
  hideResults: boolean;
  setHideResults: Dispatch<SetStateAction<boolean>>;
  numResultsShown: number;
  setNumResultsShown: Dispatch<SetStateAction<number>>;
  onlyAllowWordListGuesses: boolean;
  setOnlyAllowWordListGuesses: Dispatch<SetStateAction<boolean>>;
  onlyHideUnknownChars: boolean;
  setOnlyHideUnknownChars: Dispatch<SetStateAction<boolean>>;
  showHelpButton: boolean;
  setShowHelpButton: Dispatch<SetStateAction<boolean>>;
  shuffleResults: boolean;
  setShuffleResults: Dispatch<SetStateAction<boolean>>;
};

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function useSettingsContext(): SettingsContextType {
  const context = useContext(SettingsContext);

  if (context === undefined) {
    throw new Error("useSettingsContext must be used within a SettingsProvider");
  }

  return context;
}
