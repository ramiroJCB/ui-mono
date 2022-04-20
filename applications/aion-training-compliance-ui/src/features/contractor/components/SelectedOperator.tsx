import * as React from 'react';
import BusinessIcon from '@material-ui/icons/Business';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { IOrganization } from '@pec/aion-ui-core/interfaces/organization';
import { DeepReadonly } from 'ts-essentials';

type OwnProps = {
  client: DeepReadonly<IOrganization>;
};

const styles = (theme: Theme) =>
  createStyles({
    businessIcon: {
      color: theme.palette.primary.main
    },
    clientName: {
      paddingLeft: theme.spacing(1),
      color: theme.palette.primary.main
    }
  });

type Props = WithStyles<typeof styles> & OwnProps;

export const SelectedOperator: React.FC<Props> = ({ client: { name }, classes: { businessIcon, clientName } }) => (
  <React.Fragment>
    <Grid item>
      <BusinessIcon className={businessIcon} />
    </Grid>
    <Grid item>
      <Typography className={clientName} variant="subtitle2">
        {name}
      </Typography>
    </Grid>
  </React.Fragment>
);

export const SelectedOperatorComponent = withStyles(styles)(SelectedOperator);
