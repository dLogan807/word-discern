export interface ParsedWordSets {
  succeeded: string[];
  failed: string[];
  wordSets: Map<number, Set<string>>;
}

export function parseWordsToSets(
  words: string[],
  specialCharsAllowed: boolean
): ParsedWordSets {
  const wordSets = new Map<number, Set<string>>();
  const succeeded: string[] = [];
  const failed: string[] = [];

  for (let word of words) {
    word = word.trim();

    if (isValidWord(word, specialCharsAllowed)) {
      if (!wordSets.has(word.length)) {
        wordSets.set(word.length, new Set<string>());
      }

      wordSets.get(word.length)?.add(word);
      succeeded.push(word);
    } else {
      failed.push(word);
    }
  }

  if (failed.length > 0) {
    console.warn(`Failed to load ${failed.length} words: ${failed}`);
  }

  return { wordSets: wordSets, failed: failed, succeeded: succeeded };
}

function isValidWord(word: string, specialCharsAllowed: boolean): boolean {
  const stringValid: boolean = word !== null && word !== "";

  return stringValid && (specialCharsAllowed || containsOnlyLetters(word));
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
