import { useLocalStorage } from "@mantine/hooks";
import { ReactNode } from "react";
import { CustomWordsFormData } from "@/components/Settings/CustomWordsForm/CustomWordsForm";
import { WordInput } from "@/enums/enums";
import { SettingsContext } from "@/hooks/useSettingsContext";

const DEFAULT_CUSTOM_WORDS_FORM: CustomWordsFormData = {
  words: [],
  allowSpecialChars: false,
  replaceDefaultWords: false,
  lastUpdatedWithInputMode: WordInput.TEXT,
  text: "",
  json: "",
};

export default function SettingsProvider({ children }: { children: ReactNode }) {
  const [onlyAllowWordListGuesses, setOnlyAllowWordListGuesses] = useLocalStorage({
    key: "only-allow-word-list-guesses",
    defaultValue: true,
    getInitialValueInEffect: false,
  });
  const [shuffleResults, setShuffleResults] = useLocalStorage({
    key: "shuffle-results",
    defaultValue: true,
    getInitialValueInEffect: false,
  });
  const [hideResults, setHideResults] = useLocalStorage({
    key: "hide-results",
    defaultValue: true,
    getInitialValueInEffect: false,
  });
  const [onlyHideUnknownChars, setOnlyHideUnknownChars] = useLocalStorage({
    key: "only-hide-unknown-chars",
    defaultValue: true,
    getInitialValueInEffect: false,
  });
  const [numResultsShown, setNumResultsShown] = useLocalStorage({
    key: "num-results-shown",
    defaultValue: 20,
    getInitialValueInEffect: false,
  });
  const [doAnimations, setDoAnimations] = useLocalStorage({
    key: "do-animations",
    defaultValue: true,
    getInitialValueInEffect: false,
  });
  const [showHelpButton, setShowHelpButton] = useLocalStorage({
    key: "show-help-button",
    defaultValue: true,
    getInitialValueInEffect: false,
  });
  const [customWordsFormData, setCustomWordsFormData] = useLocalStorage({
    key: "custom-words-form-data",
    defaultValue: DEFAULT_CUSTOM_WORDS_FORM,
    getInitialValueInEffect: false,
  });

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
        showHelpButton,
        setShowHelpButton,
        shuffleResults,
        setShuffleResults,
      }}
    >
      {children}
    </SettingsContext>
  );
}
