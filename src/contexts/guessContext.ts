import { createContext } from "react";
import { Guess } from "@/classes/guess";
import { Letter } from "@/classes/letter";

export type GuessContextType = {
  removeGuess: (guess: Guess) => void;
  setNextLetterCorrectnessForAllGuesses: (letterIndex: number, letter: Letter) => void;
};

export const GuessContext = createContext<GuessContextType | undefined>(undefined);
