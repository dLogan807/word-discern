import { Box, Loader, Paper, Title } from "@mantine/core";
import classes from "./FullPageLoader.module.css";

export default function FullPageLoader() {
  return (
    <Box className={classes.loader_box}>
      <Paper classNames={{ root: classes.loader_paper }}>
        <Title>Loading...</Title>
        <Loader />
      </Paper>
    </Box>
  );
}
