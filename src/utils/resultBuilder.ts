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
  const targetWordSpecs = getTargetWordSpecs(guesses);
  const possibleWords = getPossibleWords(wordSet, targetWordSpecs);

  if (shuffled) {
    shuffleArray(possibleWords);
  } else {
    possibleWords.sort();
  }

  const initialCharRevealStates = Array.from(
    { length: targetWordSpecs.wordIndexes.length },
    (_, i) =>
      targetWordSpecs.wordIndexes[i].correctChar !== undefined && onlyHideUnknownChars
        ? CharRevealState.PERM_REVEALED
        : CharRevealState.HIDDEN
  );

  return {
    words: possibleWords,
    initialCharRevealStates: initialCharRevealStates,
  };
}

type TargetWordIndex = {
  // The correct character for this index
  correctChar?: string;
  // Characters blacklisted from this index
  blackListedChars?: Set<string>;
};

type TargetWordSpecs = {
  // Represents each character of the word
  wordIndexes: TargetWordIndex[];
  // Characters that must appear *somewhere*
  charsRequiredAtUnknownIndex: Set<string>;
};

const getBlackListedChars = (wordIndex: TargetWordIndex): Set<string> =>
  (wordIndex.blackListedChars ??= new Set<string>());

function getTargetWordSpecs(guesses: Guess[]): TargetWordSpecs {
  const guessLength = guesses[0].wordString.length;

  const wordIndexes: TargetWordIndex[] = Array.from({ length: guessLength }, () => ({}));
  const charsRequiredAtUnknownIndex = new Set<string>();

  for (const guess of guesses) {
    for (let i = 0; i < guess.letters.length; i++) {
      const char = guess.letters[i];

      if (char.correctness === LetterCorrectness.Correct) {
        wordIndexes[i].correctChar = char.value;
        wordIndexes[i].blackListedChars = undefined;
        continue;
      }

      // Blacklist chars from applicable indexes
      const correctLetter = wordIndexes[i].correctChar;
      if (correctLetter === undefined || correctLetter !== char.value) {
        if (char.correctness === LetterCorrectness.WrongPosition) {
          getBlackListedChars(wordIndexes[i]).add(char.value);
          charsRequiredAtUnknownIndex.add(char.value);
        } else if (
          char.correctness === LetterCorrectness.NotPresent &&
          !charsRequiredAtUnknownIndex.has(char.value)
        ) {
          blacklistCharFromAllUncertainIndexes(wordIndexes, char.value);
        }
      }
    }
  }

  function blacklistCharFromAllUncertainIndexes(
    wordIndexes: TargetWordIndex[],
    charToBlackList: string
  ) {
    for (const index of wordIndexes) {
      if (index.correctChar !== undefined) continue;

      getBlackListedChars(index).add(charToBlackList);
    }
  }

  const targetWordSpecs: TargetWordSpecs = {
    wordIndexes: wordIndexes,
    charsRequiredAtUnknownIndex: charsRequiredAtUnknownIndex,
  };

  inferAndUpdateCorrectPosChars(targetWordSpecs);

  return targetWordSpecs;
}

// If a char is wrong at every position except one, set it as correct at that index
function inferAndUpdateCorrectPosChars({
  wordIndexes,
  charsRequiredAtUnknownIndex,
}: TargetWordSpecs) {
  for (const char of charsRequiredAtUnknownIndex) {
    const charCorrectPositionIsKnown = !wordIndexes.every((index) => index.correctChar !== char);
    if (charCorrectPositionIsKnown) continue;

    const allowedIndexes: number[] = [];

    for (let i = 0; i < wordIndexes.length; i++) {
      if (wordIndexes[i].correctChar === undefined && !wordIndexes[i].blackListedChars?.has(char)) {
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

function getPossibleWords(
  wordSet: Set<string>,
  { wordIndexes, charsRequiredAtUnknownIndex }: TargetWordSpecs
): string[] {
  const possibleWords: string[] = [];

  for (const word of wordSet) {
    const charsRequiredAtUnknownIndexCopy = new Set(charsRequiredAtUnknownIndex);
    let invalidWord = false;

    for (let i = 0; i < word.length; i++) {
      if (
        correctCharDoesNotMatch(wordIndexes[i].correctChar, word[i]) ||
        charAtBlackListedIndex(wordIndexes[i].blackListedChars, word[i])
      ) {
        invalidWord = true;
        break;
      }

      charsRequiredAtUnknownIndexCopy.delete(word[i]);
    }

    if (!invalidWord && charsRequiredAtUnknownIndexCopy.size === 0) {
      possibleWords.push(word);
    }
  }

  return possibleWords;
}

function correctCharDoesNotMatch(
  requiredChar: TargetWordIndex["correctChar"],
  charToCompare: string
): boolean {
  return requiredChar !== undefined && requiredChar !== charToCompare;
}

function charAtBlackListedIndex(
  blackListedCharArray: TargetWordIndex["blackListedChars"],
  charToCompare: string
): boolean {
  return blackListedCharArray?.has(charToCompare) ?? false;
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
