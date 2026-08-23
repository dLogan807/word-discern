import { Guess } from "@/classes/guess";
import { CharRevealState, LetterCorrectness } from "@/enums/enums";

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
  const targetWordSpecs = getTargetWordSpecsFromGuesses(guesses);
  const results = getPossibleWordsFromSpecs(wordSet, targetWordSpecs);

  if (shuffled) {
    shuffleArray(results);
  } else {
    results.sort();
  }

  const initialCharRevealStates = Array.from(
    { length: targetWordSpecs.wordIndexes.length },
    (_, i) =>
      targetWordSpecs.wordIndexes[i].correctChar !== undefined && onlyHideUnknownChars
        ? CharRevealState.PERM_REVEALED
        : CharRevealState.HIDDEN
  );

  return {
    words: results,
    initialCharRevealStates: initialCharRevealStates,
  };
}

type TargetWordIndex = {
  // The correct character for this index
  correctChar: string | undefined;
  // Characters blacklisted from this index
  blackListedChars: Set<string>;
};

type TargetWordSpecs = {
  // Represents each character of the word
  wordIndexes: TargetWordIndex[];
  // Characters that must appear *somewhere*
  charsRequiredAtUnknownPosition: Set<string>; // NOTE instead of this, consider recording *potential* chars at each index
};

function getTargetWordSpecsFromGuesses(guesses: Guess[]): TargetWordSpecs {
  const guessLength = guesses[0].wordString.length;

  const wordIndexes: TargetWordIndex[] = Array.from({ length: guessLength }, () => ({
    correctChar: undefined,
    blackListedChars: new Set<string>(),
  }));
  const charsRequiredAtUnknownPosition = new Set<string>();

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
        wordIndexes[i].correctChar = char.value;
        wordIndexes[i].blackListedChars.delete(char.value);
        continue;
      }

      // Blacklist chars from applicable indexes
      const correctLetter = wordIndexes[i].correctChar;
      if (correctLetter === undefined || correctLetter !== char.value) {
        if (char.correctness === LetterCorrectness.WrongPosition) {
          wordIndexes[i].blackListedChars.add(char.value);
          charsRequiredAtUnknownPosition.add(char.value);
        } else if (!validCharOccurences.has(char.value)) {
          for (let j = 0; j < guess.letters.length; j++) {
            wordIndexes[j].blackListedChars.add(char.value);
          }
        }
      }
    }
  }

  const targetWordSpecs: TargetWordSpecs = {
    wordIndexes: wordIndexes,
    charsRequiredAtUnknownPosition: charsRequiredAtUnknownPosition,
  };

  inferCorrectPosChars(targetWordSpecs);

  return targetWordSpecs;
}

// If a char is wrong at every position except one, set it as correct at that index
function inferCorrectPosChars(targetWordSpecs: TargetWordSpecs) {
  const { wordIndexes, charsRequiredAtUnknownPosition } = targetWordSpecs;

  for (const char of charsRequiredAtUnknownPosition) {
    const charCorrectPositionIsKnown = !wordIndexes.every((index) => index.correctChar !== char);
    if (charCorrectPositionIsKnown) continue;

    const allowedIndexes: number[] = [];

    for (let i = 0; i < wordIndexes.length; i++) {
      if (wordIndexes[i].correctChar === undefined && !wordIndexes[i].blackListedChars.has(char)) {
        if (allowedIndexes.length > 1) break;

        allowedIndexes.push(i);
      }
    }

    if (allowedIndexes.length === 1) {
      const singularValidCharIndex = allowedIndexes[0];
      wordIndexes[singularValidCharIndex].correctChar = char;
    }
  }
}

function getPossibleWordsFromSpecs(
  wordSet: Set<string>,
  targetWordSpecs: TargetWordSpecs
): string[] {
  const { wordIndexes, charsRequiredAtUnknownPosition } = targetWordSpecs;

  const results: string[] = [];

  for (const word of wordSet) {
    const requiredSomewhereCharsCopy = new Set(charsRequiredAtUnknownPosition);
    let invalidWord = false;

    for (let i = 0; i < word.length; i++) {
      if (
        requiredCharMissing(wordIndexes[i].correctChar, word[i]) ||
        charAtBadPos(wordIndexes[i].blackListedChars, word[i])
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
  return requiredChar !== undefined && requiredChar !== charToCompare;
}

function charAtBadPos(blackListedCharArray: Set<string>, charToCompare: string): boolean {
  return blackListedCharArray.has(charToCompare);
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
