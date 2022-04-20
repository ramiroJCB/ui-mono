import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';

const styles = () =>
  createStyles({
    label: {
      fontSize: 12
    }
  });

type OwnProps = {
  label: string;
  value: JSX.Element;
};

type Props = OwnProps & WithStyles<typeof styles>;

const EnvelopeItemComponent: React.FC<Props> = ({ classes, label, value }: Props) => (
  <GridContainer spacing={1}>
    <Grid item xs={12}>
      <InputLabel className={classes.label}>{label}</InputLabel>
    </Grid>
    <Grid item xs={12}>
      {value}
    </Grid>
  </GridContainer>
);

export const EnvelopeItem = withStyles(styles)(EnvelopeItemComponent);
