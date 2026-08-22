import { Code } from "@mantine/core";

type CodeBlocksProps = {
  preface: string;
  values: string[];
};

export function CodeBlocks({ preface, values }: CodeBlocksProps) {
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
