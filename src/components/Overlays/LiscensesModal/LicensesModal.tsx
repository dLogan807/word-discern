import wordListLicenseUrl from "/words.txt.licence?url";
import { Box, Paper, Button, Text, ThemeIcon, Anchor, Modal } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import licenses from "@/generated/licenses.json";
import { useSettingsContext } from "@/hooks/useSettingsContext";
import classes from "./LicensesModal.module.css";

type LicensesModalProps = {
  opened: boolean;
  close: () => void;
};

type License = {
  department: string;
  relatedTo: string;
  name: string;
  licensePeriod: string;
  material: string;
  licenseType: string;
  link: string;
  remoteVersion: string;
  installedVersion: string;
  definedVersion: string;
  author: string;
};

const typedLicenses = licenses as License[];

export default function LicenseModal({ opened, close }: LicensesModalProps) {
  const { doAnimations } = useSettingsContext();

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Open Source Licenses"
      closeButtonProps={{ "aria-label": "Close licenses modal" }}
      transitionProps={doAnimations ? undefined : { duration: 0 }}
      classNames={{
        title: classes.modal_title,
      }}
      size="auto"
      centered
    >
      <Box className={classes.licenses_box}>
        <Text>
          The following open source libraries and resources were used in the making of this website
        </Text>
        <Paper classNames={{ root: classes.license_paper }} withBorder>
          {typedLicenses.map((license) => (
            <Anchor
              key={license.name}
              href={license.link.replace("git+", "").replace("ssh://", "")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open repository for ${license.name}`}
              classNames={{ root: classes.package_link }}
            >
              <Button variant="outline">
                <Box className={classes.license_box}>
                  <Text>{`${license.name} ${license.installedVersion}`}</Text>
                  <Text>{`License: ${license.licenseType}`}</Text>
                  <ThemeIcon classNames={{ root: classes.license_link_icon }}>
                    <IconExternalLink aria-hidden="true" />
                  </ThemeIcon>
                </Box>
              </Button>
            </Anchor>
          ))}
        </Paper>

        <Box className={classes.word_list_licence_box}>
          <Anchor
            href={wordListLicenseUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open default word list license"
          >
            <Button variant="subtle" classNames={{ label: classes.word_list_licence_button }}>
              Word List License
              <ThemeIcon>
                <IconExternalLink aria-hidden="true" />
              </ThemeIcon>
            </Button>
          </Anchor>
        </Box>
      </Box>
    </Modal>
  );
}
