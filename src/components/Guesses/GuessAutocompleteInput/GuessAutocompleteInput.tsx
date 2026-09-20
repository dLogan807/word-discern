import { ActionIcon, Autocomplete } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useMemo, useState, KeyboardEvent } from "react";
import { Guess } from "@/classes/guess";
import { useSettingsContext } from "@/hooks/useSettingsContext";
import { useWordListContext } from "@/hooks/useWordListContext";
import { validateGuess } from "@/utils/guessValidation";
import classes from "./GuessAutocompleteInput.module.css";

type GuessAutocompleteInputProps = {
  guesses: Guess[];
  addGuess: (guess: string) => void;
};

export default function GuessAutocompleteInput({ guesses, addGuess }: GuessAutocompleteInputProps) {
  const { doAnimations, onlyAllowWordListGuesses } = useSettingsContext();
  const { wordSets } = useWordListContext();

  const [guessValue, setGuessValue] = useState("");
  const [guessError, setGuessError] = useState<null | string>(null);
  const [debouncedSearch] = useDebouncedValue(guessValue.trim().toLocaleLowerCase(), 100);

  const [searchDropdownOpened, setSearchDropDownOpened] = useState(false);

  const searchableWords = useMemo(
    () => getSuggestions(debouncedSearch, wordSets, guesses),
    [debouncedSearch, wordSets, guesses]
  );

  function handleSelectKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") tryAddGuess();
    if (event.key === "Escape") setSearchDropDownOpened(false);
  }

  function handleGuessChanged(guess: string) {
    setGuessValue(guess);
    setGuessError(null);

    const setAutocompleteOpened =
      guessValue.length > 0 && debouncedSearch.length > 0 && guessError == null;
    setSearchDropDownOpened(setAutocompleteOpened);
  }

  function tryAddGuess() {
    setSearchDropDownOpened(false);
    const trimmedGuess = guessValue.trim();
    const wordSet = wordSets.get(trimmedGuess.length);

    const validationResponse = validateGuess(
      trimmedGuess,
      guesses,
      wordSet,
      onlyAllowWordListGuesses
    );

    if (!validationResponse.validated) {
      setGuessError(validationResponse.message);
      return;
    }
    setGuessError(null);

    addGuess(trimmedGuess);

    setGuessValue("");
  }

  return (
    <Autocomplete
      aria-label="Guess"
      placeholder="Enter a guess"
      onKeyDown={handleSelectKeyDown}
      value={guessValue}
      error={guessError}
      onChange={handleGuessChanged}
      onDropdownClose={() => setSearchDropDownOpened(false)}
      data={searchableWords}
      dropdownOpened={searchDropdownOpened}
      limit={5}
      rightSection={
        <ActionIcon
          id="addGuessButton"
          onClick={tryAddGuess}
          aria-label="Add Guess"
          classNames={{
            root: classes.add_guess_button,
            icon: classes.add_guess_button_icon,
          }}
        >
          <IconPlus aria-labelledby="addGuessButton" />
        </ActionIcon>
      }
      classNames={{
        root: `${classes.guess_autocomplete_root} ${doAnimations && classes.guess_autocomplete_root_transition}`,
        wrapper: classes.guess_autocomplete_wrapper,
        input: `${classes.guess_autocomplete_input} ${doAnimations && classes.font_size_transition}`,
        section: `${classes.guess_autocomplete_section} ${doAnimations && classes.guess_autocomplete_section_transition}`,
        dropdown: classes.guess_autocomplete_dropdown,
        option: `${classes.guess_autocomplete_option} ${doAnimations && classes.font_size_transition}`,
      }}
    />
  );
}

function getSuggestions(
  debouncedSearch: string,
  wordSets: Map<number, Set<string>>,
  guesses: Guess[]
): string[] {
  if (debouncedSearch.length === 0) return [];

  const suggestions: string[] = [];
  const guessedWordSet = new Set(guesses.map((guess) => guess.wordString));

  for (const [key, set] of wordSets) {
    if (
      key < debouncedSearch.length ||
      (guesses.length > 0 && key !== guesses[0].wordString.length)
    ) {
      continue;
    }

    for (const word of set) {
      if (guessedWordSet.has(word) || !word.startsWith(debouncedSearch)) continue;

      suggestions.push(word);
    }
  }

  return suggestions;
}
