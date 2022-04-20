import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { BackTitleHeader } from '@pec/aion-ui-components/components/BackTitleHeader';
import { DeepReadonly } from 'ts-essentials';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { ITaskAssignee } from 'interfaces/taskAssignee';
import { ITaskGroup } from '@pec/aion-ui-core/interfaces/taskGroup';
import { ITaskGroupContractorsTableOption } from 'interfaces/taskGroupContractorsTableOption';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { TaskGroupContractorsTable } from '../containers/TaskGroupContractorsTable';

type Props = {
  taskGroup: DeepReadonly<ITaskGroup>;
  taskGroupContractors: DeepReadonly<ITaskAssignee[]>;
  handleRowSelect: (option: ITaskGroupContractorsTableOption) => void;
  totalOptionsCount: number;
  isFetchingData: boolean;
  organizationId: string;
  taskGroupId: string;
};

export const TaskGroupContractorsComponent: React.FC<Props> = ({
  taskGroup: { subject },
  taskGroupContractors,
  isFetchingData,
  handleRowSelect,
  organizationId,
  taskGroupId,
  totalOptionsCount
}) => (
  <React.Fragment>
    <GridContainer>
      <Grid item>
        <BackTitleHeader
          to={`/${organizationId}/alerts/taskGroups/${taskGroupId}`}
          linkTitle="Back to Task Groups"
          subTitle="Contractors"
        >
          {subject}
        </BackTitleHeader>
      </Grid>
    </GridContainer>
    <Paper>
      <TaskGroupContractorsTable
        taskGroupContractors={taskGroupContractors}
        totalTaskGroupContractorsCount={totalOptionsCount}
        isFetching={isFetchingData}
        handleRowSelect={handleRowSelect}
      />
    </Paper>
  </React.Fragment>
);
