import { ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useContext } from "react";
import { Guess } from "@/classes/guess";
import { GuessContext } from "@/components/Guesses/GuessInputList/GuessInputList";
import classes from "./RemoveButton.module.css";

type RemoveButtonProps = {
  guess: Guess;
};

export default function RemoveButton({ guess }: RemoveButtonProps) {
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
