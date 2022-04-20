import * as React from 'react';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { Header } from 'components/Header';
import { IContractorJobTypeTrainingRequirement } from 'interfaces/contractorJobTypeTrainingRequirement';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Paper } from 'components/Paper';
import { TrainingInfoComponent } from 'features/operator/training/components/TrainingInfo';
import { useTranslation } from 'react-i18next';

type Props = {
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  contractorJobTypeTrainingRequirement: DeepReadonly<IContractorJobTypeTrainingRequirement> | null;
};

export const JobTypeTrainingRequirementComponent: React.FC<Props> = ({
  isFetching,
  error,
  contractorJobTypeTrainingRequirement
}) => {
  const { t } = useTranslation();

  return contractorJobTypeTrainingRequirement && !isFetching ? (
    <React.Fragment>
      <Header item={contractorJobTypeTrainingRequirement}>
        {({ trainingRequirementName }) => trainingRequirementName}
      </Header>
      {contractorJobTypeTrainingRequirement.trainingRequirement && (
        <Paper>
          <TrainingInfoComponent trainingRequirement={contractorJobTypeTrainingRequirement.trainingRequirement} />
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
