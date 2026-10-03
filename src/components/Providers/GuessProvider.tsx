import { useCallback, ReactNode } from "react";
import { Guess } from "@/classes/guess";
import { Letter } from "@/classes/letter";
import { GuessContext } from "@/contexts/GuessContext";
import { LetterCorrectness } from "@/enums/enums";

export default function GuessProvider({
  children,
  setGuesses,
}: {
  children: ReactNode;
  setGuesses: React.Dispatch<React.SetStateAction<Guess[]>>;
}) {
  const removeGuess = useCallback(
    (guessToRemove: Guess) => {
      setGuesses((currentGuesses) =>
        currentGuesses.filter((g) => g.wordString !== guessToRemove.wordString)
      );
    },
    [setGuesses]
  );

  const updateLetterCorrectness = useCallback(
    (guess: Guess, letterIndex: number, nextLetterCorrectness: LetterCorrectness) => {
      return new Guess(
        guess.wordString,
        guess.letters.map((guessLetter, index) =>
          index === letterIndex ? nextLetterCorrectness : guessLetter.correctness
        )
      );
    },
    []
  );

  const getCorrectnessToApply = useCallback(
    (
      guess: Guess,
      guessIndex: number,
      currentGuessIndex: number,
      letter: Letter,
      letterIndex: number
    ): LetterCorrectness | undefined => {
      const targetLetter = guess.letters[letterIndex];
      const isSameLetter = letter.value === targetLetter.value;
      const nextLetterCorrectness = letter.getNextLetterCorrectness();

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
    },
    []
  );

  const setNextLetterCorrectnessForAllGuesses = useCallback(
    (letter: Letter, letterIndex: number, guessIndex: number) => {
      setGuesses((currentGuesses) =>
        currentGuesses.map((guess, currentGuessIndex) => {
          const correctness = getCorrectnessToApply(
            guess,
            guessIndex,
            currentGuessIndex,
            letter,
            letterIndex
          );

          return correctness === undefined
            ? guess
            : updateLetterCorrectness(guess, letterIndex, correctness);
        })
      );
    },
    [setGuesses, getCorrectnessToApply, updateLetterCorrectness]
  );

  return (
    <GuessContext value={{ removeGuess, setNextLetterCorrectnessForAllGuesses }}>
      {children}
    </GuessContext>
  );
}
