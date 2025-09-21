export enum LetterCorrectness {
  NotPresent = "#3a3a3c",
  WrongPosition = "#b59f3b",
  Correct = "#538d4e",
}

export class Letter {
  value: string;
  correctness: LetterCorrectness;

  constructor(value: string, correctness: LetterCorrectness) {
    this.value = value;
    this.correctness = correctness;
  }

  cycleLetterCorrectness(): LetterCorrectness {
    if (this.correctness === LetterCorrectness.NotPresent) {
      this.correctness = LetterCorrectness.WrongPosition;
    } else if (this.correctness === LetterCorrectness.WrongPosition) {
      this.correctness = LetterCorrectness.Correct;
    } else {
      this.correctness = LetterCorrectness.NotPresent;
    }

    return this.correctness;
  }
}
