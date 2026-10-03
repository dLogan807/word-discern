import { ActionIcon } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { WordInput } from "@/enums/enums";
import classes from "./ResetTextFieldActionIcon.module.css";

type ResetTextFieldActionIconProps = {
  reset: () => void;
  fieldInputMode: WordInput;
};

export default function ResetTextFieldActionIcon({
  reset,
  fieldInputMode,
}: ResetTextFieldActionIconProps) {
  return (
    <ActionIcon
      variant="transparent"
      classNames={{ root: classes.reset_action_icon }}
      onClick={reset}
      aria-label={`Clear custom words ${fieldInputMode} input`}
      color="red"
    >
      <IconX aria-hidden="true" />
    </ActionIcon>
  );
}
