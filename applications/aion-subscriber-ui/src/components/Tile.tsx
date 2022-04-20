import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Paper, PaperProps } from '@pec/aion-ui-components/components/Paper';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';

type OwnProps = {
  primaryText: string;
  actions?: JSX.Element;
};

const styles = (theme: Theme) => ({
  primaryText: {
    color: theme.palette.grey[600]
  }
});

type Props = WithStyles<typeof styles> & PaperProps & OwnProps;

const Component: React.FC<Props> = ({ primaryText, actions, classes, children, ...props }) => (
  <Paper {...props}>
    <GridContainer style={{ flexGrow: 0 }} justify="space-between">
      <Grid item>
        <Typography className={classes.primaryText} variant="h6">
          {primaryText}
        </Typography>
      </Grid>
      {actions && (
        <Grid item style={{ paddingLeft: 0 }}>
          {actions}
        </Grid>
      )}
    </GridContainer>
    {children}
  </Paper>
);

export const Tile = withStyles(styles)(Component);
