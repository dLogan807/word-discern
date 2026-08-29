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

type RequiredChar = {
  minCorrect?: number;
  minRequiredSomewhere?: number;
  minOccurences?: number;
  minOccurencesIsMax?: boolean;
};

type IncrementableRequiredCharFields = Pick<
  RequiredChar,
  "minCorrect" | "minRequiredSomewhere" | "minOccurences"
>;

type TargetWordSpecs = {
  // Represents each character of the word
  wordIndexes: TargetWordIndex[];
  // Characters that must appear *somewhere*
  charsRequired: Map<string, RequiredChar>;
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

function getTargetWordSpecs(guesses: Guess[]): TargetWordSpecs {
  const guessLength = guesses[0].wordString.length;

  const wordIndexes: TargetWordIndex[] = Array.from({ length: guessLength }, () => ({}));
  const charsRequired = new Map<string, RequiredChar>();
  const charsToBlacklistAcrossIndexes = new Set<string>();

  for (const guess of guesses) {
    const charsRequiredThisGuess = new Map<string, RequiredChar>();
    const charsBlacklistedThisGuess = new Set<string>();

    for (let i = 0; i < guess.letters.length; i++) {
      const char = guess.letters[i];

      if (char.correctness === LetterCorrectness.Correct) {
        wordIndexes[i].correctChar = char.value;
        wordIndexes[i].blackListedChars = undefined;

        incrementMinCorrect(charsRequiredThisGuess, char.value);
        continue;
      }

      // Blacklist chars from applicable indexes
      const correctChar = wordIndexes[i].correctChar;
      if (correctChar === undefined || correctChar !== char.value) {
        if (char.correctness === LetterCorrectness.WrongPosition) {
          getIndexBlackListedChars(wordIndexes[i]).add(char.value);
          charsToBlacklistAcrossIndexes.delete(char.value);

          incrementMinRequiredSomewhere(charsRequiredThisGuess, char.value);
        } else if (char.correctness === LetterCorrectness.NotPresent) {
          if (wordIndexes[i].correctChar !== undefined) continue;

          getIndexBlackListedChars(wordIndexes[i]).add(char.value);

          const shouldBlackListEverywhere = !charsRequired.get(char.value)?.minRequiredSomewhere;
          if (shouldBlackListEverywhere) {
            charsToBlacklistAcrossIndexes.add(char.value);
          }

          charsBlacklistedThisGuess.add(char.value);
        }
      }
    }

    updateRequiredChars(charsRequired, charsBlacklistedThisGuess, charsRequiredThisGuess);
  }

  blacklistCharFromAllIncorrectIndexes(wordIndexes, charsToBlacklistAcrossIndexes);

  const targetWordSpecs: TargetWordSpecs = {
    wordIndexes: wordIndexes,
    charsRequired: charsRequired,
  };

  inferAndUpdateCorrectPosChars(targetWordSpecs);

  return targetWordSpecs;
}

function getPossibleWords(
  wordSet: Set<string>,
  { wordIndexes, charsRequired }: TargetWordSpecs
): string[] {
  const possibleWords: string[] = [];

  for (const word of wordSet) {
    const charDetailsThisWord = new Map<string, RequiredChar>();
    let isInvalidWord = false;

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const correctChar = wordIndexes[i].correctChar;
      const correctCharDoesNotMatch = correctChar !== undefined && correctChar !== char;

      if (
        correctCharDoesNotMatch ||
        charAtBlackListedIndex(wordIndexes[i].blackListedChars, char)
      ) {
        isInvalidWord = true;
        break;
      }

      const correctCharMatches = correctChar !== undefined && correctChar === char;
      if (correctCharMatches) {
        incrementMinCorrect(charDetailsThisWord, char);
        continue;
      }

      const charIsRequiredSomewhere = charsRequired.get(char)?.minRequiredSomewhere !== undefined;
      if (charIsRequiredSomewhere) {
        incrementMinRequiredSomewhere(charDetailsThisWord, char);
      }
    }

    if (isInvalidWord) continue;

    if (charsRequired.size !== charDetailsThisWord.size) continue;

    for (const [char, thisWordRequiredChar] of charDetailsThisWord) {
      const correctThisWord = thisWordRequiredChar.minCorrect ?? 0;
      const requiredSomewhereThisWord = thisWordRequiredChar.minRequiredSomewhere ?? 0;
      const totalThisWord = correctThisWord + requiredSomewhereThisWord;

      const requiredCharDetails = charsRequired.get(char);
      const totalRequired = requiredCharDetails?.minOccurences ?? 0;

      if (requiredCharDetails?.minOccurencesIsMax && totalThisWord !== totalRequired) {
        isInvalidWord = true;
        break;
      }

      if (totalThisWord < totalRequired) {
        isInvalidWord = true;
      }
    }

    if (isInvalidWord) continue;

    possibleWords.push(word);
  }

  return possibleWords;
}

const incrementMinCorrect = (charsRequired: Map<string, RequiredChar>, char: string) =>
  incrementFieldAmount(charsRequired, char, "minCorrect", 1);

const incrementMinRequiredSomewhere = (charsRequired: Map<string, RequiredChar>, char: string) =>
  incrementFieldAmount(charsRequired, char, "minRequiredSomewhere", 1);

function incrementFieldAmount(
  charsRequired: Map<string, RequiredChar>,
  char: string,
  field: keyof IncrementableRequiredCharFields,
  amount: number
) {
  const currentValue = charsRequired.get(char)?.[field] ?? 0;

  setFieldValue(charsRequired, char, field, currentValue + amount);
}

function setFieldValue(
  charsRequired: Map<string, RequiredChar>,
  char: string,
  field: keyof IncrementableRequiredCharFields,
  value: number
) {
  const requiredChar = charsRequired.get(char);

  charsRequired.set(char, {
    ...requiredChar,
    [field]: value,
  });
}

const getIndexBlackListedChars = (wordIndex: TargetWordIndex): Set<string> =>
  (wordIndex.blackListedChars ??= new Set<string>());

// Update the number of each character required
function updateRequiredChars(
  charsRequired: Map<string, RequiredChar>,
  charsBlacklistedThisGuess: Set<string>,
  charsRequiredThisGuess: Map<string, RequiredChar>
) {
  for (const [char, guessDetails] of charsRequiredThisGuess) {
    const currentDetails = charsRequired.get(char);

    const guessMinCorrect = guessDetails.minCorrect ?? 0;
    const guessMinRequiredSomewhere = guessDetails.minRequiredSomewhere ?? 0;
    const guessTotal = guessMinCorrect + guessMinRequiredSomewhere;

    // If max char occurences is known and the new known correct number isn't more informative, then skip the update
    if (
      currentDetails?.minOccurencesIsMax &&
      (guessTotal > (currentDetails?.minOccurences ?? 0) ||
        (currentDetails.minCorrect ?? 0) >= guessMinCorrect)
    ) {
      continue;
    }

    charsRequired.set(char, {
      minCorrect: guessMinCorrect,
      minRequiredSomewhere: guessMinRequiredSomewhere,
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

// If a char is wrong at every position except one, set it as correct at that index
function inferAndUpdateCorrectPosChars({ wordIndexes, charsRequired }: TargetWordSpecs) {
  // todo: update to handle for multiple required
  // if (chars required at an unknown position = number of positions left, then those chars must belong in the free positions)
  for (const [char, _] of charsRequired) {
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

function charAtBlackListedIndex(
  blackListedCharArray: Set<string> | undefined,
  charToCompare: string
): boolean {
  return blackListedCharArray?.has(charToCompare) ?? false;
}
