import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = () =>
  createStyles({
    overlay: {
      opacity: 0.4,
      pointerEvents: 'none'
    },
    loader: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      margin: 'auto',
      zIndex: 1
    }
  });

type OwnProps = {
  isLoading: boolean;
};

type Props = OwnProps & WithStyles<typeof styles>;

const LoadingOverlayComponent: React.FC<Props> = ({ children, classes, isLoading }) => (
  <React.Fragment>
    {isLoading && (
      <React.Fragment>
        <CircularProgress variant="indeterminate" className={classes.loader} />
        <div className={classes.overlay}>{children}</div>
      </React.Fragment>
    )}
    {!isLoading && children}
  </React.Fragment>
);

export const LoadingOverlay = withStyles(styles)(LoadingOverlayComponent);
