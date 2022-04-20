import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { AxiosError } from 'axios';
import { ContractorWorkGroupHeader } from './ContractorWorkGroupHeader';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IContractorWorkGroupJobType } from 'interfaces/contractorWorkGroupJobType';
import { InfiniteCardGrid } from 'components/InfiniteCardGrid';
import { InfoCard } from 'components/InfoCard';
import { IWorkGroupContractor } from 'interfaces/workGroupContractor';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Message } from 'components/Message';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Search } from 'components/Search';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupContractorId: string;
};

type OwnProps = {
  isFetchingInitial: boolean;
  isFetchingWorkGroupContractor: boolean;
  workGroupContractor: DeepReadonly<IWorkGroupContractor> | null;
  error: DeepReadonly<AxiosError> | null;
  contractorWorkGroupJobTypes: DeepReadonly<IContractorWorkGroupJobType[]>;
  totalCount: number;
  searchValue: string | string[];
  handleSearch: (searchText: string) => void;
  fetchWorkGroupJobTypes: (
    workGroupId: string
  ) => (top: number, skip: number) => Promise<IContractorWorkGroupJobType[]>;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const WorkGroupJobTypes: React.FC<Props> = ({
  isFetchingInitial,
  isFetchingWorkGroupContractor,
  error,
  contractorWorkGroupJobTypes,
  totalCount,
  workGroupContractor,
  searchValue,
  handleSearch,
  fetchWorkGroupJobTypes,
  match: {
    params: { organizationId, clientId, workGroupContractorId }
  }
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <ContractorWorkGroupHeader workGroupContractor={workGroupContractor} isFetching={isFetchingWorkGroupContractor} />
      {(searchValue || totalCount > 0) && (
        <GridContainer justify="flex-end">
          <Grid item xs={12} md={3}>
            <Search handleSearch={handleSearch} searchValue={searchValue} />
          </Grid>
        </GridContainer>
      )}
      {totalCount > 0 && workGroupContractor && !error ? (
        <InfiniteCardGrid
          items={contractorWorkGroupJobTypes}
          totalCount={totalCount}
          fetchItems={fetchWorkGroupJobTypes(workGroupContractor.workGroupId)}
        >
          {({ item: { id, workGroupJobTypeId, jobTypeName } }) => (
            <InfoCard
              key={id}
              cardType={t('trainingCompliance.common.jobType', 'Job Type')}
              variant="jobType"
              name={jobTypeName}
              to={`/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}`}
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
            'trainingCompliance.contractor.workGroup.noJobTypesAssigned',
            'No job types have been assigned to this work group'
          )}
        />
      )}
    </React.Fragment>
  );
};

export const WorkGroupJobTypesComponent = withRouter(WorkGroupJobTypes);
