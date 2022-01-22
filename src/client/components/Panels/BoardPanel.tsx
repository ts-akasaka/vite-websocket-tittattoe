import { FC } from 'react';
import { Paper } from '@mui/material';

import { makeStyles } from "client/makeStyles";
import SquareButton from "client/components/Buttons/SquareButton";
import { useSelector } from "client/components/Providers/StoreProvider";

const useStyles = makeStyles()(_theme => ({
  root: {
    boxSizing: "content-box",
    padding: 0,
    height: "24rem", // 8rem * 3
    width: "24rem", // 8rem * 3
    display: "flex",
    flexWrap: "wrap",
    border: "4px solid lightgrey",

    backgroundColor: "grey",
    backgroundImage:
     "repeating-linear-gradient(-45deg,#fff, #fff 7px,transparent 0, transparent 14px)",
  },
}));

type Props = {
};

const BoardPanel: FC<Props> = () => {
  const { classes, cx } = useStyles();
  const board = useSelector(root => root.display.board);
  return (
    <Paper
      className={cx("BoardPanel", classes.root)}
    >{
      board.map((_value, pos) => (
        <SquareButton key={pos} pos={pos} />
      ))
    }</Paper>
  );
};

export default BoardPanel;
