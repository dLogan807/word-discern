import { ReactNode } from "react";
import { GuessContext, GuessContextType } from "@/hooks/useGuessContext";

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
