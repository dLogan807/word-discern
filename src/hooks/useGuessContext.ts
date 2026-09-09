import { useContext } from "react";
import { GuessContext, GuessContextType } from "@/contexts/GuessContext";

export function useGuessContext(): GuessContextType {
  const context = useContext(GuessContext);

  if (context === undefined) {
    throw new Error("useGuessContext must be used within a SettingsProvider");
  }

  return context;
}
