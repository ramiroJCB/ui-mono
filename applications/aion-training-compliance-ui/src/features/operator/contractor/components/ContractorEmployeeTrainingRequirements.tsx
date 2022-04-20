import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { ComplianceLevel } from 'interfaces/complianceLevel';
import { ContractorEmployeeTrainingRequirementsHeaderContainer } from '../containers/ContractorEmployeeTrainingRequirementsHeader';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Message } from 'components/Message';
import { IClientAssignedEmployeeTrainingRequirement } from 'interfaces/clientAssignedEmployeeTrainingRequirement';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { WithTheme, withTheme } from '@material-ui/core/styles';
import { Search } from 'components/Search';
import { InfiniteCardGrid } from 'components/InfiniteCardGrid';
import { Typography } from '@material-ui/core';
import { InfoCard } from 'components/InfoCard';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  contractorId?: string;
};

type OwnProps = {
  isFetchingInitial: boolean;
  error: DeepReadonly<AxiosError> | null;
  employeeTrainingRequirements: DeepReadonly<IClientAssignedEmployeeTrainingRequirement[]>;
  totalCount: number;
  searchValue: string | string[];
  handleSearch: (searchText: string) => void;
  fetchContractorEmployeeTrainingRequirements: (
    top: number,
    skip: number
  ) => Promise<IClientAssignedEmployeeTrainingRequirement[]>;
};

type Props = WithTheme & RouteComponentProps<RouteParams> & OwnProps;

const EmployeeTrainingRequirements: React.FC<Props> = ({
  isFetchingInitial,
  error,
  employeeTrainingRequirements,
  totalCount,
  searchValue,
  handleSearch,
  fetchContractorEmployeeTrainingRequirements,
  theme,
  match: {
    params: { contractorId }
  }
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <ContractorEmployeeTrainingRequirementsHeaderContainer />
      {(searchValue || totalCount > 0) && (
        <GridContainer justify="flex-end">
          <Grid item xs={12} md={3}>
            <Search handleSearch={handleSearch} searchValue={searchValue} />
          </Grid>
        </GridContainer>
      )}
      {totalCount > 0 && !error ? (
        <InfiniteCardGrid
          items={employeeTrainingRequirements}
          totalCount={totalCount}
          fetchItems={fetchContractorEmployeeTrainingRequirements}
          subtitle
        >
          {({
            item: {
              status,
              employeeId,
              employeeTrainingRequirementId,
              trainingRequirement: { id, name, organizationId }
            }
          }) => (
            <InfoCard
              to={
                status === ComplianceLevel.Compliant
                  ? !!contractorId
                    ? `/${organizationId}/training-compliance/contractors/${contractorId}/assigned-employees/${employeeId}/training/${employeeTrainingRequirementId}`
                    : `/${organizationId}/training-compliance/assigned-employees/${employeeId}/training/${employeeTrainingRequirementId}`
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

export const ContractorEmployeeTrainingRequirementsComponent = withTheme(withRouter(EmployeeTrainingRequirements));
