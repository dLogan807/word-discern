import { ReactNode } from "react";
import { GuessContext, GuessContextType } from "@/contexts/GuessContext";

export default function GuessProvider({
  children,
  guessOperations: { removeGuess, setNextLetterCorrectnessForAllGuesses },
}: {
  children: ReactNode;
  guessOperations: GuessContextType;
}) {
  return (
    <GuessContext value={{ removeGuess, setNextLetterCorrectnessForAllGuesses }}>
      {children}
    </GuessContext>
  );
}
