import { Group } from "@mantine/core";
import React from "react";
import { Guess } from "@/classes/guess";
import LetterButton from "@/components/Guesses/LetterButton/LetterButton";
import RemoveButton from "@/components/Guesses/RemoveButton/RemoveButton";

export default function GuessItem({ guess }: { guess: Guess }): React.ReactElement {
  return (
    <Group>
      {guess.letters.map((letter, idx) => (
        <LetterButton key={idx} letter={letter} guess={guess} />
      ))}
      <RemoveButton guess={guess} />
    </Group>
  );
}
