import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { InfiniteCardGrid } from 'components/InfiniteCardGrid';
import { InfoCard } from 'components/InfoCard';
import { IWorkGroup } from '@pec/aion-ui-core/interfaces/workGroup';
import { Link } from '@pec/aion-ui-components/components/Link';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Message } from 'components/Message';
import { OperatorHeader } from 'features/operator/components/OperatorHeader';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Search } from 'components/Search';
import { useTranslation } from 'react-i18next';

const { Manage } = ActivityAction;
const { TrainingComplianceWorkGroups } = ActivityResourceName;

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  isFetchingInitial: boolean;
  error: DeepReadonly<AxiosError> | null;
  workGroups: DeepReadonly<IWorkGroup[]>;
  totalCount: number;
  searchValue: string | string[];
  handleSearch: (searchText: string) => void;
  fetchWorkGroups: (top: number, skip: number) => Promise<IWorkGroup[]>;
  hasGlobalPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
  hasOrganizationPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const WorkGroups: React.FC<Props> = ({
  isFetchingInitial,
  error,
  workGroups,
  totalCount,
  searchValue,
  handleSearch,
  hasGlobalPermission,
  hasOrganizationPermission,
  fetchWorkGroups,
  match: {
    params: { organizationId }
  }
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <OperatorHeader />
      <GridContainer justify="space-between">
        <Grid item>
          {(hasGlobalPermission(Manage, TrainingComplianceWorkGroups) ||
            hasOrganizationPermission(Manage, TrainingComplianceWorkGroups)) && (
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              component={Link}
              to={`/${organizationId}/training-compliance/work-groups/add`}
            >
              {t('trainingCompliance.common.newWorkGroup', 'New Work Group')}
            </Button>
          )}
        </Grid>
        {(searchValue || totalCount > 0) && (
          <Grid item xs={12} md={3}>
            <Search handleSearch={handleSearch} searchValue={searchValue} />
          </Grid>
        )}
      </GridContainer>
      {totalCount > 0 && !error ? (
        <InfiniteCardGrid items={workGroups} totalCount={totalCount} fetchItems={fetchWorkGroups}>
          {({ item: { id, name } }) => (
            <InfoCard
              key={id}
              cardType={t('trainingCompliance.common.workGroup', 'Work Group')}
              variant="workGroup"
              name={name}
              to={`/${organizationId}/training-compliance/work-groups/${id}`}
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
          message={t('trainingCompliance.operator.workGroups.noWorkGroupsCreated', 'No work groups have been created')}
        />
      )}
    </React.Fragment>
  );
};

export const WorkGroupsComponent = withRouter(WorkGroups);
