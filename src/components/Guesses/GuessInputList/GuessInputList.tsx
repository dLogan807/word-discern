import { Box } from "@mantine/core";
import { Suspense, Dispatch, SetStateAction } from "react";
import { Guess } from "@/classes/guess";
import GuessItem from "@/components/Guesses/GuessItem/GuessItem";
import GuessProvider from "@/components/Providers/GuessProvider";
import GuessAutocompleteInputSkeleton from "@/components/Skeletons/GuessAutocompleteInputSkeleton/GuessAutocompleteInputSkeleton";
import { LetterCorrectness } from "@/enums/enums";
import GuessAutocompleteInput from "../GuessAutocompleteInput/GuessAutocompleteInput";
import classes from "./GuessInputList.module.css";

type GuessInputListProps = {
  guesses: Guess[];
  setGuesses: Dispatch<SetStateAction<Guess[]>>;
};

export default function GuessInputList({ guesses, setGuesses }: GuessInputListProps) {
  function addGuess(newGuess: string) {
    setGuesses((currentGuesses) => {
      const initialCorrectnessValues = getInitialCorrectnessValuesFromGuesses(
        newGuess,
        currentGuesses
      );
      const guess = new Guess(newGuess, initialCorrectnessValues);
      return [...currentGuesses, guess];
    });
  }

  return (
    <>
      <Suspense fallback={<GuessAutocompleteInputSkeleton />}>
        <GuessAutocompleteInput guesses={guesses} addGuess={addGuess} />
      </Suspense>

      {guesses.length > 0 && (
        <Box className={classes.guess_list}>
          <GuessProvider setGuesses={setGuesses}>
            {guesses.map((guess, idx) => (
              <GuessItem key={guess.wordString} guess={guess} guessIndex={idx} />
            ))}
          </GuessProvider>
        </Box>
      )}
    </>
  );
}

function getInitialCorrectnessValuesFromGuesses(
  newGuess: string,
  guesses: Guess[]
): LetterCorrectness[] {
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
