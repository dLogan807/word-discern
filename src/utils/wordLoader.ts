export function parseWordsToSets(
  words: string[],
  onlyLettersAllowed: boolean
): Map<number, Set<string>> {
  const wordSets = new Map<number, Set<string>>();
  const invalidWords: string[] = [];

  for (let word of words) {
    word = word.trim();

    if (isValidWord(word, onlyLettersAllowed)) {
      if (!wordSets.has(word.length)) {
        wordSets.set(word.length, new Set<string>());
      }

      wordSets.get(word.length)?.add(word);
    } else {
      invalidWords.push(word);
    }
  }

  if (invalidWords.length > 0) {
    console.warn(
      `Failed to load ${invalidWords.length} words: ${invalidWords}`
    );
  }

  return wordSets;
}

function isValidWord(word: string, onlyLettersAllowed: boolean): boolean {
  const stringValid: boolean = word !== null && word !== "";

  return stringValid && (!onlyLettersAllowed || containsOnlyLetters(word));
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

  return parseWordsToSets(allFilesWords, true);
}

function printWordSets(wordSets: Map<number, Set<string>>) {
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
