export class Word {
  readonly wordString: string;

  constructor(wordString: string) {
    this.wordString = wordString;
  }

  //0 if equal, -1 if otherWord <, 1 if otherWord greater than
  compare(otherWord: Word): number {
    return otherWord.wordString.localeCompare(this.wordString);
  }
}
