import { ActionIcon } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import classes from "./ResetTextFieldActionIcon.module.css";

type ResetTextFieldActionIconProps = {
  reset: () => void;
};

export default function ResetTextFieldActionIcon({ reset }: ResetTextFieldActionIconProps) {
  return (
    <ActionIcon
      variant="transparent"
      classNames={{ root: classes.reset_action_icon }}
      onClick={reset}
      color="red"
    >
      <IconX />
    </ActionIcon>
  );
}
