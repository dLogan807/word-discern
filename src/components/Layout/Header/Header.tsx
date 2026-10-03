import logoUrl from "/favicon.png?url";
import { Box, Title, Group, ActionIcon, Image } from "@mantine/core";
import { IconXFilled, IconSettings } from "@tabler/icons-react";
import { ThemeSelector } from "@/components/Buttons/ThemeSelector/ThemeSelector";
import { useSettingsContext } from "@/hooks/useSettingsContext";
import classes from "./Header.module.css";

type HeaderProps = {
  settingsOpened: boolean;
  toggleSettingsOpened: () => void;
};

export default function Header({ settingsOpened, toggleSettingsOpened }: HeaderProps) {
  const { doAnimations } = useSettingsContext();

  return (
    <Box className={classes.header}>
      <Group>
        <Image src={logoUrl} classNames={{ root: classes.logo_image }} alt="Word Discern logo" />
        <Title order={1} classNames={{ root: classes.header_logo }}>
          Word Discern
        </Title>
      </Group>

      <Group>
        <ThemeSelector />
        <ActionIcon
          variant="transparent"
          aria-label={`${settingsOpened ? "Close" : "Open"} settings`}
          onClick={toggleSettingsOpened}
          classNames={{
            root: classes.settings_button,
            icon: `${classes.settings_button_icon}
                  ${settingsOpened ? classes.settings_button_icon_opened : undefined}
                  ${!doAnimations ? classes.no_animation : undefined}`,
          }}
        >
          {settingsOpened ? (
            <IconXFilled aria-hidden="true" />
          ) : (
            <IconSettings aria-hidden="true" />
          )}
        </ActionIcon>
      </Group>
    </Box>
  );
}
