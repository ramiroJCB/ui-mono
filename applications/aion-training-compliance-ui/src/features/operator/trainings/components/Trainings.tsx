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
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { Link } from '@pec/aion-ui-components/components/Link';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Message } from 'components/Message';
import { OperatorHeader } from 'features/operator/components/OperatorHeader';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Search } from 'components/Search';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const { Manage } = ActivityAction;
const { TrainingComplianceTrainingRequirements } = ActivityResourceName;

type RouteParams = {
  organizationId: string;
  trainingRequirementId: string;
};

type OwnProps = {
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  trainings: DeepReadonly<ITrainingRequirement[]>;
  totalCount: number;
  searchValue: string | string[];
  handleSearch: (searchText: string) => void;
  fetchTrainings: (top: number, skip: number) => Promise<ITrainingRequirement[]>;
  hasGlobalPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
  hasOrganizationPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
};

type Props = OwnProps & RouteComponentProps<RouteParams>;

const Trainings: React.FC<Props> = ({
  isFetching,
  error,
  trainings,
  totalCount,
  searchValue,
  handleSearch,
  hasGlobalPermission,
  hasOrganizationPermission,
  fetchTrainings,
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
          {(hasGlobalPermission(Manage, TrainingComplianceTrainingRequirements) ||
            hasOrganizationPermission(Manage, TrainingComplianceTrainingRequirements)) && (
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              component={Link}
              to={`/${organizationId}/training-compliance/training/add`}
            >
              {t('trainingCompliance.operator.trainings.newCustomTraining', 'New Custom Training')}
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
        <InfiniteCardGrid items={trainings} totalCount={totalCount} fetchItems={fetchTrainings} subtitle>
          {({ item: { id, name, organizationId: trainingOrganizationId } }) => (
            <InfoCard
              key={id}
              cardType={
                trainingOrganizationId
                  ? t('trainingCompliance.common.customTraining', 'Custom Training')
                  : t('trainingCompliance.common.standardTraining', 'Standard Training')
              }
              variant={trainingOrganizationId ? 'customTraining' : 'standardTraining'}
              name={name}
              to={`/${organizationId}/training-compliance/training/${id}/general-info`}
              subtitle={
                trainingOrganizationId ? (
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
            'trainingCompliance.operator.trainings.noTrainingRequirementsCreated',
            'No training requirements have been created'
          )}
        />
      )}
    </React.Fragment>
  );
};

export const TrainingsComponent = withRouter(Trainings);
