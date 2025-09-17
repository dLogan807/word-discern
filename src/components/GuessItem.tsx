import React from "react";
import "./GuessItem.css";
import { Guess } from "../App";
import RemoveButton from "./RemoveButton";
import LetterButton from "./LetterButton";

export default function GuessItem({
  guess,
  clickLetterAction,
  removeAction,
}: {
  guess: Guess;
  clickLetterAction: any;
  removeAction: () => void;
}): React.ReactElement {
  return (
    <li className="guess_item">
      {guess.letters.map((letter, idx) => (
        <LetterButton
          key={idx}
          letter={letter}
          clickAction={() => clickLetterAction(letter)}
        />
      ))}
      <RemoveButton clickAction={() => removeAction()} />
    </li>
  );
}
