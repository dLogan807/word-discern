import { Button, Flex, Paper, Text, TextInput } from "@mantine/core";
import { createContext } from "react";
import { Guess } from "@/classes/guess";
import GuessItem from "@/components/Guesses/GuessItem/GuessItem";
import { useField } from "@mantine/form";
import { validateGuess } from "@/utils/guessValidation";
import classes from "./Guesses.module.css";

export const GuessContext = createContext<{
  removeGuess: (guess: Guess) => void;
  updateGuess: (guess: Guess) => void;
}>({
  removeGuess: () => {},
  updateGuess: () => {},
});

export default function Guesses({
  guesses,
  wordSets,
  setGuesses,
}: {
  guesses: Guess[];
  wordSets: Map<number, Set<string>> | undefined;
  setGuesses: (value: Guess[]) => void;
}) {
  const guessField = useField({
    initialValue: "",
  });

  //Enter when adding a guess
  function handleKeyDown(event: { key: string }) {
    if (event.key === "Enter") tryAddGuess();
  }

  function tryAddGuess() {
    const guessValue = guessField.getValue();
    const validationResponse = validateGuess(
      guessValue,
      guesses,
      wordSets ? wordSets.get(guessValue.length) : undefined
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
      guesses.filter((g) => g.wordString !== guessToRemove.wordString)
    );
  }

  function updateGuess(updatedGuess: Guess) {
    setGuesses(
      guesses.map((g) =>
        g.wordString === updatedGuess.wordString ? updatedGuess : g
      )
    );
  }

  return (
    <Paper>
      <Paper>
        <Text>Guess</Text>
        <Flex classNames={{ root: classes.guess_input_container }}>
          <TextInput
            {...guessField.getInputProps()}
            aria-label="Guess"
            placeholder="Enter your guess"
            onKeyDown={handleKeyDown}
          />
          <Button onClick={tryAddGuess}>Add</Button>
        </Flex>
      </Paper>

      <GuessContext value={{ removeGuess, updateGuess }}>
        {guesses.map((guess, i) => (
          <GuessItem key={i} guess={guess} />
        ))}
      </GuessContext>
    </Paper>
  );
}
