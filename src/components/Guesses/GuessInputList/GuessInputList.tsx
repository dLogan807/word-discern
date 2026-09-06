import { ActionIcon, Autocomplete, Box } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useMemo, useState, KeyboardEvent, Dispatch, SetStateAction } from "react";
import { Guess } from "@/classes/guess";
import { Letter } from "@/classes/letter";
import GuessItem from "@/components/Guesses/GuessItem/GuessItem";
import GuessProvider from "@/components/Providers/GuessProvider";
import { LetterCorrectness } from "@/enums/enums";
import { useSettingsContext } from "@/hooks/useSettingsContext";
import { validateGuess } from "@/utils/guessValidation";
import classes from "./GuessInputList.module.css";

type GuessInputListProps = {
  guesses: Guess[];
  setGuesses: Dispatch<SetStateAction<Guess[]>>;
  wordSets: Map<number, Set<string>>;
};

export default function GuessInputList({ guesses, setGuesses, wordSets }: GuessInputListProps) {
  const { onlyAllowWordListGuesses, doAnimations } = useSettingsContext();

  const [searchDropdownOpened, setSearchDropDownOpened] = useState(false);
  const [guessValue, setGuessValue] = useState("");
  const [guessError, setGuessError] = useState<null | string>(null);
  const [debouncedSearch] = useDebouncedValue(guessValue.trim().toLocaleLowerCase(), 100);

  const searchableWords = useMemo(
    () => getSuggestions(debouncedSearch, wordSets, guesses),
    [debouncedSearch, wordSets, guesses]
  );

  function handleSelectKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") tryAddGuess();
    if (event.key === "Escape") setSearchDropDownOpened(false);
  }

  function setNextLetterCorrectnessForAllGuesses(
    letter: Letter,
    letterIndex: number,
    guessIndex: number
  ) {
    const nextLetterCorrectness = letter.getNextLetterCorrectness();
    function getCorrectnessToApply(
      guess: Guess,
      currentGuessIndex: number
    ): LetterCorrectness | undefined {
      const targetLetter = guess.letters[letterIndex];
      const isSameLetter = letter.value === targetLetter.value;

      if (letter.correctness === LetterCorrectness.Correct) {
        return isSameLetter ? LetterCorrectness.NotPresent : undefined;
      }

      if (nextLetterCorrectness === LetterCorrectness.Correct) {
        if (isSameLetter) {
          return LetterCorrectness.Correct;
        }

        return targetLetter.correctness === LetterCorrectness.Correct
          ? LetterCorrectness.NotPresent
          : undefined;
      }

      return currentGuessIndex === guessIndex ? nextLetterCorrectness : undefined;
    }

    setGuesses((currentGuesses) =>
      currentGuesses.map((guess, currentGuessIndex) => {
        const correctness = getCorrectnessToApply(guess, currentGuessIndex);

        return correctness === undefined
          ? guess
          : updateLetterCorrectness(guess, letterIndex, correctness);
      })
    );
  }

  function updateLetterCorrectness(
    guess: Guess,
    letterIndex: number,
    nextLetterCorrectness: LetterCorrectness
  ) {
    return {
      ...guess,
      letters: guess.letters.map((guessLetter, index) => {
        if (index !== letterIndex) {
          return guessLetter;
        }

        return new Letter(guessLetter.value, nextLetterCorrectness);
      }),
    };
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

    const initialCorrectnessValues = getInitialCorrectnessValuesFromGuesses(trimmedGuess);
    const guess = new Guess(trimmedGuess, initialCorrectnessValues);
    setGuesses([...guesses, guess]);

    setGuessValue("");
  }

  function getInitialCorrectnessValuesFromGuesses(newGuess: string): LetterCorrectness[] {
    const initialLetterCorrectnessValues: LetterCorrectness[] = [];

    for (let i = 0; i < newGuess.length; i++) {
      let initialLetterCorrectness = LetterCorrectness.NotPresent;

      for (const guess of guesses) {
        if (guess.letters[i].value === newGuess[i]) {
          initialLetterCorrectness = guess.letters[i].correctness;
          break;
        }
      }

      initialLetterCorrectnessValues.push(initialLetterCorrectness);
    }

    return initialLetterCorrectnessValues;
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
          root: `${classes.guess_autocomplete_root} ${doAnimations && classes.guess_autocomplete_root_transition}`,
          wrapper: classes.guess_autocomplete_wrapper,
          input: `${classes.guess_autocomplete_input} ${doAnimations && classes.font_size_transition}`,
          section: `${classes.guess_autocomplete_section} ${doAnimations && classes.guess_autocomplete_section_transition}`,
          dropdown: classes.guess_autocomplete_dropdown,
          option: `${classes.guess_autocomplete_option} ${doAnimations && classes.font_size_transition}`,
        }}
      />

      {guesses.length > 0 && (
        <Box className={classes.guess_list}>
          <GuessProvider guessOperations={{ removeGuess, setNextLetterCorrectnessForAllGuesses }}>
            {guesses.map((guess, idx) => (
              <GuessItem key={guess.wordString} guess={guess} guessIndex={idx} />
            ))}
          </GuessProvider>
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
