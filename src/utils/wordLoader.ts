import { sortedWords } from "../assets/words";

export function getDefaultWordSets(): Map<number, Set<string>> {
  return parseWordsToSets(sortedWords);
}

function parseWordsToSets(words: string[]): Map<number, Set<string>> {
  const wordSets = new Map<number, Set<string>>();
  const failedParseWords: string[] = [];

  for (let word of words) {
    word = word.trim();

    if (word && containsOnlyLetters(word)) {
      if (!wordSets.has(word.length)) {
        wordSets.set(word.length, new Set<string>());
      }

      wordSets.get(word.length)?.add(word);
    } else {
      failedParseWords.push(word);
    }
  }

  if (failedParseWords.length > 0) {
    console.warn(
      `Failed to load ${failedParseWords.length} words: ${failedParseWords}`
    );
  }

  return wordSets;
}

function containsOnlyLetters(word: string): boolean {
  const allLettersRegex: RegExp = /^[a-zA-Z]+$/;

  return allLettersRegex.test(word);
}

async function loadLocalTextFiles(
  filePaths: string[]
): Promise<Map<number, Set<string>>> {
  let allFilesWords: string[] = [];

  await Promise.all(
    filePaths.map(async (filePath: string) => {
      const file: string = (await import(`${filePath}?raw`)).default;
      const splitRegex: RegExp = /;|,| |\n/;
      const words: string[] = file.split(splitRegex);
      allFilesWords = [...allFilesWords, ...words];
    })
  );

  return parseWordsToSets(allFilesWords);
}

function printWords(wordSets: Map<number, Set<string>>) {
  console.log("--- Loaded Word Sets ---");
  wordSets.forEach((value, key) => {
    const wordStrings: string[] = [];

    for (const word of value) {
      wordStrings.push(word);
    }
    console.log(`${wordStrings.length} words of length ${key}:`);
    console.log(JSON.stringify(wordStrings));
  });
}
