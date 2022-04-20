import * as React from 'react';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    gridContainer: {
      padding: theme.spacing(2),
      borderRadius: theme.spacing(1)
    },
    gridItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    gridItemGreen: {
      backgroundColor: '#DAF1E2',
      borderRadius: 4
    }
  });

type OwnProps = {
  viewAsClient: boolean;
  toggleViewAsClient: () => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

export const ToggleView: React.FC<Props> = ({ viewAsClient, toggleViewAsClient, classes }) => (
  <Grid container className={classes.gridContainer}>
    <Grid item xs={12} className={classNames(classes.gridItem, viewAsClient && classes.gridItemGreen)}>
      <Typography variant="body1">{viewAsClient ? 'Viewing Profile as Client' : 'View Profile as Client'}</Typography>
      <Switch value={viewAsClient.toString()} onChange={toggleViewAsClient} checked={viewAsClient} />
    </Grid>
  </Grid>
);

export const ToggleViewComponent = withStyles(styles)(ToggleView);
