import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ClientContractorsTable } from '../containers/ClientContractorsTable';
import { DeepReadonly } from 'ts-essentials';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAssignee } from 'interfaces/assignee';
import { IClientContractorsTableOption } from 'interfaces/clientContractorsTableOption';
import { Link } from 'react-router-dom';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { usePermission } from 'hooks/usePermission';

type Props = {
  contractors: DeepReadonly<IAssignee[]>;
  handleRowSelect: (option: IClientContractorsTableOption) => void;
  totalOptionsCount: number;
  isFetchingData: boolean;
  organizationId: string;
};

export const ClientContractorsComponent: React.FC<Props> = ({
  contractors,
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
          <Typography variant="h5">Contractors</Typography>
        </Grid>
        <Grid item>
          <Button
            disabled={!hasTaskGroupsWritePermission && !hasTaskGroupsManagePermission && !hasTaskGroupsAuditPermission}
            variant="contained"
            color="secondary"
            component={Link}
            to={{ pathname: `/${organizationId}/alerts/taskGroups/add`, state: { from: 'contractors' } }}
          >
            Assign New Task
          </Button>
        </Grid>
      </GridContainer>
      <Paper>
        <ClientContractorsTable
          contractors={contractors}
          isFetching={isFetchingData}
          totalClientContractorsCount={totalOptionsCount}
          handleRowSelect={handleRowSelect}
        />
      </Paper>
    </React.Fragment>
  );
};
