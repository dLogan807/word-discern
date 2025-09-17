import React from "react";
import "./RemoveButton.css";
import { IconTrash } from "@tabler/icons-react";

export default function RemoveButton({
  clickAction,
}: {
  clickAction: () => void;
}): React.ReactElement {
  return (
    <button className="remove_button" onClick={() => clickAction()}>
      <IconTrash />
    </button>
  );
}
