import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';

const styles = () => ({
  row: {
    display: 'flex',
    justifyContent: 'center'
  }
});

type OwnProps = {
  key: string;
  style: React.CSSProperties;
};

type Props = OwnProps & WithStyles<typeof styles>;

const CardGridComponent: React.FC<Props> = ({ children, classes, key, style }) => (
  <div key={key} style={style} className={classes.row}>
    {children}
  </div>
);

export const CardGrid = withStyles(styles)(CardGridComponent);
