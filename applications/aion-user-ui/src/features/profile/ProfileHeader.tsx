import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'utility-types';
import { ITrainee } from '@pec/aion-ui-core/interfaces/trainee';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  item: {
    display: 'flex',
    justifyContent: 'center'
  },
  h4: {
    paddingTop: theme.spacing(2)
  },
  large: {
    width: theme.spacing(37),
    height: theme.spacing(37)
  }
}));

type Props = {
  trainee: DeepReadonly<ITrainee>;
};

export const ProfileHeader: React.FC<Props> = ({ trainee: { firstName, lastName, photoUrl, pecIdentifier } }) => {
  const classes = useStyles();

  return (
    <Grid container>
      {photoUrl && (
        <Grid item xs={12} classes={{ root: classes.item }}>
          <Avatar alt={`${firstName} ${lastName}`} src={photoUrl} className={classes.large} />
        </Grid>
      )}
      <Grid item xs={12} classes={{ root: classes.item }}>
        <Typography variant="h4" className={classes.h4}>
          {firstName} {lastName}
        </Typography>
      </Grid>
      <Grid item xs={12} classes={{ root: classes.item }}>
        <Hidden smDown>
          <Typography variant="subtitle1" color="secondary">
            {pecIdentifier}
          </Typography>
        </Hidden>
      </Grid>
    </Grid>
  );
};
