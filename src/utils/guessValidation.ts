import { Guess } from "@/classes/guess";

interface ValidationResponse {
  validated: boolean;
  message: string;
}

export function validateGuess(
  guess: string,
  guesses: Guess[],
  wordSet: Set<string> | undefined,
  onlyAllowWordListGuesses: boolean
): ValidationResponse {
  const trimmedGuess = guess.trim();
  const minLength = 1;
  const allowedLength = guesses.length > 0 ? guesses[0].wordString.length : -1;

  const response: ValidationResponse = {
    validated: false,
    message: "",
  };

  if (trimmedGuess.length < minLength) {
    response.message = "Please enter a guess";
  } else if (allowedLength > 0 && trimmedGuess.length !== allowedLength) {
    response.message = `Different length to previous guesses (${trimmedGuess.length} vs ${allowedLength})`;
  } else if (alreadyGuessed(trimmedGuess, guesses)) {
    response.message = "Already guessed";
  } else if (!wordSet) {
    response.message = "No words in list of this length";
  } else if (onlyAllowWordListGuesses && !wordSet.has(trimmedGuess.toLocaleLowerCase())) {
    response.message = "Not in word list";
  } else {
    response.validated = true;
  }

  return response;
}

function alreadyGuessed(guess: string, guesses: Guess[]): boolean {
  for (const aGuess of guesses) {
    if (stringsAreEqual(guess, aGuess.wordString)) return true;
  }

  return false;
}

export function stringsAreEqual(value: string, otherValue: string): boolean {
  return (
    value.localeCompare(otherValue, undefined, {
      sensitivity: "accent",
    }) === 0
  );
}
