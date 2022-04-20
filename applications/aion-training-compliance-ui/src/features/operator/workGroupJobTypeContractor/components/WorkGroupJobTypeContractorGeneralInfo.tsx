import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { AxiosError } from 'axios';
import { ConfirmRemoveButton } from 'components/ConfirmRemoveButton';
import { ContractorInfoComponent } from 'features/operator/contractor/components/ContractorInfo';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IOperatorWorkGroupJobTypeContractor } from 'interfaces/operatorWorkGroupJobTypeContractor';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { OperatorWorkGroupJobTypeContractorHeaderContainer } from '../containers/OperatorWorkGroupJobTypeContractorHeader';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { RouteComponentProps, withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  workGroupJobTypeContractor: DeepReadonly<IOperatorWorkGroupJobTypeContractor> | null;
  unassignWorkGroupJobTypeContractor: () => Promise<void>;
  hasGlobalPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
  hasOrganizationPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
};
const { Manage } = ActivityAction;
const { TrainingComplianceWorkGroups } = ActivityResourceName;

type RouteParams = {
  organizationId: string;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const WorkGroupJobTypeContractorGeneralInfo: React.FC<Props> = ({
  workGroupJobTypeContractor,
  isFetching,
  error,
  unassignWorkGroupJobTypeContractor,
  hasGlobalPermission,
  hasOrganizationPermission
}) => {
  const { t } = useTranslation();

  return !isFetching && workGroupJobTypeContractor ? (
    <React.Fragment>
      <OperatorWorkGroupJobTypeContractorHeaderContainer />
      <GridContainer>
        <Grid item>
          {(hasGlobalPermission(Manage, TrainingComplianceWorkGroups) ||
            hasOrganizationPermission(Manage, TrainingComplianceWorkGroups)) && (
            <ConfirmRemoveButton
              message={t('trainingCompliance.common.unassignItemConfirmation', {
                name: workGroupJobTypeContractor.contractorName,
                defaultValue: "Are you sure you'd like to unassign {{name}}?"
              })}
              title={t(
                'trainingCompliance.operator.workGroupJobTypeContractor.unassignContractor',
                'Unassign Contractor'
              )}
              handleDelete={unassignWorkGroupJobTypeContractor}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          {workGroupJobTypeContractor.contractor && (
            <Paper>
              <ContractorInfoComponent contractor={workGroupJobTypeContractor.contractor} />
            </Paper>
          )}
        </Grid>
      </GridContainer>
    </React.Fragment>
  ) : error ? (
    <Error
      message={t('trainingCompliance.common.processingRequestError', 'There was an error processing your request.')}
    />
  ) : (
    <Loading />
  );
};

export const WorkGroupJobTypeContractorGeneralInfoComponent = withRouter(WorkGroupJobTypeContractorGeneralInfo);
