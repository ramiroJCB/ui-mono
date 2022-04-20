import * as React from 'react';
import { Paper as AionPaper } from '@pec/aion-ui-components/components/Paper';
import { withStyles, WithStyles } from '@material-ui/core/styles';

const styles = () => ({
  paper: {
    margin: 12
  }
});

type Props = WithStyles<typeof styles>;

const PaperComponent: React.FC<Props> = ({ children, classes }) => (
  <AionPaper className={classes.paper}>{children}</AionPaper>
);

export const Paper = withStyles(styles)(PaperComponent);
