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
import { IOperatorWorkGroupJobTypeContractor } from 'interfaces/operatorWorkGroupJobTypeContractor';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Message } from 'components/Message';
import { OperatorWorkGroupJobTypeHeaderContainer } from '../containers/OperatorWorkGroupJobTypeHeader';
import { Search } from 'components/Search';
import { useTranslation } from 'react-i18next';

const { Manage } = ActivityAction;
const { TrainingComplianceWorkGroups } = ActivityResourceName;

type RouteParams = {
  organizationId: string;
  workGroupId: string;
  workGroupJobTypeId: string;
};

type OwnProps = {
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  workGroupJobTypeContractors: DeepReadonly<IOperatorWorkGroupJobTypeContractor[]>;
  totalCount: number;
  searchValue: string | string[];
  handleSearch: (searchText: string) => void;
  fetchWorkGroupJobTypeContractors: (top: number, skip: number) => Promise<IOperatorWorkGroupJobTypeContractor[]>;
  hasGlobalPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
  hasOrganizationPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
  unassignWorkGroupJobTypeContractor: (workGroupJobTypeContractorId: string) => () => Promise<void>;
};

type Props = OwnProps & RouteComponentProps<RouteParams>;

const WorkGroupJobTypeContractors: React.FC<Props> = ({
  isFetching,
  error,
  workGroupJobTypeContractors,
  totalCount,
  searchValue,
  handleSearch,
  hasGlobalPermission,
  hasOrganizationPermission,
  fetchWorkGroupJobTypeContractors,
  unassignWorkGroupJobTypeContractor,
  match: {
    params: { organizationId, workGroupJobTypeId, workGroupId }
  }
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <OperatorWorkGroupJobTypeHeaderContainer />
      <GridContainer justify="space-between">
        <Grid item>
          {(hasGlobalPermission(Manage, TrainingComplianceWorkGroups) ||
            hasOrganizationPermission(Manage, TrainingComplianceWorkGroups)) && (
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to={`/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}/add-contractors`}
            >
              {t('trainingCompliance.operator.workGroupJobType.`assignContractors`', 'Assign Contractors')}
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
        <InfiniteCardGrid
          items={workGroupJobTypeContractors}
          totalCount={totalCount}
          fetchItems={fetchWorkGroupJobTypeContractors}
        >
          {({ item: { id, contractorName } }) => (
            <InfoCard
              to={`/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}/contractors/${id}`}
              key={id}
              cardType={t('trainingCompliance.common.contractor', 'Contractor')}
              variant="contractor"
              name={contractorName}
              withMenu={
                hasGlobalPermission(Manage, TrainingComplianceWorkGroups) ||
                hasOrganizationPermission(Manage, TrainingComplianceWorkGroups)
                  ? true
                  : false
              }
              handleDelete={
                hasGlobalPermission(Manage, TrainingComplianceWorkGroups) ||
                hasOrganizationPermission(Manage, TrainingComplianceWorkGroups)
                  ? unassignWorkGroupJobTypeContractor(id)
                  : undefined
              }
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
          message={t(
            'trainingCompliance.operator.workGroupJobType.noContractorsAssigned',
            'No contractors have been assigned'
          )}
        />
      )}
    </React.Fragment>
  );
};

export const WorkGroupJobTypeContractorsComponent = withRouter(WorkGroupJobTypeContractors);
