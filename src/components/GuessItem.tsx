import React from "react";
import RemoveButton from "./RemoveButton";
import LetterButton from "./LetterButton";
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
        <LetterButton key={idx} letter={letter} />
      ))}
      <RemoveButton guess={guess} />
    </Group>
  );
}
