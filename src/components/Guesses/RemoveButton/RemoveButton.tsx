import { ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { Guess } from "@/classes/guess";
import { useGuessContext } from "@/hooks/useGuessContext";
import classes from "./RemoveButton.module.css";

type RemoveButtonProps = {
  guess: Guess;
};

export default function RemoveButton({ guess }: RemoveButtonProps) {
  const { removeGuess } = useGuessContext();

  return (
    <ActionIcon
      variant="light"
      color="red"
      aria-label="Remove"
      onClick={() => removeGuess(guess)}
      classNames={{
        root: classes.remove_button,
      }}
    >
      <IconTrash />
    </ActionIcon>
  );
}
