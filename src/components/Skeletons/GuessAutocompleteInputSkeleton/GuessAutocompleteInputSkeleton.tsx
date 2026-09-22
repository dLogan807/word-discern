import { Skeleton } from "@mantine/core";
import classes from "./GuessAutocompleteInputSkeleton.module.css";

export default function GuessAutocompleteInputSkeleton() {
  return <Skeleton classNames={{ root: classes.guess_input_skeleton }} />;
}
