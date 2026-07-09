import { ActionIcon, Autocomplete, Box, Flex, Paper } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { createContext, useMemo, useState, KeyboardEvent, Dispatch, SetStateAction } from "react";
import { Guess } from "@/classes/guess";
import GuessItem from "@/components/Guesses/GuessItem/GuessItem";
import useDebounce from "@/hooks/useDebounce";
import { validateGuess } from "@/utils/guessValidation";
import classes from "./GuessInputList.module.css";

export const GuessContext = createContext<{
  removeGuess: (guess: Guess) => void;
  updateGuess: (guess: Guess) => void;
  doAnimations: boolean;
}>({
  removeGuess: () => {},
  updateGuess: () => {},
  doAnimations: true,
});

export default function GuessInputList({
  guesses,
  setGuesses,
  wordSets,
  onlyAllowWordListGuesses,
  doAnimations,
}: {
  guesses: Guess[];
  setGuesses: Dispatch<SetStateAction<Guess[]>>;
  wordSets: Map<number, Set<string>>;
  onlyAllowWordListGuesses: boolean;
  doAnimations: boolean;
}) {
  const [searchDropdownOpened, setSearchDropDownOpened] = useState(false);
  const [guessValue, setGuessValue] = useState("");
  const [guessError, setGuessError] = useState<null | string>(null);
  const debouncedSearch = useDebounce(guessValue, 100).trim().toLocaleLowerCase();

  const searchableWords = useMemo(
    () => getSuggestions(debouncedSearch, wordSets, guesses),
    [debouncedSearch, wordSets, guesses]
  );

  function handleSelectKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") tryAddGuess();
    if (event.key === "Escape") setSearchDropDownOpened(false);
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

    const guess = new Guess(trimmedGuess);
    setGuesses([...guesses, guess]);

    setGuessValue("");
  }

  function removeGuess(guessToRemove: Guess) {
    setGuesses(guesses.filter((g) => g.wordString !== guessToRemove.wordString));
  }

  function updateGuess(updatedGuess: Guess) {
    setGuesses(guesses.map((g) => (g.wordString === updatedGuess.wordString ? updatedGuess : g)));
  }

  function handleGuessChanged(guess: string) {
    setGuessValue(guess);
    setGuessError(null);

    const setAutocompleteOpened =
      guessValue.length > 0 && debouncedSearch.length > 0 && guessError == null;
    setSearchDropDownOpened(setAutocompleteOpened);
  }

  return (
    <Paper>
      <Flex classNames={{ root: classes.guess_input_container }}>
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
              onClick={tryAddGuess}
              aria-label="Add Guess"
              classNames={{
                root: classes.add_guess_button,
                icon: classes.add_guess_button_icon,
              }}
            >
              <IconPlus />
            </ActionIcon>
          }
          classNames={{
            root: classes.guess_autocomplete_root,
            wrapper: classes.guess_autocomplete_wrapper,
            input: classes.guess_autocomplete_input,
            section: classes.guess_autocomplete_section,
            dropdown: classes.guess_autocomplete_dropdown,
            option: classes.guess_autocomplete_option,
          }}
        />
      </Flex>

      <Box className={classes.guess_list}>
        <GuessContext value={{ removeGuess, updateGuess, doAnimations }}>
          {guesses.map((guess) => (
            <GuessItem key={guess.wordString} guess={guess} />
          ))}
        </GuessContext>
      </Box>
    </Paper>
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
    if (key < debouncedSearch.length) continue;
    if (guesses.length > 0 && key !== guesses[0].wordString.length) continue;

    for (const word of set) {
      if (guessedWordSet.has(word)) continue;
      if (!word.startsWith(debouncedSearch)) continue;

      suggestions.push(word);
    }
  }

  return suggestions;
}
