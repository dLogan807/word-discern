import { useContext, useEffect, useState } from "react";
import { CustomWordsContext } from "../App";
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
import classes from "./CustomWords.module.css";
import { parse, ParseError, printParseErrorCode } from "jsonc-parser";

enum WordInput {
  TEXT = "text",
  JSON = "json",
  FILE = "file",
}

export default function CustomWordsInput() {
  const { updateCustomWords } = useContext(CustomWordsContext);

  const [customWords, setCustomWords] = useState<string[]>([]);

  useEffect(() => {
    //console.log({ customWords }, "changed");
  }, [customWords]);

  return (
    <Stack align="center">
      <WordInputForm onSubmit={setCustomWords} />
    </Stack>
  );
}

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

function WordInputForm({ onSubmit }: { onSubmit: (words: string[]) => void }) {
  const [inputMode, setInputMode] = useState<WordInput>(WordInput.TEXT);
  const [specialCharsAllowed, setSpecialCharsAllowed] =
    useState<boolean>(false);

  const validCodeSeparators: string[] = [",", "space", "newline", ";"];
  const validFileTypes: string[] = [".txt", ".json"];

  const form = useForm({
    mode: "controlled",
    initialValues: {
      text: "",
      json: "",
      file: null,
      allowSpecialChars: true,
      replaceDefaultWords: false,
    },
    validate: {
      json: (value) => validateJSON(value),
      file: async (value) => await validateFile(value),
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
      const err = errors[0];
      return `Invalid JSON: ${printParseErrorCode(err.error)} at offset ${
        err.offset
      }`;
    }
    if (!Array.isArray(parsed)) return "Not a JSON array";

    return null;
  }

  async function validateFile(file: File | null): Promise<string | null> {
    if (inputMode != WordInput.FILE || file == null) return null;
    console.log("checking file");

    if (file.type !== "text/plain" && file.type !== "application/json") {
      return "Unsupported file type";
    }

    if (file.type === "application/json") {
      return validateJSON(await file.text());
    }

    return null;
  }

  const hiddenInputClass = (inputType: WordInput) => {
    return inputMode == inputType
      ? {}
      : {
          root: classes.hidden_input,
        };
  };

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
            form.resetField(inputMode);
            onSubmit([]);
          }}
        >
          Reset
        </Button>
      </Group>
      <form
        onSubmit={form.onSubmit((values) => {
          //console.log(values);
          onSubmit(["test"]);
        })}
      >
        <Stack gap="xs">
          <Textarea
            classNames={hiddenInputClass(WordInput.TEXT)}
            key={form.key("text")}
            {...form.getInputProps("text")}
            aria-label="Your plaintext list of words"
            description={
              <SpacedCodeBlocks
                preface="Separators accepted: "
                values={validCodeSeparators}
              />
            }
            placeholder="a,list,of,words"
            autosize
            minRows={4}
            maxRows={10}
          />
          <JsonInput
            classNames={hiddenInputClass(WordInput.JSON)}
            key={form.key("json")}
            {...form.getInputProps("json")}
            aria-label="Your json array of words"
            placeholder='["a","list","of","words"]'
            validationError={validateJSON(form.getValues().json)}
            formatOnBlur={true}
            autosize
            minRows={4}
            maxRows={10}
          />
          <FileInput
            classNames={hiddenInputClass(WordInput.FILE)}
            key={form.key("file")}
            {...form.getInputProps("file")}
            aria-label="Upload word list file"
            description={
              <SpacedCodeBlocks preface="Accepts: " values={validFileTypes} />
            }
            placeholder="Upload"
            accept={validFileTypes.join(",")}
            clearable
          />
          <Checkbox
            key={form.key("allowSpecialChars")}
            {...form.getInputProps("allowSpecialChars", { type: "checkbox" })}
            label="Allow special characters"
            onChange={(event) =>
              setSpecialCharsAllowed(event.currentTarget.checked)
            }
          />
          <Checkbox
            key={form.key("replaceDefaultWords")}
            {...form.getInputProps("replaceDefaultWords", { type: "checkbox" })}
            label="Replace default word list"
          />
        </Stack>
        <Group justify="flex-end" mt="md">
          <Button type="submit">Update word list</Button>
        </Group>
      </form>
    </Stack>
  );
}
