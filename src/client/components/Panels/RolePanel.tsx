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

const RolePanel: FC<Props> = () => {
  const { classes, cx } = useStyles();
  const role = useSelector(root => root.role.value);
  return (
    <Grid container
      className={cx("RolePanel", classes.root)}
      alignItems="center"
      spacing={1}
    >
      <Grid item>
        <Paper className={classes.paper}>役割</Paper>
      </Grid>
      <Grid item>{
        (role === null)
          ? null
          : { "O": "先手", "X": "後手", "A": "観客" }[role]
      }  </Grid>
    </Grid>
  );
};

export default RolePanel;
