import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { AxiosError } from 'axios';
import { ConfirmRemoveButton } from 'components/ConfirmRemoveButton';
import { DeepReadonly } from 'ts-essentials';
import { EditTrainingForm } from './EditTrainingForm';
import { Error } from '@pec/aion-ui-components/components/Error';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Header } from 'components/Header';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { TrainingInfoComponent } from './TrainingInfo';
import { useTranslation } from 'react-i18next';

const { Write, Manage } = ActivityAction;
const { TrainingComplianceTrainingRequirements } = ActivityResourceName;

type Props = {
  training: DeepReadonly<ITrainingRequirement> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  onSubmit: (values: ITrainingRequirement, form: FormApi<ITrainingRequirement>) => void;
  hasGlobalPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
  hasOrganizationPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
  deleteTraining: (trainingRequirementId: string) => () => Promise<void>;
};

export const TrainingGeneralInfoComponent: React.FC<Props> = ({
  training,
  isFetching,
  error,
  onSubmit,
  hasGlobalPermission,
  hasOrganizationPermission,
  deleteTraining
}) => {
  const { t } = useTranslation();

  return !isFetching && training ? (
    <React.Fragment>
      <Header item={training}>{({ name }) => name}</Header>
      {(hasGlobalPermission(Manage, TrainingComplianceTrainingRequirements) ||
        hasOrganizationPermission(Manage, TrainingComplianceTrainingRequirements)) &&
        training.organizationId && (
          <GridContainer>
            <Grid item>
              <ConfirmRemoveButton
                message={t('trainingCompliance.common.removeTrainingNameConfirmation', {
                  name: training.name,
                  defaultValue: "Are you sure you'd like to remove {{name}}?"
                })}
                title={t('trainingCompliance.operator.training.removeTraining', 'Remove Training')}
                handleDelete={deleteTraining(training.id)}
              />
            </Grid>
          </GridContainer>
        )}
      <GridContainer>
        <Grid item xs={12} md={6}>
          <Paper>
            <TrainingInfoComponent trainingRequirement={training} />
          </Paper>
        </Grid>
        {(hasGlobalPermission(Write, TrainingComplianceTrainingRequirements) ||
          hasOrganizationPermission(Write, TrainingComplianceTrainingRequirements)) &&
          training.organizationId && (
            <Grid item xs={12} md={6}>
              <EditTrainingForm initialValues={training} onSubmit={onSubmit} />
            </Grid>
          )}
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
