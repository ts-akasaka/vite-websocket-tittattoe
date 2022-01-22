import { Box, Container, Typography } from '@mui/material';

import { makeStyles } from "client/makeStyles";
import BoardPanel from "client/components/Panels/BoardPanel"

// Roboto fonts for MUI
// https://mui.com/components/typography/#install-with-npm
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ConnectionButton from './components/Buttons/ConnectionButton';
import RolePanel from './components/Panels/RolePanel';
import StatusPanel from './components/Panels/StatusPanel';
import AudiencePanel from './components/Panels/AudiencePanel';
import { useSocketIsConnected } from './components/Providers/SocketProvider';
import { useStoreContext } from './components/Providers/StoreProvider';

const useStyles = makeStyles()(_theme => ({
  root: {
  },
}));

function App() {
  const { classes, cx } = useStyles();
  const isConnected = useSocketIsConnected();
  const store = useStoreContext();
  const status = store.getState().display.status;
  return (
    <Container
      className={cx("App", classes.root)}
      maxWidth="sm"
    >
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          対戦型〇×ゲーム
        </Typography>
        <BoardPanel />
        <ConnectionButton />
        {isConnected ? (
          <Box>
            <RolePanel />
            <StatusPanel />
            <AudiencePanel />
          </Box>
        ) : (status === "O-Won" || status === "X-Won" || status === "Draw") ? (
          // 接続終了の場合でも、結果は表示しておく
          <Box>
            <StatusPanel />
          </Box>
        ) : null}
      </Box>
    </Container>
  );
}

export default App
