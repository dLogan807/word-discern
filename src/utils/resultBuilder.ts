import { Guess } from "@/classes/guess";
import { CharRevealState, LetterCorrectness } from "@/enums/enums";
import shuffleArray from "./shuffleArray";

export const EMPTY_RESULTS: IResults = {
  words: [],
  initialCharRevealStates: [],
};

export interface IResults {
  words: string[];
  initialCharRevealStates: CharRevealState[];
  defaultHidden?: boolean;
}

type TargetWordIndex = {
  // The correct character for this index
  correctChar?: string;
  // Characters blacklisted from this index
  blackListedChars?: Set<string>;
};

type CharOccurenceDetails = {
  numCorrect: number;
  numRequiredSomewhere: number;
  // Minimum number of this char a word needs
  minOccurences: number;
  // The max occurences of this char is known
  minOccurencesIsMax?: boolean;
};

type IncrementableCharOccurenceDetailsFields = Pick<
  CharOccurenceDetails,
  "numCorrect" | "numRequiredSomewhere"
>;

type TargetWordRequirements = {
  // Requirements each index of a word must fufill
  wordIndexes: TargetWordIndex[];
  // Characters that must appear in the word
  charOccurences: Map<string, CharOccurenceDetails>;
};

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

function getTargetWordSpecs(guesses: Guess[]): TargetWordRequirements {
  const guessLength = guesses[0].wordString.length;

  const wordIndexes: TargetWordIndex[] = Array.from({ length: guessLength }, () => ({}));
  const charOccurences = new Map<string, CharOccurenceDetails>();
  const charsToBlacklistAcrossIndexes = new Set<string>();

  for (const guess of guesses) {
    const charOccurencesThisGuess = new Map<string, CharOccurenceDetails>();
    const charsBlacklistedThisGuess = new Set<string>();

    for (let i = 0; i < guess.letters.length; i++) {
      const char = guess.letters[i];

      if (char.correctness === LetterCorrectness.Correct) {
        wordIndexes[i].correctChar = char.value;

        incrementNumCorrect(charOccurencesThisGuess, char.value);
        continue;
      }

      // Blacklist chars from applicable indexes
      const correctChar = wordIndexes[i].correctChar;
      if (correctChar === undefined || correctChar !== char.value) {
        if (char.correctness === LetterCorrectness.WrongPosition) {
          getIndexBlackListedChars(wordIndexes[i]).add(char.value);
          charsToBlacklistAcrossIndexes.delete(char.value);

          incrementNumRequiredSomewhere(charOccurencesThisGuess, char.value);
        } else if (char.correctness === LetterCorrectness.NotPresent) {
          getIndexBlackListedChars(wordIndexes[i]).add(char.value);

          const shouldBlackListEverywhere = !charOccurencesThisGuess.get(char.value)
            ?.numRequiredSomewhere;
          if (shouldBlackListEverywhere) {
            charsToBlacklistAcrossIndexes.add(char.value);
          }

          charsBlacklistedThisGuess.add(char.value);
        }
      }
    }

    updateCharOccurences(charOccurences, charsBlacklistedThisGuess, charOccurencesThisGuess);
  }

  blacklistCharFromAllIncorrectIndexes(wordIndexes, charsToBlacklistAcrossIndexes);

  const targetWordSpecs: TargetWordRequirements = {
    wordIndexes: wordIndexes,
    charOccurences: charOccurences,
  };

  inferAndUpdateCorrectPosChars(targetWordSpecs);

  return targetWordSpecs;
}

function getPossibleWords(
  wordSet: Set<string>,
  { wordIndexes, charOccurences }: TargetWordRequirements
): string[] {
  const possibleWords: string[] = [];

  for (const word of wordSet) {
    const charDetailsThisWord = new Map<string, CharOccurenceDetails>();
    let isInvalidWord = false;

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const correctChar = wordIndexes[i].correctChar;

      if (guessRequirementsDisallowsChar(char, correctChar, wordIndexes[i].blackListedChars)) {
        isInvalidWord = true;
        break;
      }

      if (guessRequirementsCorrectCharDoesNotMatch(char, correctChar)) {
        incrementNumCorrect(charDetailsThisWord, char);
        continue;
      }

      if (guessRequirementsRequiresCharSomewhere(char, charOccurences)) {
        incrementNumRequiredSomewhere(charDetailsThisWord, char);
      }
    }

    if (
      isInvalidWord ||
      numCharsThisWordDoNotMatchGuessRequirements(charOccurences, charDetailsThisWord)
    ) {
      continue;
    }

    possibleWords.push(word);
  }

  return possibleWords;
}

const incrementNumCorrect = (charOccurences: Map<string, CharOccurenceDetails>, char: string) =>
  incrementFieldAmount(charOccurences, char, "numCorrect");

const incrementNumRequiredSomewhere = (
  charOccurences: Map<string, CharOccurenceDetails>,
  char: string
) => incrementFieldAmount(charOccurences, char, "numRequiredSomewhere");

