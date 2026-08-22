import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";
import {
  CustomWordsFormData,
  DEFAULT_CUSTOM_WORDS_FORM,
} from "@/components/Settings/CustomWordsForm/CustomWordsForm";

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

export default function SettingsProvider({ children }: { children: ReactNode }) {
  const [onlyAllowWordListGuesses, setOnlyAllowWordListGuesses] = useState(true);
  const [shuffleResults, setShuffleResults] = useState(true);
  const [hideResults, setHideResults] = useState(true);
  const [onlyHideUnknownChars, setOnlyHideUnknownChars] = useState(true);
  const [numResultsShown, setNumResultsShown] = useState(20);
  const [doAnimations, setDoAnimations] = useState(true);
  const [customWordsFormData, setCustomWordsFormData] = useState(DEFAULT_CUSTOM_WORDS_FORM);

  return (
    <SettingsContext
      value={{
        customWordsFormData,
        setCustomWordsFormData,
        doAnimations,
        setDoAnimations,
        hideResults,
        setHideResults,
        numResultsShown,
        setNumResultsShown,
        onlyAllowWordListGuesses,
        setOnlyAllowWordListGuesses,
        onlyHideUnknownChars,
        setOnlyHideUnknownChars,
        shuffleResults,
        setShuffleResults,
      }}
    >
      {children}
    </SettingsContext>
  );
}
