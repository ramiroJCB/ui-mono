import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Header } from 'components/Header';
import { IEmployeeTrainingRequirement } from 'interfaces/employeeTrainingRequirement';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { EmployeeTrainingInfo } from 'features/contractor/employeeTrainingRequirement/components/EmployeeTrainingInfo';
import { IDocumentWithStatus } from 'interfaces/documentWithStatus';
import { useTranslation } from 'react-i18next';

type Props = {
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  employeeTrainingRequirement: DeepReadonly<IEmployeeTrainingRequirement> | null;
  uploadedDocuments: IDocumentWithStatus[];
};

export const EmployeeTrainingRequirementComponent: React.FC<Props> = ({
  isFetching,
  error,
  employeeTrainingRequirement,
  uploadedDocuments
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
