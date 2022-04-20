import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { BackTitleHeader } from '@pec/aion-ui-components/components/BackTitleHeader';
import { ClientContractorTasksTable } from '../containers/ClientContractorTasksTable';
import { DeepReadonly } from 'ts-essentials';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IClientContractorTasksTableOption } from 'interfaces/clientContractorTasksTableOption';
import { IContractorAssignee } from 'interfaces/contractorAssignee';
import { ITask } from '@pec/aion-ui-core/interfaces/task';
import { Paper } from '@pec/aion-ui-components/components/Paper';

type Props = {
  contractor: IContractorAssignee;
  contractorTasks: DeepReadonly<ITask[]>;
  handleRowSelect: (option: IClientContractorTasksTableOption) => void;
  totalOptionsCount: number;
  isFetchingData: boolean;
  organizationId: string;
};

export const ClientContractorTasksComponent: React.FC<Props> = ({
  contractor: { name },
  contractorTasks,
  isFetchingData,
  handleRowSelect,
  organizationId,
  totalOptionsCount
}) => (
  <React.Fragment>
    <GridContainer>
      <Grid item>
        <BackTitleHeader
          to={`/${organizationId}/alerts/taskGroups/contractors`}
          linkTitle="Back to Contractors"
          subTitle="Tasks"
        >
          {name}
        </BackTitleHeader>
      </Grid>
    </GridContainer>
    <Paper>
      <ClientContractorTasksTable
        contractorTasks={contractorTasks}
        totalContractorTasksCount={totalOptionsCount}
        isFetching={isFetchingData}
        handleRowSelect={handleRowSelect}
      />
    </Paper>
  </React.Fragment>
);
