import * as React from 'react';
import MaterialUIPaper, { PaperProps as MaterialUIPaperProps } from '@material-ui/core/Paper';
import { Theme, createStyles, WithStyles, WithTheme, CircularProgress, withStyles, withTheme } from '@material-ui/core';
import { ErrorIcon } from '@pec/aion-ui-components/components/ErrorIcon';
import { Overlay } from '@pec/aion-ui-components/components/Overlay';

export type PaperProps = {
  hasError?: boolean;
  isLoading?: boolean;
};

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      position: 'relative'
    },
    icon: {
      position: 'absolute',
      top: theme.spacing(4),
      left: '50%',
      margin: `-${theme.spacing(2)}px 0 0 -${theme.spacing(2)}px`,
      zIndex: theme.zIndex.appBar
    }
  });

type Props = WithStyles<typeof styles> & WithTheme & MaterialUIPaperProps & PaperProps;

const PaperComponent: React.FC<Props> = ({
  classes,
  children,
  className = '',
  hasError,
  isLoading,
  theme,
  ...paperProps
}) => {
  const Icon = hasError ? ErrorIcon : isLoading ? CircularProgress : undefined;
  return (
    <MaterialUIPaper
      style={{ minHeight: Icon && theme.spacing(8) }}
      className={`${classes.paper} ${className}`}
      {...paperProps}
    >
      {Icon && (
        <React.Fragment>
          <Icon className={classes.icon} />
          <Overlay open />
        </React.Fragment>
      )}
      {children}
    </MaterialUIPaper>
  );
};

export const Paper = withStyles(styles)(withTheme(PaperComponent));
