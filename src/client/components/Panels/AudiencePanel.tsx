import { FC } from 'react';
import { Paper, Grid } from '@mui/material';

import { makeStyles } from "client/makeStyles";
import { useSelector } from "client/components/Providers/StoreProvider";

const useStyles = makeStyles()(_theme => ({
  root: {
    marginTop: "0.5em",
    marginBottom: "0.5em",
    fontWeight: "bold",
  },
  paper: {
    padding: "0.2em 0.5em 0.0em 0.5em",
    border: "2px solid",
    borderColor: "gray",
  }
}));

type Props = {
};

const AudiencePanel: FC<Props> = () => {
  const { classes, cx } = useStyles();
  const audience = useSelector(root => {
    return root.display.audience;
  });
  return (
    <Grid container
      className={cx("AudiencePanel", classes.root)}
      spacing={1}
      alignItems="center"
    >
      <Grid item>
        <Paper className={classes.paper}>観客数</Paper>
      </Grid>
      <Grid item>
        {audience}
      </Grid>
    </Grid>
  );
};

export default AudiencePanel;
