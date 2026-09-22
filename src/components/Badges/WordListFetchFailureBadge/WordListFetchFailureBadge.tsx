import { Anchor } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";
import WordInfoBadge from "../WordInfoBadge/WordInfoBadge";
import classes from "./WordListFetchFailureBadge.module.css";

type WordListFetchFailureBadgeProps = {
  iconSize: number;
  showReloadLink?: boolean;
};

export default function WordListFetchFailureBadge({
  iconSize,
  showReloadLink,
}: WordListFetchFailureBadgeProps) {
  return (
    <WordInfoBadge color="red" icon={<IconExclamationCircle size={iconSize} />}>
      Failed to fetch default word list
      {showReloadLink && (
        <>
          {". "}
          <Anchor classNames={{ root: classes.reload_anchor }} href="">
            Reload?
          </Anchor>
        </>
      )}
    </WordInfoBadge>
  );
}
