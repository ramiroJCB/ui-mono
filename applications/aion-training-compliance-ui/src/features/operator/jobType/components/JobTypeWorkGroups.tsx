import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IJobTypeWorkGroup } from 'interfaces/jobTypeWorkGroup';
import { InfiniteCardGrid } from 'components/InfiniteCardGrid';
import { InfoCard } from 'components/InfoCard';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Message } from 'components/Message';
import { OperatorJobTypeHeaderContainer } from '../containers/OperatorJobTypeHeader';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Search } from 'components/Search';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  jobTypeId: string;
};

type OwnProps = {
  isFetchingInitialWorkGroups: boolean;
  error: DeepReadonly<AxiosError> | null;
  jobTypeWorkGroups: DeepReadonly<IJobTypeWorkGroup[]>;
  totalCount: number;
  searchValue: string | string[];
  handleSearch: (searchText: string) => void;
  fetchJobTypeWorkGroups: (top: number, skip: number) => Promise<IJobTypeWorkGroup[]>;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const WorkGroups: React.FC<Props> = ({
  isFetchingInitialWorkGroups,
  error,
  jobTypeWorkGroups,
  totalCount,
  searchValue,
  handleSearch,
  fetchJobTypeWorkGroups
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <OperatorJobTypeHeaderContainer />
      {(searchValue || totalCount > 0) && (
        <GridContainer justify="flex-end">
          <Grid item xs={12} md={3}>
            <Search handleSearch={handleSearch} searchValue={searchValue} />
          </Grid>
        </GridContainer>
      )}
      {totalCount > 0 && !error ? (
        <InfiniteCardGrid items={jobTypeWorkGroups} totalCount={totalCount} fetchItems={fetchJobTypeWorkGroups}>
          {({ item: { id, workGroupName } }) => (
            <InfoCard
              key={id}
              cardType={t('trainingCompliance.common.workGroup', 'Work Group')}
              variant="workGroup"
              name={workGroupName}
            />
          )}
        </InfiniteCardGrid>
      ) : error ? (
        <Error
          message={t('trainingCompliance.common.processingRequestError', 'There was an error processing your request.')}
        />
      ) : !isFetchingInitialWorkGroups && searchValue && totalCount === 0 ? (
        <Message message={t('trainingCompliance.common.noSearchResultsFound', 'No search results found')} />
      ) : isFetchingInitialWorkGroups ? (
        <Loading />
      ) : (
        <Message
          message={t(
            'trainingCompliance.operator.jobType.jobTypeNotAssigned',
            'This job type has not been assigned to any work groups'
          )}
        />
      )}
    </React.Fragment>
  );
};

export const JobTypeWorkGroupsComponent = withRouter(WorkGroups);
