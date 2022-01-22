import { FC, useCallback } from "react";
import { Button } from '@mui/material';

import CircleIcon from '@mui/icons-material/CircleOutlined';
import CrossIcon from '@mui/icons-material/Close';

import { makeStyles } from "client/makeStyles";
import { useSelector, useStoreContext } from "client/components/Providers/StoreProvider";
import { actions as serverActions } from "store/server";
import { actions } from "store/client";
import { setValueOnTTTBoard } from "lib/tit-tat-toe";
import { useSocketContext, useSocketIsConnected } from "../Providers/SocketProvider";

const useStyles = makeStyles<{value: any}>()((_theme, { value }) => ({
  root: {
    height: "calc(8rem - 2px)",
    width: "calc(8rem - 2px)",
    border: value === null ? "0px" : "1px solid grey",
    margin: "1px",
    fontSize: "2em",
    fontWeight: "bold",
    backgroundColor: value !== null ? "white" : "#ffffffc0",
    '&:hover': {
      backgroundColor: "green",
      color: '#FFF'
    },
  },
  icon: {
    width: "4rem",
    height: "4rem",
    color: "black",
  }
}));

type Props = {
  pos: number,
};

const SlideButton: FC<Props> = (props) => {
  const {pos} = props;
  const board = useSelector(root => root.display.board);
  const status = useSelector(root => root.display.status);
  const role = useSelector(root => root.role.value);
  const value = board[pos];
  const { classes, cx } = useStyles({value});
  const socket = useSocketContext();
  const isConnected = useSocketIsConnected();
  const { dispatch } = useStoreContext();

  const onClick = useCallback(async ()=>{
    if (!(role === "O" || role === "X")) {
      return;
    }
    const updated = setValueOnTTTBoard(board, pos % 3, Math.floor(pos / 3), role);
    socket.send(JSON.stringify(serverActions.display.setBoard(updated)));
    dispatch(actions.display.setStatus(role === "O" ? "O-Done" : "X-Done"));
  }, [pos, value, board]);

  const isMyTurn = (
    (role === "O" && status === "O-Turn") ||
    (role === "X" && status === "X-Turn")
  );

  return (
    <Button
      className={cx(
        "SquareButton",
        classes.root,
      )}
      onClick={onClick}
      disabled = { !isConnected || !isMyTurn }
      >
      {value === "O" ? <CircleIcon className={classes.icon} /> : value === "X" ? <CrossIcon className={classes.icon} /> : null}
    </Button>
  );
};

export default SlideButton;
