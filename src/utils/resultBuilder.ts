import { Guess } from "../classes/guess";
import { LetterCorrectness } from "../classes/letter";
import { stringsAreEqual } from "./guessValidation";

export default function getResults(
  wordSet: Set<string>,
  guesses: Guess[],
  shuffled?: boolean
): string[] {
  const parseResult = parseGuesses(guesses);
  const results = matchGuessesWithWords(wordSet, parseResult);

  return shuffled ? shuffleArray(results) : results;
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
    guess.letters.forEach((char, i) => {
      if (char.correctness == LetterCorrectness.Correct) {
        parseResult.correctPosChars[i] = char.value;
        return;
      }

      if (parseResult.blackListedPosChars[i] == null) {
        parseResult.blackListedPosChars[i] = new Set<string>();
      }
      parseResult.blackListedPosChars[i].add(char.value);

      if (char.correctness === LetterCorrectness.WrongPosition) {
        parseResult.requiredSomewhereChars.add(char.value);
      }
    });
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
      if (
        requiredCharMissing(guessData.correctPosChars[i], word[i]) ||
        charAtBadPos(guessData.blackListedPosChars[i], word[i])
      ) {
        continue wordLoop; //Need to refactor this to remove reliance on
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

function shuffleArray<T>(array: T[]): T[] {
  const minRand = 0;
  const maxRand = array.length - 1;

  array.forEach((element, index) => {
    const randomIndex = getRandomNum(minRand, maxRand);
    const randomElement = array[randomIndex];
    array[randomIndex] = element;
    array[index] = randomElement;
  });

  return array;
}

function getRandomNum(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1));
}

function requiredCharMissing(
  requiredChar: string | undefined,
  charToCompare: string
): boolean {
  return (
    requiredChar != undefined && !stringsAreEqual(requiredChar, charToCompare)
  );
}

function charAtBadPos(
  blackListedCharArray: Set<string> | undefined,
  charToCompare: string
): boolean {
  return (
    blackListedCharArray != undefined && blackListedCharArray.has(charToCompare)
  );
}
