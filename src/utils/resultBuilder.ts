import { Guess } from "@/classes/guess";
import { LetterCorrectness } from "@/classes/letter";
import { stringsAreEqual } from "@/utils/guessValidation";

export interface IResults {
  words: string[];
  revealedCharPositions: boolean[];
}

export default function getResults(
  wordSet: Set<string>,
  guesses: Guess[],
  shuffled?: boolean
): IResults {
  const parseResult = parseGuesses(guesses);
  const results = matchGuessesWithWords(wordSet, parseResult);

  shuffled ? shuffleArray(results) : results.sort();

  const revealedCharPositions = parseResult.correctPosChars.map(
    (char) => char !== undefined
  );

  return {
    words: results,
    revealedCharPositions: revealedCharPositions,
  };
}

interface ParsedGuesses {
  // Char that must be preset for a given index
  correctPosChars: string[];
  // Set of blacklisted chars for each index
  blackListedPosChars: Array<Set<string>>;
  // Set of chars that must be in the word somewhere
  requiredSomewhereChars: Set<string>;
}

function parseGuesses(guesses: Guess[]): ParsedGuesses {
  const guessLength = guesses[0].wordString.length;
  const parseResult: ParsedGuesses = {
    correctPosChars: new Array(guessLength),
    blackListedPosChars: Array.from(
      { length: guessLength },
      () => new Set<string>()
    ),
    requiredSomewhereChars: new Set<string>(),
  };

  for (const guess of guesses) {
    const validCharOccurences = new Map<string, number>();

    for (let i = 0; i < guess.letters.length; i++) {
      const char = guess.letters[i];

      // Count how many times the char is correct or in the wrong position
      if (char.correctness !== LetterCorrectness.NotPresent) {
        validCharOccurences.set(
          char.value,
          (validCharOccurences.get(char.value) ?? 0) + 1
        );
      }

      if (char.correctness === LetterCorrectness.Correct) {
        parseResult.correctPosChars[i] = char.value;
        parseResult.blackListedPosChars[i].delete(char.value);
        continue;
      }

      // Blacklist chars from applicable indexes
      const correctLetter = parseResult.correctPosChars[i];
      if (correctLetter === undefined || correctLetter !== char.value) {
        if (char.correctness === LetterCorrectness.WrongPosition) {
          parseResult.blackListedPosChars[i].add(char.value);
          parseResult.requiredSomewhereChars.add(char.value);
        } else if (!validCharOccurences.has(char.value)) {
          for (let j = 0; j < guess.letters.length; j++) {
            parseResult.blackListedPosChars[j].add(char.value);
          }
        }
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

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
