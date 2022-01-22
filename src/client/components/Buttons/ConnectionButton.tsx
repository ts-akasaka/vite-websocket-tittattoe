import { FC, useCallback, useState } from "react";
import { Button } from '@mui/material';

import { makeStyles } from "client/makeStyles";
import { useSocketContext, useSocketIsConnected } from "../Providers/SocketProvider";

const useStyles = makeStyles()((_theme) => ({
  root: {
    marginTop: "1rem",
  },
}));

const ComponentClassName = "ConnectionButton";
type Props = {
};
const ConnectionButton: FC<Props> = (_props) => {
  const socket = useSocketContext();
  const isConnected = useSocketIsConnected();
  const { classes, cx } = useStyles();
  const [disabled, setDisabled] = useState(false);

  const onClick = useCallback(async ()=>{
    if (socket.isOpen) {
      socket.disconnect();
    } else {
      setDisabled(true);
      try {
        await socket.connect();
      } finally {
        setDisabled(false);
      }
    }
  }, []);

  return (
    <Button
      className={cx(
        ComponentClassName,
        classes.root,
      )}
      size="large"
      color={ isConnected ? "secondary" : "primary" }
      variant="contained"
      onClick={onClick}
      disabled={disabled}
    >
      { isConnected ? "切断" : "参加"}
    </Button>
  );
};

export default ConnectionButton;
