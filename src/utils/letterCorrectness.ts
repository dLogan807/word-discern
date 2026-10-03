import { LetterCorrectness } from "@/enums/enums";

export function getTextualLetterCorrectness(correctness: LetterCorrectness) {
  switch (correctness) {
    case LetterCorrectness.NotPresent:
      return "not present";
    case LetterCorrectness.WrongPosition:
      return "wrong position";
    case LetterCorrectness.Correct:
      return "correct";
  }
}
