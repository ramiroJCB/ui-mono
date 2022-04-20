import * as React from 'react';
import { AxiosError } from 'axios';
import { ContractorInfoComponent } from './ContractorInfo';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { IContractor } from 'interfaces/contractor';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Paper } from 'components/Paper';
import { ContractorHeaderContainer } from '../containers/ContractorHeader';
import { useTranslation } from 'react-i18next';

type Props = {
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  contractor: DeepReadonly<IContractor> | null;
};

export const ContractorComponent: React.FC<Props> = ({ contractor, isFetching, error }) => {
  const { t } = useTranslation();

  return !isFetching && contractor ? (
    <React.Fragment>
      <ContractorHeaderContainer />
      <Paper>
        <ContractorInfoComponent contractor={contractor} />
      </Paper>
    </React.Fragment>
  ) : error ? (
    <Error
      message={t('trainingCompliance.common.processingRequestError', 'There was an error processing your request.')}
    />
  ) : (
    <Loading />
  );
};
