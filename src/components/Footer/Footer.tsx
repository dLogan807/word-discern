import { Box, Text, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBrandMantine, IconBrandVite } from "@tabler/icons-react";
import LicenseModal from "../Modals/LiscensesModal/LicensesModal";
import PoweredByIconLink from "./PoweredByIconLink/PoweredByIconLink";
import classes from "./Footer.module.css";

export default function Footer() {
  const [modalOpened, { open, close }] = useDisclosure(false);

  return (
    <>
      <LicenseModal opened={modalOpened} close={close} />
      <Box className={classes.footer}>
        <Text>Site by Dylan Logan</Text>
        <Box className={classes.attributions_box}>
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
          <Button
            size="xs"
            classNames={{
              root: classes.licenses_modal_button_root,
            }}
            variant="light"
            aria-label="Open licenses modal"
            onClick={open}
          >
            Licenses
          </Button>
        </Box>
      </Box>
    </>
  );
}
