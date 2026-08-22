import { ActionIcon, Autocomplete, Box } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { createContext, useMemo, useState, KeyboardEvent, Dispatch, SetStateAction } from "react";
import { Guess } from "@/classes/guess";
import { Letter } from "@/classes/letter";
import GuessItem from "@/components/Guesses/GuessItem/GuessItem";
import useDebounce from "@/hooks/useDebounce";
import { validateGuess } from "@/utils/guessValidation";
import classes from "./GuessInputList.module.css";

type GuessInputListProps = {
  guesses: Guess[];
  setGuesses: Dispatch<SetStateAction<Guess[]>>;
  wordSets: Map<number, Set<string>>;
  onlyAllowWordListGuesses: boolean;
  doAnimations: boolean;
};

export const GuessContext = createContext<{
  removeGuess: (guess: Guess) => void;
  setNextLetterCorrectnessForAllGuesses: (letterIndex: number, letter: Letter) => void;
  doAnimations: boolean;
}>({
  removeGuess: () => {},
  setNextLetterCorrectnessForAllGuesses: () => {},
  doAnimations: true,
});

export default function GuessInputList({
  guesses,
  setGuesses,
  wordSets,
  onlyAllowWordListGuesses,
  doAnimations,
}: GuessInputListProps) {
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

  function setNextLetterCorrectnessForAllGuesses(letterIndex: number, letter: Letter) {
    const nextLetterCorrectness = letter.getNextLetterCorrectness();

    setGuesses((currentGuesses) =>
      currentGuesses.map((guess) => {
        const targetLetter = guess.letters[letterIndex];

        if (!targetLetter || targetLetter.value !== letter.value) {
          return guess;
        }

        return {
          ...guess,
          letters: guess.letters.map((guessLetter, index) => {
            if (index !== letterIndex) {
              return guessLetter;
            }

            return new Letter(guessLetter.value, nextLetterCorrectness);
          }),
        };
      })
    );
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

  function handleGuessChanged(guess: string) {
    setGuessValue(guess);
    setGuessError(null);

    const setAutocompleteOpened =
      guessValue.length > 0 && debouncedSearch.length > 0 && guessError == null;
    setSearchDropDownOpened(setAutocompleteOpened);
  }

  return (
    <>
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

      {guesses.length > 0 && (
        <Box className={classes.guess_list}>
          <GuessContext
            value={{ removeGuess, setNextLetterCorrectnessForAllGuesses, doAnimations }}
          >
            {guesses.map((guess) => (
              <GuessItem key={guess.wordString} guess={guess} />
            ))}
          </GuessContext>
        </Box>
      )}
    </>
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
