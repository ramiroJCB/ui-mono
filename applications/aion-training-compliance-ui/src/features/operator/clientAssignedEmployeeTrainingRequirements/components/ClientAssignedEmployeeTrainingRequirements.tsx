import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { AxiosError } from 'axios';
import { ClientAssignedEmployeeTrainingRequirementsHeaderContainer } from '../containers/ClientAssignedEmployeeTrainingRequirementsHeader';
import { ComplianceLevel } from 'interfaces/complianceLevel';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IClientAssignedEmployeeTrainingRequirement } from 'interfaces/clientAssignedEmployeeTrainingRequirement';
import { InfiniteCardGrid } from 'components/InfiniteCardGrid';
import { InfoCard } from 'components/InfoCard';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Message } from 'components/Message';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Search } from 'components/Search';
import { Typography } from '@material-ui/core';
import { WithTheme, withTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  isFetchingInitial: boolean;
  error: DeepReadonly<AxiosError> | null;
  clientAssignedEmployeeTrainingRequirements: DeepReadonly<IClientAssignedEmployeeTrainingRequirement[]>;
  totalCount: number;
  searchValue: string | string[];
  handleSearch: (searchText: string) => void;
  fetchClientAssignedEmployeeTrainingRequirements: (
    top: number,
    skip: number
  ) => Promise<IClientAssignedEmployeeTrainingRequirement[]>;
};

type Props = WithTheme & OwnProps & RouteComponentProps<RouteParams>;

const ClientAssignedEmployeeTrainingRequirements: React.FC<Props> = ({
  isFetchingInitial,
  error,
  clientAssignedEmployeeTrainingRequirements,
  totalCount,
  searchValue,
  handleSearch,
  fetchClientAssignedEmployeeTrainingRequirements,
  theme,
  match: {
    params: { organizationId }
  }
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <ClientAssignedEmployeeTrainingRequirementsHeaderContainer />
      {(searchValue || totalCount > 0) && (
        <GridContainer justify="flex-end">
          <Grid item xs={12} md={3}>
            <Search handleSearch={handleSearch} searchValue={searchValue} />
          </Grid>
        </GridContainer>
      )}
      {totalCount > 0 && !error ? (
        <InfiniteCardGrid
          items={clientAssignedEmployeeTrainingRequirements}
          totalCount={totalCount}
          fetchItems={fetchClientAssignedEmployeeTrainingRequirements}
          subtitle
        >
          {({
            item: {
              status,
              employeeId,
              employeeTrainingRequirementId,
              trainingRequirement: { id, name }
            }
          }) => (
            <InfoCard
              to={
                status === ComplianceLevel.Compliant
                  ? `/${organizationId}/training-compliance/assigned-employees/${employeeId}/training/${employeeTrainingRequirementId}`
                  : undefined
              }
              key={id}
              cardType={
                organizationId
                  ? t('trainingCompliance.common.customTraining', 'Custom Training')
                  : t('trainingCompliance.common.standardTraining', 'Standard Training')
              }
              variant={organizationId ? 'customTraining' : 'standardTraining'}
              name={name}
              subtitle={
                <Typography
                  style={{
                    color:
                      status === ComplianceLevel.Compliant ? theme.palette.secondary.main : theme.palette.error.main,
                    fontWeight: 'bold'
                  }}
                >
                  {status === ComplianceLevel.Compliant
                    ? t('trainingCompliance.common.compliant', 'Compliant')
                    : t('trainingCompliance.common.nonCompliant', 'Noncompliant')}
                </Typography>
              }
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
            'trainingCompliance.common.noTrainingRequirementsAssigned',
            'No training requirements have been assigned'
          )}
        />
      )}
    </React.Fragment>
  );
};

export const ClientAssignedEmployeeTrainingRequirementsComponent = withTheme(
  withRouter(ClientAssignedEmployeeTrainingRequirements)
);
