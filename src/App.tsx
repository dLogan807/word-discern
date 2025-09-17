import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { useRef, useState } from "react";
import GuessItem from "./components/GuessItem";

export type Letter = {
  value: string;
  correctness: number;
};

export type Guess = {
  wordString: string;
  letters: Letter[];
};

type ValidationResponse = {
  validated: boolean;
  message: string;
};

type ValidationRequest = {
  guess: string;
  prevGuesses: string[];
};

export default function App() {
  const [results, setResults] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [guessSuccess, setGuessSuccess] = useState<ValidationResponse>();

  const guessGrid: React.ReactElement =
    guesses.length == 0 ? (
      <p>Your guesses will appear here.</p>
    ) : (
      <ul className="guess_container">
        {guesses.map((guess, idx) => (
          <GuessItem
            key={idx}
            guess={guess}
            clickLetterAction={getNextLetterCorrectness}
            removeAction={() => removeGuess(guess)}
          />
        ))}
      </ul>
    );

  const formRef = useRef<HTMLFormElement>(null);

  //Inform of issues with guess
  const formMessage: React.ReactNode =
    guessSuccess?.message !== null && guessSuccess?.validated == false ? (
      <div className="form_message">
        <p>{guessSuccess?.message}</p>
      </div>
    ) : null;

  return (
    <MantineProvider theme={theme}>
      <h1>Wordle Helper</h1>
      <p>Provides possible words from what you've guessed.</p>
      <form
        className="add_guess_form"
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const guess = formData.get("guess") as string;
          validateGuess({ guess, prevGuesses: guessesToStringArray(guesses) });
        }}
      >
        <input name="guess" placeholder="Enter guess" />
        <button type="submit">Add</button>
      </form>
      {formMessage}
      {guessGrid}
      <button
        disabled={guesses.length == 0}
        onClick={async () => {
          await getPossibleWords(guesses);
        }}
      >
        Get Possible Words!
      </button>
      <ul>
        {results.map((word, idx) => (
          <li key={idx} className="result_item">
            {capitalizeFirstLetter(word)}
          </li>
        ))}
      </ul>
    </MantineProvider>
  );

  //API call. Check if guess is valid
  async function validateGuess(
    guessValidReq: ValidationRequest
  ): Promise<ValidationResponse> {
    const headers: Headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

    const request: RequestInfo = new Request(`${BACKEND}/guess/validate`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(guessValidReq),
    });

    const response: ValidationResponse = await fetch(request)
      .then((res) => res.json())
      .then((data) => ({
        validated: data.validated,
        message: data.message,
      }))
      .catch(() => ({
        validated: false,
        message: "A server error occured",
      }));

    if (response.validated) {
      formRef.current?.reset();
      setGuesses([...guesses, stringToGuess(guessValidReq.guess)]);
    }
    setGuessSuccess(response);

    return response;
  }

  //API call. Get possible words from guesses
  async function getPossibleWords(guesses: Guess[]): Promise<string[]> {
    const headers: Headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

    const request: RequestInfo = new Request(`${BACKEND}/guess/possiblewords`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(guesses),
    });

    const response: string[] = await fetch(request)
      .then((res) => res.json())
      .catch((error) => {
        console.log(error);
        return [];
      });

    setResults(response);

    return response;
  }

  //Set array to one not containing guess
  function removeGuess(guess: Guess) {
    setGuesses(guesses.filter((g) => g.wordString != guess.wordString));
  }

  //Set new array of guesses where letter has new correctness
  function getNextLetterCorrectness(letter: Letter) {
    const newGuesses: Guess[] = guesses.map((guess) => ({
      ...guess,
      letters: guess.letters.map((l) =>
        l === letter
          ? { ...l, correctness: cycleLetterCorrectness(l.correctness) }
          : l
      ),
    }));

    setGuesses(newGuesses);
  }
}

//Increment correctness value
function cycleLetterCorrectness(correctness: number): number {
  return correctness >= 2 ? 0 : correctness + 1;
}

function guessesToStringArray(guesses: Guess[]): string[] {
  const stringGuesses: string[] = guesses.map((guess) => guess.wordString);
  return stringGuesses;
}

function stringToGuess(guessString: string): Guess {
  const letters: Letter[] = guessString.split("").map((letterString) => ({
    value: letterString,
    correctness: 0,
  }));

  const guess: Guess = {
    wordString: guessString,
    letters: letters,
  };

  return guess;
}

function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
