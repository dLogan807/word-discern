import { Box } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";
import { Guess } from "@/classes/guess";
import { Letter } from "@/classes/letter";
import GuessItem from "@/components/Guesses/GuessItem/GuessItem";
import GuessProvider from "@/components/Providers/GuessProvider";
import { LetterCorrectness } from "@/enums/enums";
import GuessAutocompleteInput from "../GuessAutocompleteInput/GuessAutocompleteInput";
import classes from "./GuessInputList.module.css";

type GuessInputListProps = {
  guesses: Guess[];
  setGuesses: Dispatch<SetStateAction<Guess[]>>;
};

export default function GuessInputList({ guesses, setGuesses }: GuessInputListProps) {
  function addGuess(newGuess: string) {
    const initialCorrectnessValues = getInitialCorrectnessValuesFromGuesses(newGuess);
    const guess = new Guess(newGuess, initialCorrectnessValues);
    setGuesses([...guesses, guess]);
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

  return (
    <>
      <GuessAutocompleteInput guesses={guesses} addGuess={addGuess} />

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
