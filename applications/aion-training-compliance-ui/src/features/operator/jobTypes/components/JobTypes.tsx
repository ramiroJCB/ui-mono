import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';
import { InfiniteCardGrid } from 'components/InfiniteCardGrid';
import { InfoCard } from 'components/InfoCard';
import { Link } from '@pec/aion-ui-components/components/Link';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Message } from 'components/Message';
import { OperatorHeader } from 'features/operator/components/OperatorHeader';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Search } from 'components/Search';
import { useTranslation } from 'react-i18next';

const { Manage } = ActivityAction;
const { TrainingComplianceJobTypes } = ActivityResourceName;

type RouteParams = {
  organizationId: string;
  jobTypeId: string;
};

type OwnProps = {
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  jobTypes: DeepReadonly<IJobType[]>;
  totalCount: number;
  searchValue: string | string[];
  handleSearch: (searchText: string) => void;
  fetchJobTypes: (top: number, skip: number) => Promise<IJobType[]>;
  hasGlobalPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
  hasOrganizationPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
};

type Props = OwnProps & RouteComponentProps<RouteParams>;

const JobTypes: React.FC<Props> = ({
  isFetching,
  error,
  jobTypes,
  totalCount,
  searchValue,
  handleSearch,
  hasGlobalPermission,
  hasOrganizationPermission,
  fetchJobTypes,
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
          {(hasGlobalPermission(Manage, TrainingComplianceJobTypes) ||
            hasOrganizationPermission(Manage, TrainingComplianceJobTypes)) && (
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              component={Link}
              to={`/${organizationId}/training-compliance/job-types/add`}
            >
              {t('trainingCompliance.common.newJobType', 'New Job Type')}
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
        <InfiniteCardGrid items={jobTypes} totalCount={totalCount} fetchItems={fetchJobTypes}>
          {({ item: { id, name } }) => (
            <InfoCard
              to={`/${organizationId}/training-compliance/job-types/${id}`}
              key={id}
              cardType={t('trainingCompliance.common.jobType', 'Job Type')}
              variant="jobType"
              name={name}
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
          message={t('trainingCompliance.operator.jobTypes.noJobTypesCreated', 'No job types have been created')}
        />
      )}
    </React.Fragment>
  );
};

export const JobTypesComponent = withRouter(JobTypes);
