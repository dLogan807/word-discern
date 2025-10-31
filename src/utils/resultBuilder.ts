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

  return shuffled ? shuffleArray(results) : results.sort();
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
      if (parseResult.blackListedPosChars[i] == null) {
        parseResult.blackListedPosChars[i] = new Set<string>();
      }

      if (char.correctness == LetterCorrectness.Correct) {
        parseResult.correctPosChars[i] = char.value;

        parseResult.blackListedPosChars[i].delete(char.value);
        return;
      }

      if (canBlacklistLetter(parseResult.correctPosChars[i], char.value)) {
        parseResult.blackListedPosChars[i].add(char.value);

        if (char.correctness === LetterCorrectness.WrongPosition) {
          parseResult.requiredSomewhereChars.add(char.value);
        }
      }
    });
  }

  return parseResult;
}

function canBlacklistLetter(
  correctLetter: string | undefined,
  thisLetter: string
) {
  return correctLetter === undefined || correctLetter !== thisLetter;
}

function matchGuessesWithWords(
  wordSet: Set<string>,
  guessData: ParsedGuesses
): string[] {
  const results: string[] = [];

  for (const word of wordSet) {
    const requiredSomewhereCharsCopy: Set<string> = new Set<string>([
      ...guessData.requiredSomewhereChars,
    ]);
    let invalidWord = false;

    for (let i = 0; i < word.length; i++) {
      if (
        requiredCharMissing(guessData.correctPosChars[i], word[i]) ||
        charAtBadPos(guessData.blackListedPosChars[i], word[i])
      ) {
        invalidWord = true;
        break;
      }

      requiredSomewhereCharsCopy.delete(word[i]);
    }

    if (!invalidWord && requiredSomewhereCharsCopy.size == 0) {
      results.push(word);
    }
  }

  return results;
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
