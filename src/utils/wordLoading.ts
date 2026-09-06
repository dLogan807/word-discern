export interface ParsedWordSets {
  wordNum: number;
  wordSets: Map<number, Set<string>>;
  failed: Set<string>;
  duplicates: Set<string>;
}

const IS_ONLY_LETTERS_REGEX: RegExp = /^[a-zA-Z]+$/;
const WORD_SPLIT_REGEX: RegExp = /;|,| |\n/;

export function parseWordsToSets(words: string[], specialCharsAllowed: boolean): ParsedWordSets {
  const wordSets = new Map<number, Set<string>>();
  const succeeded = new Set<string>();
  const duplicates = new Set<string>();
  const failed = new Set<string>();

  for (let word of words) {
    if (typeof word === "string") {
      word = word.trim().toLocaleLowerCase();
    }

    if (isValidWord(word, specialCharsAllowed)) {
      if (!wordSets.has(word.length)) {
        wordSets.set(word.length, new Set<string>());
      }

      const wordSetOfThisLength = wordSets.get(word.length);
      if (wordSetOfThisLength?.has(word)) {
        duplicates.add(word);
      } else {
        wordSetOfThisLength?.add(word);
      }

      succeeded.add(word);
    } else {
      failed.add(word);
    }
  }

  return {
    wordSets: wordSets,
    wordNum: succeeded.size,
    failed: failed,
    duplicates: duplicates,
  };
}

function isValidWord(word: string, specialCharsAllowed: boolean): boolean {
  return (
    typeof word === "string" &&
    word.length > 0 &&
    (specialCharsAllowed || IS_ONLY_LETTERS_REGEX.test(word))
  );
}

export function getWordArray(text: string): string[] {
  let words: string[] = [];

  if (!text) return words;

  words = text
    .split(WORD_SPLIT_REGEX)
    .map((word) => word.trim())
    .filter((word) => word.length > 0);

  return words;
}
