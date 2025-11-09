export interface ParsedWordSets {
  failed: string[];
  wordNum: number;
  wordSets: Map<number, Set<string>>;
}

export function parseWordsToSets(
  words: string[],
  specialCharsAllowed: boolean
): ParsedWordSets {
  const wordSets = new Map<number, Set<string>>();
  const succeeded = new Set<string>();
  const failed: string[] = [];

  for (let word of words) {
    if (typeof word === "string") {
      word = word.trim();
    }

    if (isValidWord(word, specialCharsAllowed)) {
      if (!wordSets.has(word.length)) {
        wordSets.set(word.length, new Set<string>());
      }

      wordSets.get(word.length)?.add(word);
      succeeded.add(word);
    } else {
      failed.push(word);
    }
  }

  if (failed.length > 0) {
    console.warn(`Failed to load ${failed.length} words: ${failed}`);
  }

  return {
    wordSets: wordSets,
    wordNum: succeeded.size,
    failed: failed,
  };
}

function isValidWord(word: string, specialCharsAllowed: boolean): boolean {
  return (
    word !== null &&
    word !== "" &&
    (specialCharsAllowed || containsOnlyLetters(word))
  );
}

function containsOnlyLetters(word: string): boolean {
  const allLettersRegex: RegExp = /^[a-zA-Z]+$/;

  return allLettersRegex.test(word);
}

export function getWordArray(text: string): string[] {
  let words: string[] = [];

  if (!text || text.length == 0) return words;

  const splitRegex: RegExp = /;|,| |\n/;
  words = text
    .split(splitRegex)
    .map((word) => word.trim())
    .filter((word) => word.length > 0);

  return words;
}
