import { Dialog } from '@mui/material';
import { FC, useEffect } from 'react';

import { makeStyles } from "client/makeStyles";

const useStyles = makeStyles()(_theme => ({
  root: {
    opacity: 0,
  },
}));

type Props = {
  onClose: () => void,
  onError: (reason: any) => void,
  showWhile: () => Promise<void>,
};

const TransparentBlocker: FC<Props> = ({ onClose, onError, showWhile }) => {
  const { classes, cx } = useStyles();
  useEffect(() => { showWhile().then(onClose).catch(onError) }, []);
  return (
    <Dialog
      className={cx(
        "TransparentBlocker",
        classes.root
      )}
      open
      fullScreen
    />
  );
}

export default TransparentBlocker;
