import { Anchor, ThemeIcon } from "@mantine/core";
import { ReactElement } from "react";
import classes from "./PoweredByIconLink.module.css";

type PoweredByIconLinkProps = {
  href: string;
  ariaLabel: string;
  icon: ReactElement;
};

export default function PoweredByIconLink({ href, ariaLabel, icon }: PoweredByIconLinkProps) {
  return (
    <Anchor classNames={{ root: classes.centered_icon_link }} href={href} aria-label={ariaLabel}>
      <ThemeIcon>{icon}</ThemeIcon>
    </Anchor>
  );
}
