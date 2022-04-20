import * as React from 'react';
import Chip from '@material-ui/core/Chip';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(0.5)
    }
  });

type OwnProps = {
  label: string;
};

type Props = OwnProps & WithStyles<typeof styles>;

const TagComponent: React.FC<Props> = ({ classes, label }) => <Chip classes={classes} label={label} />;

export const Tag = withStyles(styles)(TagComponent);
