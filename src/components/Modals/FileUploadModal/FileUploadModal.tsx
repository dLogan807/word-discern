import { Modal, Button, FileInput } from "@mantine/core";
import { useField } from "@mantine/form";
import { IconFileUpload } from "@tabler/icons-react";
import { CodeBlocks } from "@/components/Settings/CustomWordsForm/CodeBlocks/CodeBlocks";
import { useSettingsContext } from "@/hooks/useSettingsContext";
import classes from "./FileUploadModal.module.css";

type FileInputModalProps = {
  opened: boolean;
  close: () => void;
  submit: (value: File) => void;
};

function validateFileUpload(value: File | undefined): string | null {
  if (!value) return "Please select a file";

  if (value.type === "application/json" || value.type === "text/plain") {
    return null;
  }

  return "Unsupported file type";
}

function getUploadButtonText(value: File | undefined): string {
  if (!value || (value.type !== "application/json" && value.type !== "text/plain")) {
    return "Upload";
  }

  if (value.type === "application/json") {
    return "Upload JSON";
  }

  return "Upload Text";
}

export default function FileUploadModal({ opened, close, submit }: FileInputModalProps) {
  const { doAnimations } = useSettingsContext();
  const field = useField<File | undefined>({
    initialValue: undefined,
    validate: (value) => validateFileUpload(value),
    validateOnChange: true,
  });

  const fieldValue = field.getValue();
  const canSubmit = fieldValue !== undefined && field.error === null;

  function onClose() {
    close();
    field.reset();
  }

  function onSubmit() {
    if (canSubmit) {
      submit(fieldValue);
      onClose();
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Word list file upload"
      classNames={{
        body: classes.modal_body,
      }}
      closeButtonProps={{ "aria-label": "Close word list upload modal" }}
      transitionProps={doAnimations ? undefined : { duration: 0 }}
      centered
    >
      <FileInput
        {...field.getInputProps()}
        aria-label="Upload word list file"
        description={<CodeBlocks preface="Accepts: " values={[".txt", ".json"]} />}
        placeholder="Select file"
        leftSection={<IconFileUpload />}
        accept="text/plain,application/json"
        clearable
      />
      <Button onClick={onSubmit} disabled={!canSubmit}>
        {getUploadButtonText(fieldValue)}
      </Button>
    </Modal>
  );
}
