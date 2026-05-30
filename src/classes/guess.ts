import { Letter } from "@/classes/letter";
import { LetterCorrectness } from "@/enums/enums";

export class Guess {
  letters: Letter[];
  wordString: string;

  constructor(wordString: string) {
    this.wordString = wordString;

    this.letters = [];
    for (const char of this.wordString) {
      const letter: Letter = new Letter(char, LetterCorrectness.NotPresent);
      this.letters.push(letter);
    }
  }
}
