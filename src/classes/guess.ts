import { Letter, LetterCorrectness } from "./letter";
import { Word } from "./word";

export class Guess extends Word {
  letters: Letter[];

  constructor(wordString: string) {
    super(wordString);

    this.letters = [];
    for (const char of this.wordString) {
      const letter: Letter = new Letter(char, LetterCorrectness.NotPresent);
      this.letters.push(letter);
    }
  }
}
