import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles, WithStyles } from '@material-ui/core/styles';

const styles = () => ({
  message: {
    margin: 22
  }
});

type OwnProps = {
  message: string;
};

type Props = OwnProps & WithStyles<typeof styles>;

const MessageComponent: React.FC<Props> = ({ message, classes }) => (
  <Grid container justify="center">
    <Grid item>
      <Typography variant="body1" className={classes.message}>
        {message}
      </Typography>
    </Grid>
  </Grid>
);

export const Message = withStyles(styles)(MessageComponent);
