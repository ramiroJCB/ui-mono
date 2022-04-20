import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { AxiosError } from 'axios';
import { ConfirmRemoveButton } from 'components/ConfirmRemoveButton';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Header } from 'components/Header';
import { IOperatorJobTypeTrainingRequirement } from 'interfaces/operatorJobTypeTrainingRequirement';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Paper } from 'components/Paper';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { TrainingInfoComponent } from 'features/operator/training/components/TrainingInfo';
import { useTranslation } from 'react-i18next';

const { Manage } = ActivityAction;
const { TrainingComplianceTrainingRequirements } = ActivityResourceName;

type RouteParams = {
  organizationId: string;
  workGroupId?: string;
  jobTypeTrainingRequirementId: string;
};

type OwnProps = {
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  operatorJobTypeTrainingRequirement: DeepReadonly<IOperatorJobTypeTrainingRequirement> | null;
  deleteJobTypeTrainingRequirement: (jobTypeId: string) => () => Promise<void>;
  hasGlobalPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
  hasOrganizationPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const JobTypeTrainingRequirement: React.FC<Props> = ({
  isFetching,
  error,
  operatorJobTypeTrainingRequirement,
  deleteJobTypeTrainingRequirement,
  hasGlobalPermission,
  hasOrganizationPermission,
  match: {
    params: { workGroupId }
  }
}) => {
  const { t } = useTranslation();

  return operatorJobTypeTrainingRequirement && !isFetching ? (
    <React.Fragment>
      <Header item={operatorJobTypeTrainingRequirement}>
        {({ trainingRequirementName }) => trainingRequirementName}
      </Header>
      <GridContainer justify="space-between">
        {!workGroupId &&
          (hasGlobalPermission(Manage, TrainingComplianceTrainingRequirements) ||
            hasOrganizationPermission(Manage, TrainingComplianceTrainingRequirements)) && (
            <Grid item>
              <ConfirmRemoveButton
                title={t(
                  'trainingCompliance.operator.jobTypeTrainingRequirement.removeTrainingRequirement',
                  'Remove Training Requirement'
                )}
                message={t('trainingCompliance.common.deleteConfirmation', {
                  name: operatorJobTypeTrainingRequirement.trainingRequirementName,
                  defaultValue: "Are you sure you'd like to delete {{name}}?"
                })}
                handleDelete={deleteJobTypeTrainingRequirement(operatorJobTypeTrainingRequirement.jobTypeId)}
              />
            </Grid>
          )}
      </GridContainer>
      {operatorJobTypeTrainingRequirement.trainingRequirement && (
        <Paper>
          <TrainingInfoComponent trainingRequirement={operatorJobTypeTrainingRequirement.trainingRequirement} />
        </Paper>
      )}
    </React.Fragment>
  ) : error ? (
    <Error
      message={t('trainingCompliance.common.processingRequestError', 'There was an error processing your request.')}
    />
  ) : (
    <Loading />
  );
};

export const JobTypeTrainingRequirementComponent = withRouter(JobTypeTrainingRequirement);
