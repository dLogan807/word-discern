import React from "react";
import RemoveButton from "./RemoveButton/RemoveButton";
import LetterButton from "./LetterButton/LetterButton";
import { Guess } from "../classes/guess";
import { Group } from "@mantine/core";

export default function GuessItem({
  guess,
}: {
  guess: Guess;
}): React.ReactElement {
  return (
    <Group>
      {guess.letters.map((letter, idx) => (
        <LetterButton key={idx} letter={letter} guess={guess} />
      ))}
      <RemoveButton guess={guess} />
    </Group>
  );
}
