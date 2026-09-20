import { IconExclamationCircle } from "@tabler/icons-react";
import WordInfoBadge from "../WordInfoBadge/WordInfoBadge";

export default function WordListFetchFailureBadge({ iconSize }: { iconSize: number }) {
  return (
    <WordInfoBadge color="red" icon={<IconExclamationCircle size={iconSize} />}>
      Failed to fetch default word list
    </WordInfoBadge>
  );
}
