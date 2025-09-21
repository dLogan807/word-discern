import React, { createContext, useContext, useState, ReactNode } from "react";
import { Guess } from "../classes/guess";

interface GuessContextType {
  guesses: Guess[];
  addGuess: (guess: Guess) => void;
  removeGuess: (guess: Guess) => void;
  clearGuesses: () => void;
}

const GuessContext = createContext<GuessContextType | undefined>(undefined);

export function GuessProvider({ children }: { children: ReactNode }) {
  const [guesses, setGuesses] = useState<Guess[]>([]);

  const addGuess = (guess: Guess) => {
    setGuesses((prev) => [...prev, guess]);
  };

  const removeGuess = (guess: Guess) => {
    setGuesses((prev) => prev.filter((g) => g.wordString !== guess.wordString));
  };

  const clearGuesses = () => {
    setGuesses([]);
  };

  return (
    <GuessContext.Provider
      value={{ guesses, addGuess, removeGuess, clearGuesses }}
    >
      {children}
    </GuessContext.Provider>
  );
}

export function useGuesses() {
  const context = useContext(GuessContext);
  if (context === undefined) {
    throw new Error("useGuesses must be used within a GuessProvider");
  }
  return context;
}
