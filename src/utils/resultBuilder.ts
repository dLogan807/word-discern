import { Guess } from "@/classes/guess";
import { CharRevealState, LetterCorrectness } from "@/enums/enums";
import { stringsAreEqual } from "@/utils/guessValidation";

export const EMPTY_RESULTS: IResults = {
  words: [],
  initialCharRevealStates: [],
};

export interface IResults {
  words: string[];
  initialCharRevealStates: CharRevealState[];
  defaultHidden?: boolean;
}

export default function getResults(
  wordSet: Set<string>,
  guesses: Guess[],
  shuffled?: boolean,
  onlyHideUnknownChars?: boolean
): IResults {
  const parseResult = parseGuesses(guesses);
  const results = matchGuessesWithWords(wordSet, parseResult);

  if (shuffled) {
    shuffleArray(results);
  } else {
    results.sort();
  }

  const initialCharRevealStates = Array.from(
    { length: parseResult.correctPosChars.length },
    (_, i) =>
      parseResult.correctPosChars[i] !== undefined && onlyHideUnknownChars
        ? CharRevealState.PERM_REVEALED
        : CharRevealState.HIDDEN
  );

  return {
    words: results,
    initialCharRevealStates: initialCharRevealStates,
  };
}

interface ParsedGuesses {
  // Char that must be preset for a given index
  correctPosChars: string[];
  // Set of blacklisted chars for each index
  blackListedPosChars: Set<string>[];
  // Set of chars that must be in the word somewhere
  requiredSomewhereChars: Set<string>;
}

function parseGuesses(guesses: Guess[]): ParsedGuesses {
  const guessLength = guesses[0].wordString.length;

  const correctPosChars = new Array(guessLength);
  const blackListedPosChars = Array.from({ length: guessLength }, () => new Set<string>());
  const requiredSomewhereChars = new Set<string>();

  const wrongPosCharsAtIndex = Array.from({ length: guessLength }, () => new Set<string>());

  for (const guess of guesses) {
    const validCharOccurences = new Map<string, number>();

    for (let i = 0; i < guess.letters.length; i++) {
      const char = guess.letters[i];

      // Count how many times the char is correct or in the wrong position
      if (
        char.correctness === LetterCorrectness.Correct ||
        char.correctness === LetterCorrectness.WrongPosition
      ) {
        const occurenceCount = (validCharOccurences.get(char.value) ?? 0) + 1;
        validCharOccurences.set(char.value, occurenceCount);
      }

      if (char.correctness === LetterCorrectness.Correct) {
        correctPosChars[i] = char.value;
        blackListedPosChars[i].delete(char.value);
        continue;
      }

      // Blacklist chars from applicable indexes
      const correctLetter = correctPosChars[i];
      if (correctLetter === undefined || correctLetter !== char.value) {
        if (char.correctness === LetterCorrectness.WrongPosition) {
          blackListedPosChars[i].add(char.value);
          requiredSomewhereChars.add(char.value);

          wrongPosCharsAtIndex[i].add(char.value);
        } else if (!validCharOccurences.has(char.value)) {
          for (let j = 0; j < guess.letters.length; j++) {
            blackListedPosChars[j].add(char.value);
          }
        }
      }
    }
  }

  inferCorrectPosCharsFromWrongPosChars(
    correctPosChars,
    requiredSomewhereChars,
    wrongPosCharsAtIndex
  );

  return {
    correctPosChars,
    blackListedPosChars,
    requiredSomewhereChars,
  };
}

// If a char is wrong at every position except one, set it as correct at that index
function inferCorrectPosCharsFromWrongPosChars(
  correctPosChars: string[],
  requiredSomewhereChars: Set<string>,
  wrongPosCharsAtIndex: Array<Set<string>>
) {
  const checkedChars = new Set<string>();

  const allWrongPositionChars = requiredSomewhereChars.values();

  for (const char of allWrongPositionChars) {
    if (checkedChars.has(char)) continue;

    const allowedIndexes: number[] = [];

    for (let i = 0; i < wrongPosCharsAtIndex.length; i++) {
      if (!wrongPosCharsAtIndex[i].has(char)) {
        allowedIndexes.push(i);
      }
    }

    const singleValidCharIndex = allowedIndexes[0];
    if (allowedIndexes.length === 1 && correctPosChars[singleValidCharIndex] === undefined) {
      correctPosChars[singleValidCharIndex] = char;
    }

    checkedChars.add(char);
  }
}

function matchGuessesWithWords(wordSet: Set<string>, guessData: ParsedGuesses): string[] {
  const results: string[] = [];

  for (const word of wordSet) {
    const requiredSomewhereCharsCopy: Set<string> = new Set<string>(
      guessData.requiredSomewhereChars
    );
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

    if (!invalidWord && requiredSomewhereCharsCopy.size === 0) {
      results.push(word);
    }
  }

  return results;
}

function requiredCharMissing(requiredChar: string | undefined, charToCompare: string): boolean {
  return requiredChar !== undefined && !stringsAreEqual(requiredChar, charToCompare);
}

function charAtBadPos(
  blackListedCharArray: Set<string> | undefined,
  charToCompare: string
): boolean {
  return blackListedCharArray !== undefined && blackListedCharArray.has(charToCompare);
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
