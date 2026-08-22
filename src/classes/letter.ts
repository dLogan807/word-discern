import { LetterCorrectness } from "@/enums/enums";

export class Letter {
  constructor(
    public readonly value: string,
    public readonly correctness: LetterCorrectness
  ) {}

  getNextLetterCorrectness(): LetterCorrectness {
    switch (this.correctness) {
      case LetterCorrectness.NotPresent:
        return LetterCorrectness.WrongPosition;
      case LetterCorrectness.WrongPosition:
        return LetterCorrectness.Correct;
      case LetterCorrectness.Correct:
        return LetterCorrectness.NotPresent;
    }
  }
}
