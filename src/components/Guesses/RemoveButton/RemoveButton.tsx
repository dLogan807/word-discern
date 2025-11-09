import React, { useContext } from "react";
import { IconTrash } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";
import { Guess } from "@/classes/guess";
import { GuessContext } from "@/components/Guesses/GuessInputList/GuessInputList";
import classes from "./RemoveButton.module.css";

export default function RemoveButton({
  guess,
}: {
  guess: Guess;
}): React.ReactElement {
  const removeGuess = useContext(GuessContext);

  return (
    <ActionIcon
      variant="light"
      color="red"
      aria-label="Remove"
      onClick={() => removeGuess.removeGuess(guess)}
      classNames={{
        root: classes.remove_button,
      }}
    >
      <IconTrash />
    </ActionIcon>
  );
}
