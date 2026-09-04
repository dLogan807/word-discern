import { createContext, Dispatch, SetStateAction } from "react";
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
  shuffleResults: boolean;
  setShuffleResults: Dispatch<SetStateAction<boolean>>;
};

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
