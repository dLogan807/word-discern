import {
  Button,
  Checkbox,
  Code,
  FileInput,
  Group,
  JsonInput,
  SegmentedControl,
  Stack,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { parse, ParseError, printParseErrorCode } from "jsonc-parser";
import { getWordArray } from "@/utils/wordLoading";
import { useContext, useState } from "react";
import { IconFileUpload } from "@tabler/icons-react";
import { CustomWordsFormContext } from "@/App";
import classes from "./CustomWords.module.css";

enum WordInput {
  TEXT = "text",
  JSON = "json",
  FILE = "file",
}

const VALID_CODE_SEPARATORS: string[] = [",", "space", "newline", ";"];
const VALID_FILE_TYPES: string[] = [".txt", ".json"];

function SpacedCodeBlocks({
  preface,
  values,
}: {
  preface: string;
  values: string[];
}) {
  return (
    <>
      {preface}
      {values.map((value, i) => (
        <span key={value}>
          <Code>{value}</Code>
          {i < values.length - 1 && " "}
        </span>
      ))}
    </>
  );
}

export interface CustomWordsFormData {
  words: string[];
  allowSpecialChars: boolean;
  replaceDefaultWords: boolean;
}

export const DEFAULT_CUSTOM_WORDS_FORM: CustomWordsFormData = {
  words: [],
  allowSpecialChars: false,
  replaceDefaultWords: false,
};

export default function CustomWordsForm() {
  const updateFormData = useContext(CustomWordsFormContext);
  const [inputMode, setInputMode] = useState<WordInput>(WordInput.TEXT);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      text: "",
      json: "",
      file: null,
      allowSpecialChars: DEFAULT_CUSTOM_WORDS_FORM.allowSpecialChars,
      replaceDefaultWords: DEFAULT_CUSTOM_WORDS_FORM.replaceDefaultWords,
    },
  });

  function validateJSON(value: string): string | null {
    if (inputMode == WordInput.TEXT || value == null || value.length == 0)
      return null;

    const errors: ParseError[] = [];
    const parsed = parse(value, errors, {
      allowTrailingComma: false,
      disallowComments: true,
    });

    if (errors.length > 0) {
      const error = errors[0];
      return `Invalid JSON: ${printParseErrorCode(error.error)} at offset ${
        error.offset
      }`;
    }
    if (!Array.isArray(parsed)) return "Not a JSON array";

    return null;
  }

  async function validateFile(file: File | null): Promise<string | null> {
    if (inputMode != WordInput.FILE || file == null) return null;

    if (file.type === "application/json") {
      return validateJSON(await file.text());
    } else if (file.type == "text/plain") {
      return null;
    } else {
      return "Unsupported file type";
    }
  }

  async function onSubmit() {
    const formValues = form.getValues();
    let words: string[] = [];
    let error: string | null = null;

    if (inputMode == WordInput.TEXT) {
      words = getWordArray(formValues.text);
    } else if (inputMode == WordInput.JSON) {
      error = validateJSON(formValues.json);

      if (formValues.json && !error) {
        words = JSON.parse(formValues.json);
      }
    } else {
      error = await validateFile(formValues.file);

      if (formValues.file != null && !error) {
        const fileType = (formValues.file as File).type;
        const text = await (formValues.file as File).text();
        if (fileType === "application/json") {
          words = JSON.parse(text);
        } else {
          words = getWordArray(text);
        }
      }
    }

    form.setFieldError(inputMode, error);
    if (error) return;

    updateFormData({
      words: words,
      allowSpecialChars: formValues.allowSpecialChars,
      replaceDefaultWords: formValues.replaceDefaultWords,
    });
  }

  function resetCurrentField() {
    form.resetField(inputMode);
    form.clearFieldError(inputMode);
  }

  const hiddenInputClass = (inputType: WordInput) => {
    return inputMode == inputType
      ? {}
      : {
          root: classes.hidden_input,
        };
  };
  const fileIcon = <IconFileUpload />;

  return (
    <Stack>
      <Group>
        <SegmentedControl
          value={inputMode}
          onChange={(value) => setInputMode(value as WordInput)}
          data={[
            { label: "Text", value: WordInput.TEXT },
            { label: "JSON", value: WordInput.JSON },
            { label: "File upload", value: WordInput.FILE },
          ]}
        />
        <Button
          variant="light"
          color="red"
          onClick={() => {
            resetCurrentField();
          }}
        >
          Clear Field
        </Button>
      </Group>
      <form>
        <Stack gap="xs">
          <Textarea
            classNames={hiddenInputClass(WordInput.TEXT)}
            key={form.key(WordInput.TEXT)}
            {...form.getInputProps(WordInput.TEXT)}
            aria-label="Your plaintext list of words"
            description={
              <SpacedCodeBlocks
                preface="Separators accepted: "
                values={VALID_CODE_SEPARATORS}
              />
            }
            placeholder="a,list,of,words"
            autosize
            minRows={4}
            maxRows={10}
          />
          <JsonInput
            classNames={hiddenInputClass(WordInput.JSON)}
            key={form.key(WordInput.JSON)}
            {...form.getInputProps(WordInput.JSON)}
            aria-label="Your JSON array of words"
            placeholder='["a","list","of","words"]'
            validationError={validateJSON(form.getValues().json)}
            formatOnBlur={true}
            autosize
            minRows={4}
            maxRows={10}
          />
          <FileInput
            classNames={hiddenInputClass(WordInput.FILE)}
            key={form.key(WordInput.FILE)}
            {...form.getInputProps(WordInput.FILE)}
            aria-label="Upload word list file"
            description={
              <SpacedCodeBlocks preface="Accepts: " values={VALID_FILE_TYPES} />
            }
            placeholder="Upload"
            leftSection={fileIcon}
            accept={VALID_FILE_TYPES.join(",")}
            clearable
            clearButtonProps={{
              onClick: () => {
                resetCurrentField();
              },
            }}
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
        <Group justify="flex-end" mt="md">
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
    </Stack>
  );
}
