import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Link, useParams } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    center: {
      display: 'block',
      margin: `${theme.spacing(2)}px auto`
    },
    emptyIcon: {
      fontSize: 140
    },
    container: {
      flexGrow: 1,
      padding: theme.spacing(2)
    },
    button: {
      display: 'flex',
      width: 'max-content',
      margin: `${theme.spacing(2)}px auto`
    }
  })
);

export const GetStarted: React.FC = () => {
  const classes = useStyles();
  const { organizationId } = useParams<{ organizationId: string }>();

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12}>
        <Typography variant="h6">Forms</Typography>
      </Grid>
      <Grid item xs={12}>
        <AssignmentOutlinedIcon classes={{ root: classes.emptyIcon }} className={classes.center} color="disabled" />
        <Typography variant="h5" align="center">
          There are currently no forms to view
        </Typography>
        <Typography variant="body1" align="center">
          Use the button below to add your first form.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          component={Link}
          to={`/${organizationId}/forms/add`}
          data-testid="createFormButton"
        >
          Create Form
        </Button>
      </Grid>
    </Grid>
  );
};
