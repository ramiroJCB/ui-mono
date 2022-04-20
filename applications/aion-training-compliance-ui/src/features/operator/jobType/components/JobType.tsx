import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { InfiniteCardGrid } from 'components/InfiniteCardGrid';
import { InfoCard } from 'components/InfoCard';
import { IOperatorJobTypeTrainingRequirement } from 'interfaces/operatorJobTypeTrainingRequirement';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Message } from 'components/Message';
import { OperatorJobTypeHeaderContainer } from '../containers/OperatorJobTypeHeader';
import { Search } from 'components/Search';
import { Typography } from '@material-ui/core';
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
  operatorJobTypeTrainingRequirements: DeepReadonly<IOperatorJobTypeTrainingRequirement[]>;
  totalCount: number;
  searchValue: string | string[];
  handleSearch: (searchText: string) => void;
  fetchOperatorJobTypeTrainingRequirements: (
    top: number,
    skip: number
  ) => Promise<IOperatorJobTypeTrainingRequirement[]>;
  hasGlobalPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
  hasOrganizationPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const JobType: React.FC<Props> = ({
  isFetching,
  error,
  operatorJobTypeTrainingRequirements,
  totalCount,
  searchValue,
  handleSearch,
  hasGlobalPermission,
  hasOrganizationPermission,
  fetchOperatorJobTypeTrainingRequirements,
  match: {
    params: { organizationId, jobTypeId }
  }
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <OperatorJobTypeHeaderContainer />
      <GridContainer justify="space-between">
        <Grid item>
          {(hasGlobalPermission(Manage, TrainingComplianceJobTypes) ||
            hasOrganizationPermission(Manage, TrainingComplianceJobTypes)) && (
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to={`/${organizationId}/training-compliance/job-types/${jobTypeId}/add`}
            >
              {t('trainingCompliance.operator.jobType.newTrainingRequirement', 'New Training Requirement')}
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
          items={operatorJobTypeTrainingRequirements}
          totalCount={totalCount}
          fetchItems={fetchOperatorJobTypeTrainingRequirements}
          subtitle
        >
          {({ item: { id: jobTypeTrainingRequirementId, trainingRequirementName, trainingRequirement } }) => (
            <InfoCard
              key={jobTypeTrainingRequirementId}
              cardType={
                trainingRequirement && trainingRequirement.organizationId
                  ? t('trainingCompliance.common.customTraining', 'Custom Training')
                  : t('trainingCompliance.common.standardTraining', 'Standard Training')
              }
              variant={
                trainingRequirement && trainingRequirement.organizationId ? 'customTraining' : 'standardTraining'
              }
              name={trainingRequirementName}
              to={`/${organizationId}/training-compliance/job-types/${jobTypeId}/training/${jobTypeTrainingRequirementId}`}
              subtitle={
                trainingRequirement && trainingRequirement.organizationId ? (
                  <Typography variant="body2" color="textSecondary">
                    <span style={{ fontWeight: 500 }}>
                      {t('trainingCompliance.common.selfValidated', 'Self Validated')}
                    </span>
                  </Typography>
                ) : (
                  <React.Fragment>
                    <VerifiedUserIcon fontSize="inherit" color="secondary" />
                    <Typography variant="body2" color="secondary">
                      <span style={{ fontWeight: 500 }}>
                        {t('trainingCompliance.common.PECValidated', 'PEC Validated')}
                      </span>
                    </Typography>
                  </React.Fragment>
                )
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
            'trainingCompliance.common.noTrainingRequirementsAssigned',
            'No training requirements have been assigned'
          )}
        />
      )}
    </React.Fragment>
  );
};

export const JobTypeComponent = withRouter(JobType);
