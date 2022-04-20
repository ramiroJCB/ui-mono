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
import { IWorkGroupJobType } from '@pec/aion-ui-core/interfaces/workGroupJobType';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Message } from 'components/Message';
import { OperatorWorkGroupHeaderContainer } from '../containers/OperatorWorkGroupHeader';
import { Search } from 'components/Search';
import { useTranslation } from 'react-i18next';

const { Manage } = ActivityAction;
const { TrainingComplianceWorkGroups } = ActivityResourceName;

type RouteParams = {
  organizationId: string;
  workGroupId: string;
};

type OwnProps = {
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  workGroupJobTypes: DeepReadonly<IWorkGroupJobType[]>;
  totalCount: number;
  searchValue: string | string[];
  handleSearch: (searchText: string) => void;
  fetchWorkGroupJobTypes: (top: number, skip: number) => Promise<IWorkGroupJobType[]>;
  hasGlobalPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
  hasOrganizationPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
};

type Props = OwnProps & RouteComponentProps<RouteParams>;

const WorkGroup: React.FC<Props> = ({
  isFetching,
  error,
  workGroupJobTypes,
  totalCount,
  searchValue,
  handleSearch,
  hasGlobalPermission,
  hasOrganizationPermission,
  fetchWorkGroupJobTypes,
  match: {
    params: { organizationId, workGroupId }
  }
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <OperatorWorkGroupHeaderContainer />
      <GridContainer justify="space-between">
        <Grid item>
          {(hasGlobalPermission(Manage, TrainingComplianceWorkGroups) ||
            hasOrganizationPermission(Manage, TrainingComplianceWorkGroups)) && (
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to={`/${organizationId}/training-compliance/work-groups/${workGroupId}/add-work-group-job-types`}
            >
              {t('trainingCompliance.operator.workGroup.addJobType', 'Add Job Type')}
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
        <InfiniteCardGrid items={workGroupJobTypes} totalCount={totalCount} fetchItems={fetchWorkGroupJobTypes}>
          {({ item: { id, jobTypeName } }) => (
            <InfoCard
              to={`/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${id}`}
              key={id}
              cardType={t('trainingCompliance.common.jobType', 'Job Type')}
              variant="jobType"
              name={jobTypeName}
            />
          )}
        </InfiniteCardGrid>
      ) : error ? (
        <Error
          message={t('trainingCompliance.common.processingRequestError', 'There was an error processing your request.')}
        />
      ) : !isFetching && searchValue && totalCount === 0 ? (
        <Message message={t('trainingCompliance.common.noSearchResultsFound', 'No search results found')} />
      ) : isFetching ? (
        <Loading />
      ) : (
        <Message
          message={t('trainingCompliance.operator.workGroup.noJobTypesAssigned', 'No job types have been assigned')}
        />
      )}
    </React.Fragment>
  );
};

export const WorkGroupComponent = withRouter(WorkGroup);
