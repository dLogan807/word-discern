import { Anchor, Box, ThemeIcon, Text } from "@mantine/core";
import { IconBrandMantine, IconBrandVite } from "@tabler/icons-react";
import { ReactElement } from "react";
import classes from "./Footer.module.css";

export default function Footer() {
  return (
    <Box className={classes.footer}>
      <Text>Site by Dylan Logan</Text>
      <Box className={classes.powered_by}>
        <Text>Powered by</Text>
        <PoweredByIconLink
          href="https://vite.dev/"
          ariaLabel="Vite"
          icon={<IconBrandVite aria-label="Vite icon" />}
        />
        <PoweredByIconLink
          href="https://mantine.dev/"
          ariaLabel="Mantine"
          icon={<IconBrandMantine aria-label="Mantine icon" />}
        />
      </Box>
    </Box>
  );
}

function PoweredByIconLink({
  href,
  ariaLabel,
  icon,
}: {
  href: string;
  ariaLabel: string;
  icon: ReactElement;
}) {
  return (
    <Anchor className={classes.centered_icon_link} href={href} aria-label={ariaLabel}>
      <ThemeIcon>{icon}</ThemeIcon>
    </Anchor>
  );
}
