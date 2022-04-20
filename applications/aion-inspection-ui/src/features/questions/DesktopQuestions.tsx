import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Paper } from '@pec/aion-ui-components/components/Paper';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}));

export const DesktopQuestions: React.FC = () => {
  const classes = useStyles();

  return (
    <Grid container classes={{ root: classes.root }}>
      <Paper>
        <Typography variant="subtitle1">This view is on a future card.</Typography>
      </Paper>
    </Grid>
  );
};
