import { Guess } from "@/classes/guess";
import { LetterCorrectness } from "@/classes/letter";
import { stringsAreEqual } from "@/utils/guessValidation";

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
    const validCharOccurences = new Map<string, number>();

    for (let i = 0; i < guess.letters.length; i++) {
      const char = guess.letters[i];

      //Cound how many times the char is correct or in the wrong position
      if (char.correctness !== LetterCorrectness.NotPresent) {
        const validOccurenceCount = validCharOccurences.get(char.value);
        validCharOccurences.set(
          char.value,
          validOccurenceCount ? validOccurenceCount + 1 : 1
        );
      }

      parseResult.blackListedPosChars[i] =
        parseResult.blackListedPosChars[i] ?? new Set<string>();

      if (char.correctness === LetterCorrectness.Correct) {
        parseResult.correctPosChars[i] = char.value;

        parseResult.blackListedPosChars[i].delete(char.value);
        continue;
      }

      //Blacklist chars from applicable indexes
      if (canBlacklistLetter(parseResult.correctPosChars[i], char.value)) {
        if (char.correctness === LetterCorrectness.WrongPosition) {
          parseResult.blackListedPosChars[i].add(char.value);
          parseResult.requiredSomewhereChars.add(char.value);
        } else if (!validCharOccurences.get(char.value)) {
          for (let j = 0; j < guess.letters.length; j++) {
            parseResult.blackListedPosChars[j] =
              parseResult.blackListedPosChars[j] ?? new Set<string>();
            parseResult.blackListedPosChars[j].add(char.value);
          }
        }
      }
    }
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

//Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
