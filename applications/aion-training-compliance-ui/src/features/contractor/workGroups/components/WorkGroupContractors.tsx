import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Header } from 'components/Header';
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
};

type OwnProps = {
  isFetchingInitial: boolean;
  error: DeepReadonly<AxiosError> | null;
  workGroupContractors: DeepReadonly<IWorkGroupContractor[]>;
  totalCount: number;
  searchValue: string | string[];
  handleSearch: (searchText: string) => void;
  fetchWorkGroups: (top: number, skip: number) => Promise<IWorkGroupContractor[]>;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const WorkGroupContractors: React.FC<Props> = ({
  isFetchingInitial,
  error,
  workGroupContractors,
  totalCount,
  searchValue,
  handleSearch,
  fetchWorkGroups,
  match: {
    params: { organizationId, clientId }
  }
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Header
        title={t('trainingCompliance.common.trainingCompliance', 'Training Compliance')}
        toolbarLinks={[
          {
            label: t('trainingCompliance.contractor.workGroups.assignedWorkGroups', 'Assigned Work Groups'),
            to: `/${organizationId}/training-compliance/clients/${clientId}/work-groups`
          }
        ]}
      />
      {(searchValue || totalCount > 0) && (
        <GridContainer justify="flex-end">
          <Grid item xs={12} md={3}>
            <Search handleSearch={handleSearch} searchValue={searchValue} />
          </Grid>
        </GridContainer>
      )}
      {totalCount > 0 && !error ? (
        <InfiniteCardGrid items={workGroupContractors} totalCount={totalCount} fetchItems={fetchWorkGroups}>
          {({ item: { id, workGroupName } }) => (
            <InfoCard
              key={id}
              cardType={t('trainingCompliance.common.workGroup', 'Work Group')}
              variant="workGroup"
              name={workGroupName}
              to={`/${organizationId}/training-compliance/clients/${clientId}/work-groups/${id}`}
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
            'trainingCompliance.contractor.workGroups.noWorkGroupsAssigned',
            'No work groups have been assigned'
          )}
        />
      )}
    </React.Fragment>
  );
};

export const WorkGroupContractorsComponent = withRouter(WorkGroupContractors);
