import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';

const styles = createStyles({
  span: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    '& svg': {
      marginRight: '.125em'
    }
  }
});

type OwnProps = {
  icon: JSX.Element;
  label: string;
  tooltip?: string;
};

type Props = WithStyles<typeof styles> & OwnProps;

const Component: React.FC<Props> = ({ icon, label, classes, tooltip, ...props }) => (
  <Tooltip title={tooltip ?? ''}>
    <span className={classes.span} {...props}>
      {label} {icon}
    </span>
  </Tooltip>
);

export const LabeledIcon = withStyles(styles)(Component);
