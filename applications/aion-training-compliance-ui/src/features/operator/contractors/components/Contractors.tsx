import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IContractor } from 'interfaces/contractor';
import { InfiniteCardGrid } from 'components/InfiniteCardGrid';
import { InfoCard } from 'components/InfoCard';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Message } from 'components/Message';
import { OperatorHeader } from 'features/operator/components/OperatorHeader';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Search } from 'components/Search';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  isFetchingInitial: boolean;
  error: DeepReadonly<AxiosError> | null;
  contractors: DeepReadonly<IContractor[]>;
  totalCount: number;
  searchValue: string | string[];
  handleSearch: (searchText: string) => void;
  fetchContractors: (top: number, skip: number) => Promise<IContractor[]>;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const Contractors: React.FC<Props> = ({
  isFetchingInitial,
  error,
  contractors,
  totalCount,
  searchValue,
  handleSearch,
  fetchContractors,
  match: {
    params: { organizationId }
  }
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <OperatorHeader />
      {(searchValue || totalCount > 0) && (
        <GridContainer justify="flex-end">
          <Grid item xs={12} md={3}>
            <Search handleSearch={handleSearch} searchValue={searchValue} />
          </Grid>
        </GridContainer>
      )}
      {totalCount > 0 && !error ? (
        <InfiniteCardGrid items={contractors} totalCount={totalCount} fetchItems={fetchContractors}>
          {({ item: { id, name } }) => (
            <InfoCard
              key={id}
              cardType={t('trainingCompliance.common.contractor', 'Contractor')}
              variant="contractor"
              name={name}
              to={`/${organizationId}/training-compliance/contractors/${id}`}
            />
          )}
        </InfiniteCardGrid>
      ) : error ? (
        <Error
          message={t('trainingCompliance.common.processingRequestError', 'There was an error processing your request.')}
        />
      ) : !isFetchingInitial && searchValue && totalCount === 0 ? (
        <Message message={t('trainingCompliance.common.noSearchResultsFound', 'No search results found')} />
      ) : isFetchingInitial ? (
        <Loading />
      ) : (
        <Message
          message={t(
            'trainingCompliance.operator.contractors.noContractorsReleasedToOrganization',
            'No contractors have been released to your organization'
          )}
        />
      )}
    </React.Fragment>
  );
};

export const ContractorsComponent = withRouter(Contractors);
