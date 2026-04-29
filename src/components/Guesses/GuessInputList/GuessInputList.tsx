import {
  Box,
  Button,
  ComboboxItem,
  Flex,
  InputLabel,
  OptionsFilter,
  Paper,
  Select,
} from "@mantine/core";
import { createContext, useEffect, useState } from "react";
import { Guess } from "@/classes/guess";
import GuessItem from "@/components/Guesses/GuessItem/GuessItem";
import { useField } from "@mantine/form";
import { validateGuess } from "@/utils/guessValidation";
import classes from "./GuessInputList.module.css";
import useDebounce from "@/hooks/useDebounce";

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
  setGuesses: (value: Guess[]) => void;
  wordSets: Map<number, Set<string>>;
  onlyAllowWordListGuesses: boolean;
  doAnimations: boolean;
}) {
  const guessField = useField({
    mode: "controlled",
    initialValue: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const [searchableWords, setSearchableWords] = useState<string[]>([]);
  const debouncedSearch = useDebounce(searchValue, 500);

  // const optionsFilter: OptionsFilter = ({ options, search }) => {
  //   const splittedSearch = search.toLowerCase().trim().split(" ");
  //   return (options as ComboboxItem[]).filter((option) => {
  //     const words = option.label.toLowerCase().trim().split(" ");
  //     return splittedSearch.every((searchWord) =>
  //       words.some((word) => word.includes(searchWord))
  //     );
  //   });
  // };

  useEffect(() => {
    let words: string[] = [];
    for (const key of wordSets.keys()) {
      if (debouncedSearch.length > 0 && key >= debouncedSearch.length) {
        const set = wordSets.get(key);
        if (set) {
          words = [...words, ...set];
        }
      }
    }

    setSearchableWords(words);
  }, [debouncedSearch]);

  //Enter when adding a guess
  function handleKeyDown(event: { key: string }) {
    if (event.key === "Enter") tryAddGuess();
  }

  function tryAddGuess() {
    const guessValue = guessField.getValue();
    const wordSet = wordSets.get(guessField.getValue().length);

    const validationResponse = validateGuess(
      guessValue,
      guesses,
      wordSet,
      onlyAllowWordListGuesses,
    );

    if (!validationResponse.validated) {
      return guessField.setError(validationResponse.message);
    }

    const guess: Guess = new Guess(guessValue);
    setGuesses([...guesses, guess]);
    guessField.setValue("");
  }

  function removeGuess(guessToRemove: Guess) {
    setGuesses(
      guesses.filter((g) => g.wordString !== guessToRemove.wordString),
    );
  }

  function updateGuess(updatedGuess: Guess) {
    setGuesses(
      guesses.map((g) =>
        g.wordString === updatedGuess.wordString ? updatedGuess : g,
      ),
    );
  }

  return (
    <Paper>
      <Box>
        <InputLabel>Guess</InputLabel>
        <Flex classNames={{ root: classes.guess_input_container }}>
          <Select
            {...guessField.getInputProps()}
            aria-label="Guess"
            placeholder="Enter your guess"
            onKeyDown={handleKeyDown}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            data={searchableWords}
            //filter={optionsFilter}
            limit={5}
            searchable
          />
          <Button onClick={tryAddGuess}>Add</Button>
        </Flex>
      </Box>

      <GuessContext value={{ removeGuess, updateGuess, doAnimations }}>
        {guesses.map((guess, i) => (
          <GuessItem key={i} guess={guess} />
        ))}
      </GuessContext>
    </Paper>
  );
}
