import { FC } from 'react';
import { Paper } from '@mui/material';
import { keyframes} from 'tss-react';

import { makeStyles } from "client/makeStyles";
import { useSelector } from "client/components/Providers/StoreProvider";

const useStyles = makeStyles<boolean>()((_theme, isMyTurn) => ({
  root: {
    padding: "0.5em",
    marginTop: "0.5em",
    marginBottom: "0.5em",
    border: "2px solid grey",
    fontWeight: isMyTurn ? "bold" : "normal",
    animation: isMyTurn ? `${keyframes({
      "0%, 100%": {
        backgroundColor: "white",
      },
      "50%": {
        backgroundColor: "pink",
      },
    })} 1s linear 2` : undefined,
  },
}));

type Props = {
};

const StatusPanel: FC<Props> = () => {
  const status = useSelector(root => root.display.status);
  const role = useSelector(root => root.role.value);
  const isMyTurn = (
    (role === "O" && status === "O-Turn") ||
    (role === "X" && status === "X-Turn")
  );
  const { classes, cx } = useStyles(isMyTurn);
  return (
    <Paper
      className={cx("StatusPanel", classes.root)}
    >{
      (isMyTurn) ? (
        "あなたの番です"
      ) : (
        {
          "Accepting": "後手の接続を受け付けています・・・",
          "O-Turn": "先手の番です。",
          "X-Turn": "後手の番です。",
          "O-Done": "先手が打ちました。",
          "X-Done": "後手が打ちました。",
          "O-Won": "先手が勝ちました。",
          "X-Won": "後手が勝ちました。",
          "Draw": "引き分けです。"
        }[status] ?? null
      )
    }</Paper>
  );
};

export default StatusPanel;
