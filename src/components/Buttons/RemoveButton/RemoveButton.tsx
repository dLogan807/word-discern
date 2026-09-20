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

  const id = `${guess.wordString}RemoveButton`;

  return (
    <ActionIcon
      id={id}
      variant="light"
      color="red"
      aria-label={`Remove '${guess.wordString}' from guesses`}
      onClick={() => removeGuess(guess)}
      classNames={{
        root: classes.remove_button,
      }}
    >
      <IconTrash aria-labelledby={id} />
    </ActionIcon>
  );
}
