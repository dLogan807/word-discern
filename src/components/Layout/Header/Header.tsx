import { Box, Title, Group, ActionIcon } from "@mantine/core";
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
      <Title order={1} classNames={{ root: classes.header_logo }}>
        Word Discern
      </Title>

      <Group>
        <ThemeSelector />
        <ActionIcon
          variant="transparent"
          aria-label="Settings"
          onClick={toggleSettingsOpened}
          classNames={{
            root: classes.settings_button,
            icon: `${classes.settings_button_icon}
                  ${settingsOpened ? classes.settings_button_icon_opened : undefined}
                  ${!doAnimations ? classes.no_animation : undefined}`,
          }}
        >
          {settingsOpened ? <IconXFilled /> : <IconSettings />}
        </ActionIcon>
      </Group>
    </Box>
  );
}
