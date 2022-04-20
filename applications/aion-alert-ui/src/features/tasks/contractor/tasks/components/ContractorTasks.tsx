import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ContractorTasksTable } from '../containers/ContractorTasksTable';
import { DeepReadonly } from 'ts-essentials';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IContractorTaskTableOption } from 'interfaces/contractorTaskTableOption';
import { ITask } from '@pec/aion-ui-core/interfaces/task';
import { Paper } from '@pec/aion-ui-components/components/Paper';

type Props = {
  contractorTasks: DeepReadonly<ITask[]>;
  handleRowSelect: (option: IContractorTaskTableOption) => void;
  totalOptionsCount: number;
  isFetchingData: boolean;
};

export const ContractorTasksComponent: React.FC<Props> = ({
  contractorTasks,
  isFetchingData,
  handleRowSelect,
  totalOptionsCount
}) => (
  <React.Fragment>
    <GridContainer justify="space-between">
      <Grid item>
        <Typography variant="h5">Assigned Tasks</Typography>
      </Grid>
    </GridContainer>
    <Paper>
      <ContractorTasksTable
        contractorTasks={contractorTasks}
        isFetching={isFetchingData}
        totalContractorTasksCount={totalOptionsCount}
        handleRowSelect={handleRowSelect}
      />
    </Paper>
  </React.Fragment>
);