function incrementFieldAmount(
  charOccurences: Map<string, CharOccurenceDetails>,
  char: string,
  field: keyof IncrementableCharOccurenceDetailsFields
) {
  const charOccurenceDetails = charOccurences.get(char) ?? {
    numCorrect: 0,
    numRequiredSomewhere: 0,
    minOccurences: 0,
  };
  const currentValue = charOccurenceDetails[field];

  charOccurences.set(char, {
    ...charOccurenceDetails,
    [field]: currentValue + 1,
  });
}

const getIndexBlackListedChars = (wordIndex: TargetWordIndex): Set<string> =>
  (wordIndex.blackListedChars ??= new Set<string>());

function updateCharOccurences(
  charOccurences: Map<string, CharOccurenceDetails>,
  charsBlacklistedThisGuess: Set<string>,
  charOccurencesThisGuess: Map<string, CharOccurenceDetails>
) {
  for (const [char, guessDetails] of charOccurencesThisGuess) {
    const currentDetails = charOccurences.get(char);

    const guessTotal = guessDetails.numCorrect + guessDetails.numRequiredSomewhere;

    // If max char occurences is known and the new known correct number isn't more informative, then skip the update
    if (
      currentDetails?.minOccurencesIsMax &&
      (guessTotal > currentDetails.minOccurences ||
        currentDetails.numCorrect >= guessDetails.numCorrect)
    ) {
      continue;
    }

    charOccurences.set(char, {
      numCorrect: guessDetails.numCorrect,
      numRequiredSomewhere: guessDetails.numRequiredSomewhere,
      minOccurences: guessTotal,
      minOccurencesIsMax: charsBlacklistedThisGuess.has(char),
    });
  }
}

function blacklistCharFromAllIncorrectIndexes(
  wordIndexes: TargetWordIndex[],
  charsToBlacklistAcrossIndexes: Set<string>
) {
  for (const charToBlackList of charsToBlacklistAcrossIndexes) {
    for (const index of wordIndexes) {
      if (index.correctChar !== undefined) continue;

      getIndexBlackListedChars(index).add(charToBlackList);
    }
  }
}

// If chars required somewhere = number of positions left, then those chars must belong there
function inferAndUpdateCorrectPosChars({ wordIndexes, charOccurences }: TargetWordRequirements) {
  for (const [char, charOccurenceDetails] of charOccurences) {
    const allowedIndexes: number[] = [];

    for (let i = 0; i < wordIndexes.length; i++) {
      if (wordIndexes[i].correctChar === undefined && !wordIndexes[i].blackListedChars?.has(char)) {
        allowedIndexes.push(i);
      }
    }
    if (!allowedIndexes.length) continue;

    if (allowedIndexes.length === charOccurenceDetails.numRequiredSomewhere) {
      for (let i = 0; i < allowedIndexes.length; i++) {
        const validCharIndex = allowedIndexes[i];
        wordIndexes[validCharIndex].correctChar = char;
      }
    }
  }
}

function guessRequirementsDisallowsChar(
  char: string,
  correctChar: string | undefined,
  blackListedChars: Set<string> | undefined
): boolean {
  const correctCharDoesNotMatch = correctChar !== undefined && correctChar !== char;
  return correctCharDoesNotMatch || (blackListedChars?.has(char) ?? false);
}

const guessRequirementsCorrectCharDoesNotMatch = (
  char: string,
  correctChar: string | undefined
): boolean => correctChar !== undefined && correctChar === char;

const guessRequirementsRequiresCharSomewhere = (
  char: string,
  charOccurences: Map<string, CharOccurenceDetails>
): boolean => charOccurences.get(char)?.numRequiredSomewhere !== undefined;

function numCharsThisWordDoNotMatchGuessRequirements(
  charOccurences: Map<string, CharOccurenceDetails>,
  charDetailsThisWord: Map<string, CharOccurenceDetails>
): boolean {
  if (charOccurences.size !== charDetailsThisWord.size) {
    return true;
  }

  for (const [char, thisWordCharOccurences] of charDetailsThisWord) {
    if (notEnoughOfCharOccurencesInWord(char, thisWordCharOccurences, charOccurences)) {
      return true;
    }
  }

  return false;
}

function notEnoughOfCharOccurencesInWord(
  char: string,
  targetWordCharOccurences: CharOccurenceDetails,
  charOccurences: Map<string, CharOccurenceDetails>
): boolean {
  const totalThisWord =
    targetWordCharOccurences.numCorrect + targetWordCharOccurences.numRequiredSomewhere;

  const charOccurencesRequiredByGuesses = charOccurences.get(char);
  const totalRequiredByGuesses = charOccurencesRequiredByGuesses?.minOccurences ?? 0;

  return (
    (charOccurencesRequiredByGuesses?.minOccurencesIsMax &&
      totalThisWord !== totalRequiredByGuesses) ||
    totalThisWord < totalRequiredByGuesses
  );
}
