import {
  Box,
  Button,
  Checkbox,
  Fieldset,
  Group,
  JsonInput,
  SegmentedControl,
  Stack,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { parse, ParseError, printParseErrorCode } from "jsonc-parser";
import { useState } from "react";
import FileUploadModal from "@/components/Modals/FileUploadModal/FileUploadModal";
import { WordInput } from "@/enums/enums";
import { useSettingsContext } from "@/hooks/useSettingsContext";
import { getWordArray } from "@/utils/wordLoading";
import ResetTextFieldActionIcon from "../../Buttons/ResetTextFieldActionIcon/ResetTextFieldActionIcon";
import { CodeBlocks } from "./CodeBlocks/CodeBlocks";
import classes from "./CustomWords.module.css";

const VALID_CODE_SEPARATORS: string[] = [",", "space", "newline", ";"];

type CustomWordsFormValues = {
  text: string;
  json: string;
  allowSpecialChars: boolean;
  replaceDefaultWords: boolean;
};

export type CustomWordsFormData = Omit<CustomWordsFormValues, "file"> & {
  lastUpdatedWithInputMode: WordInput;
  words: string[];
};

function validateJSON(value: string | undefined): string | null {
  if (value == null || value.length === 0) return null;

  const errors: ParseError[] = [];
  const parsed = parse(value, errors, {
    allowTrailingComma: false,
    disallowComments: true,
  });

  if (errors.length > 0) {
    const error = errors[0];
    return `Invalid JSON: ${printParseErrorCode(error.error)} at offset ${error.offset}`;
  }
  if (!Array.isArray(parsed)) return "Not a JSON array";

  return null;
}

export default function CustomWordsForm() {
  const { customWordsFormData, setCustomWordsFormData } = useSettingsContext();
  const [inputMode, setInputMode] = useState<WordInput>(
    customWordsFormData.lastUpdatedWithInputMode
  );
  const [modalOpened, { open, close }] = useDisclosure(false);

  const initialFormValues: CustomWordsFormValues = {
    text: customWordsFormData.text,
    json: customWordsFormData.json,
    allowSpecialChars: customWordsFormData.allowSpecialChars,
    replaceDefaultWords: customWordsFormData.replaceDefaultWords,
  };

  const form = useForm<CustomWordsFormValues>({
    mode: "uncontrolled",
    initialValues: initialFormValues,
  });

  async function onSubmit() {
    const formValues = form.getValues();
    let words: string[] = [];
    let error: string | null = null;

    if (inputMode === WordInput.TEXT) {
      words = getWordArray(formValues.text);
    } else {
      error = validateJSON(formValues.json);

      if (!error) {
        words = JSON.parse(formValues.json);
      }
    }

    form.setFieldError(inputMode, error);
    if (error) return;

    const newData: CustomWordsFormData = {
      words: words,
      allowSpecialChars: formValues.allowSpecialChars,
      replaceDefaultWords: formValues.replaceDefaultWords,
      lastUpdatedWithInputMode: inputMode,
      text: formValues.text,
      json: formValues.json,
    };

    setCustomWordsFormData(newData);
  }

  function resetCurrentField() {
    form.setFieldError(inputMode, null);
    form.setFieldValue(inputMode, "");
  }

  const hiddenInputClass = (inputType: WordInput) => {
    return inputMode === inputType ? undefined : classes.hidden_input;
  };

  async function onFileUpload(file: File) {
    const fileText = await file.text();

    if (file.type === "application/json") {
      setInputMode(WordInput.JSON);
      form.setFieldValue("json", fileText);
    } else {
      setInputMode(WordInput.TEXT);
      form.setFieldValue("text", fileText);
    }
  }

  return (
    <Stack>
      <FileUploadModal opened={modalOpened} close={close} submit={onFileUpload} />
      <Fieldset classNames={{ root: classes.form_fieldset }}>
        <Box className={classes.text_controls_box}>
          <Fieldset variant="filled" classNames={{ root: classes.text_controls_fieldset }}>
            <SegmentedControl
              value={inputMode}
              onChange={(value) => setInputMode(value as WordInput)}
              data={[
                { label: "Text", value: WordInput.TEXT },
                { label: "JSON", value: WordInput.JSON },
              ]}
            />
            <Button
              variant="default"
              onClick={open}
              classNames={{ root: classes.upload_file_button }}
            >
              Upload
            </Button>
          </Fieldset>
        </Box>
        <form>
          <Stack gap="xs">
            <Textarea
              classNames={{
                root: hiddenInputClass(WordInput.TEXT),
              }}
              key={form.key("text")}
              {...form.getInputProps("text")}
              aria-label="Your plaintext list of words"
              description={
                <CodeBlocks preface="Separators accepted: " values={VALID_CODE_SEPARATORS} />
              }
              placeholder="a,list,of,words"
              autosize
              minRows={4}
              maxRows={10}
              rightSection={<ResetTextFieldActionIcon reset={resetCurrentField} />}
              rightSectionWidth={0}
            />
            <JsonInput
              classNames={{ root: hiddenInputClass(WordInput.JSON) }}
              key={form.key("json")}
              {...form.getInputProps("json")}
              aria-label="Your JSON array of words"
              placeholder='["a","list","of","words"]'
              validationError={validateJSON(form.getValues().json)}
              rightSection={<ResetTextFieldActionIcon reset={resetCurrentField} />}
              formatOnBlur
              autosize
              minRows={4}
              maxRows={10}
            />

            <Checkbox
              key={form.key("allowSpecialChars")}
              {...form.getInputProps("allowSpecialChars", { type: "checkbox" })}
              label="Allow special characters"
            />
            <Checkbox
              key={form.key("replaceDefaultWords")}
              {...form.getInputProps("replaceDefaultWords", { type: "checkbox" })}
              label="Replace default word list"
            />
          </Stack>
          <Group classNames={{ root: classes.submit_button }}>
            <Button
              type="submit"
              onClick={(event) => {
                event.preventDefault();
                onSubmit();
              }}
            >
              Update word list
            </Button>
          </Group>
        </form>
      </Fieldset>
    </Stack>
  );
}
