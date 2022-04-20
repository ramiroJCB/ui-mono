import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Link } from 'react-router-dom';
import { LocationDescriptor } from 'history';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { TaskStatus, TaskStatusDescription } from '@pec/aion-ui-core/interfaces/taskGroup';
import { TaskStatusIcon } from './TaskStatusIcon';

type Props = {
  status: TaskStatus;
  to: LocationDescriptor;
  statusCount: number;
  disabled?: boolean;
};

export const TaskStatusCard: React.FC<Props> = ({ disabled, status, statusCount, to }) => (
  <Paper>
    <GridContainer justify="center" spacing={1}>
      <Grid item>
        <TaskStatusIcon status={status} />
      </Grid>
      <Grid item>
        <Typography variant="h6">{TaskStatusDescription.get(status)}</Typography>
      </Grid>
    </GridContainer>
    <GridContainer justify="center" alignItems="center" direction="column" spacing={2}>
      <Grid item xs={12}>
        <Typography align="center" variant="subtitle1">
          {`Number of Contractors: ${statusCount}`}
        </Typography>
      </Grid>
      <Grid item>
        <Button variant="outlined" color="secondary" disabled={disabled || statusCount === 0} component={Link} to={to}>
          View Contractors
        </Button>
      </Grid>
    </GridContainer>
  </Paper>
);
