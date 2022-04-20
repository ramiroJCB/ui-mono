import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { EditEmployeeTrainingRequirementForm } from './EditEmployeeTrainingRequirementForm';
import { EmployeeTrainingInfo } from './EmployeeTrainingInfo';
import { Error } from '@pec/aion-ui-components/components/Error';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Header } from 'components/Header';
import { IDocumentWithStatus } from 'interfaces/documentWithStatus';
import { IEmployeeTrainingRequirement } from 'interfaces/employeeTrainingRequirement';
import { IEmployeeTrainingRequirementForm } from 'interfaces/employeeTrainingRequirementForm';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { useTranslation } from 'react-i18next';

const { Write } = ActivityAction;
const { TrainingComplianceWorkGroupJobTypeEmployees } = ActivityResourceName;

type Props = {
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  employeeTrainingRequirement: DeepReadonly<IEmployeeTrainingRequirement> | null;
  uploadedDocuments: IDocumentWithStatus[];
  onSubmit: (values: IEmployeeTrainingRequirementForm, form: FormApi<IEmployeeTrainingRequirementForm>) => void;
  hasGlobalPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
  hasOrganizationPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
};

export const EmployeeTrainingRequirementComponent: React.FC<Props> = ({
  isFetching,
  error,
  employeeTrainingRequirement,
  hasGlobalPermission,
  hasOrganizationPermission,
  uploadedDocuments,
  onSubmit
}) => {
  const { t } = useTranslation();

  return employeeTrainingRequirement && !isFetching ? (
    <React.Fragment>
      <Header item={employeeTrainingRequirement}>{({ trainingRequirement: { name } }) => name}</Header>
      <GridContainer>
        <Grid item xs={12} md={6}>
          <EmployeeTrainingInfo
            employeeTrainingRequirement={employeeTrainingRequirement}
            uploadedDocuments={uploadedDocuments}
          />
        </Grid>
        {(hasGlobalPermission(Write, TrainingComplianceWorkGroupJobTypeEmployees) ||
          hasOrganizationPermission(Write, TrainingComplianceWorkGroupJobTypeEmployees)) &&
          employeeTrainingRequirement.trainingRequirement.organizationId && (
            <Grid item xs={12} md={6}>
              <EditEmployeeTrainingRequirementForm
                trainingRequirement={employeeTrainingRequirement.trainingRequirement}
                uploadedDocuments={uploadedDocuments}
                initialValues={{
                  ...employeeTrainingRequirement,
                  metaData: [...employeeTrainingRequirement.metaData],
                  uploadedFiles: { acceptedFiles: [], rejectedFiles: [] }
                }}
                onSubmit={onSubmit}
              />
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
