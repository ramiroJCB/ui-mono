import * as React from 'react';
import Button from '@material-ui/core/Button/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'ts-essentials';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { ITaskGroup } from '@pec/aion-ui-core/interfaces/taskGroup';
import { ITaskGroupTableOption } from 'interfaces/taskGroupTableOption';
import { Link } from 'react-router-dom';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { TaskGroupsTable } from '../containers/TaskGroupsTable';
import { usePermission } from 'hooks/usePermission';

type Props = {
  taskGroups: DeepReadonly<ITaskGroup[]>;
  handleRowSelect: (option: ITaskGroupTableOption) => void;
  totalOptionsCount: number;
  isFetchingData: boolean;
  organizationId: string;
};

export const TaskGroupsComponent: React.FC<Props> = ({
  taskGroups,
  isFetchingData,
  handleRowSelect,
  organizationId,
  totalOptionsCount
}) => {
  const { hasTaskGroupsWritePermission, hasTaskGroupsManagePermission, hasTaskGroupsAuditPermission } = usePermission();
  return (
    <React.Fragment>
      <GridContainer justify="space-between">
        <Grid item>
          <Typography variant="h5">Task Groups</Typography>
        </Grid>
        <Grid item>
          <Button
            disabled={!hasTaskGroupsWritePermission && !hasTaskGroupsManagePermission && !hasTaskGroupsAuditPermission}
            variant="contained"
            color="secondary"
            component={Link}
            to={{ pathname: `/${organizationId}/alerts/taskGroups/add`, state: { from: 'taskGroups' } }}
          >
            Assign New Task
          </Button>
        </Grid>
      </GridContainer>
      <Paper>
        <TaskGroupsTable
          taskGroups={taskGroups}
          isFetching={isFetchingData}
          totalTaskGroupsCount={totalOptionsCount}
          handleRowSelect={handleRowSelect}
        />
      </Paper>
    </React.Fragment>
  );
};
