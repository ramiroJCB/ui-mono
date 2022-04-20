import * as React from 'react';
import Button from '@material-ui/core/Button/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ClientTasksTable } from '../containers/ClientTasksTable';
import { DeepReadonly } from 'ts-essentials';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IClientTaskTableOption } from 'interfaces/clientTaskTableOption';
import { ITask } from '@pec/aion-ui-core/interfaces/task';
import { Link } from 'react-router-dom';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { usePermission } from 'hooks/usePermission';
import { ExportReportContainer } from '../containers/ExportReport';

type Props = {
  clientTasks: DeepReadonly<ITask[]>;
  handleRowSelect: (option: IClientTaskTableOption) => void;
  isFetchingData: boolean;
  organizationId: string;
  totalOptionsCount: number;
};

export const ClientTasksComponent: React.FC<Props> = ({
  clientTasks,
  handleRowSelect,
  isFetchingData,
  organizationId,
  totalOptionsCount
}) => {
  const { hasTaskGroupsWritePermission, hasTaskGroupsManagePermission, hasTaskGroupsAuditPermission } = usePermission();

  return (
    <React.Fragment>
      <GridContainer spacing={1} alignItems="flex-start" justify="space-between">
        <Grid item xs={12} sm={8}>
          <Typography variant="h5">All Assigned Tasks</Typography>
        </Grid>
        <Grid item xs={12} sm={2}>
          <ExportReportContainer />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            fullWidth
            disabled={!hasTaskGroupsWritePermission && !hasTaskGroupsManagePermission && !hasTaskGroupsAuditPermission}
            variant="contained"
            color="secondary"
            component={Link}
            to={{ pathname: `/${organizationId}/alerts/taskGroups/add`, state: { from: 'tasks' } }}
          >
            Assign New Task
          </Button>
        </Grid>
      </GridContainer>
      <Paper>
        <ClientTasksTable
          clientTasks={clientTasks}
          isFetching={isFetchingData}
          totalClientTasksCount={totalOptionsCount}
          handleRowSelect={handleRowSelect}
        />
      </Paper>
    </React.Fragment>
  );
};
