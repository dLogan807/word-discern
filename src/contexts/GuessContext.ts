import { createContext } from "react";
import { Guess } from "@/classes/guess";
import { Letter } from "@/classes/letter";

export type GuessContextType = {
  guesses: Guess[];
  addGuess: (newGuess: string) => void;
  removeGuess: (guess: Guess) => void;
  setNextLetterCorrectnessForAllGuesses: (
    letter: Letter,
    letterIndex: number,
    guessIndex: number
  ) => void;
};

export const GuessContext = createContext<GuessContextType | undefined>(undefined);
