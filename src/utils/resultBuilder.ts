import { Guess } from "../classes/guess";
import { LetterCorrectness } from "../classes/letter";
import { stringsAreEqual } from "./guessValidation";

export default function getResults(
  wordSet: Set<string>,
  guesses: Guess[]
): string[] {
  const parseResult = parseGuesses(guesses);

  return matchGuessesWithWords(wordSet, parseResult);
}

interface ParsedGuesses {
  correctPosChars: string[];
  blackListedPosChars: Array<Set<string>>;
  requiredSomewhereChars: Set<string>;
}

function parseGuesses(guesses: Guess[]): ParsedGuesses {
  const guessLength: number = guesses[0].wordString.length;

  const parseResult: ParsedGuesses = {
    correctPosChars: new Array(guessLength),
    blackListedPosChars: new Array(guessLength),
    requiredSomewhereChars: new Set<string>(),
  };

  for (const guess of guesses) {
    for (let i = 0; i < guess.letters.length; i++) {
      const thisChar = guess.letters[i];

      if (thisChar.correctness == LetterCorrectness.Correct) {
        parseResult.correctPosChars[i] = thisChar.value;
        continue;
      }

      if (parseResult.blackListedPosChars[i] == null) {
        parseResult.blackListedPosChars[i] = new Set<string>();
      }
      parseResult.blackListedPosChars[i].add(thisChar.value);

      if (thisChar.correctness === LetterCorrectness.WrongPosition) {
        parseResult.requiredSomewhereChars.add(thisChar.value);
      }
    }
  }

  return parseResult;
}

function matchGuessesWithWords(
  wordSet: Set<string>,
  guessData: ParsedGuesses
): string[] {
  const results: string[] = [];

  wordLoop: for (const word of wordSet) {
    const requiredSomewhereCharsCopy: Set<string> = new Set<string>([
      ...guessData.requiredSomewhereChars,
    ]);

    for (let i = 0; i < word.length; i++) {
      const requiredCharMissing =
        guessData.correctPosChars[i] !== undefined &&
        !stringsAreEqual(guessData.correctPosChars[i], word[i]);

      if (requiredCharMissing) {
        continue wordLoop;
      }

      const charAtBadPos =
        guessData.blackListedPosChars[i] !== undefined &&
        guessData.blackListedPosChars[i].has(word[i]);

      if (charAtBadPos) {
        continue wordLoop;
      }

      requiredSomewhereCharsCopy.delete(word[i]);
    }

    if (requiredSomewhereCharsCopy.size != 0) {
      continue;
    }

    results.push(word);
  }

  return results;
}
