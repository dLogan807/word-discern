import { Letter } from "@/classes/letter";
import { LetterCorrectness } from "@/enums/enums";

export class Guess {
  letters: Letter[];
  wordString: string;

  constructor(wordString: string, initialCorrectnessValues?: LetterCorrectness[]) {
    this.wordString = wordString;

    this.letters = [];
    for (let i = 0; i < wordString.length; i++) {
      const char = wordString[i];
      const letter = new Letter(
        char,
        initialCorrectnessValues?.[i] ?? LetterCorrectness.NotPresent
      );
      this.letters.push(letter);
    }
  }
}
