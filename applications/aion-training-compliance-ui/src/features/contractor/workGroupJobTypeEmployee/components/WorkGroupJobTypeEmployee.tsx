import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { ContractorWorkGroupJobTypeEmployeeHeaderContainer } from '../containers/ContractorWorkGroupJobTypeEmployeeHeader';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { InfiniteCardGrid } from 'components/InfiniteCardGrid';
import { InfoCard } from 'components/InfoCard';
import { IWorkGroupJobTypeEmployeeTraining } from '@pec/aion-ui-core/interfaces/workGroupJobTypeEmployeeTraining';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Message } from 'components/Message';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Search } from 'components/Search';
import { WithTheme, withTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupContractorId: string;
  workGroupJobTypeId: string;
  workGroupJobTypeEmployeeId: string;
};

type OwnProps = {
  isFetchingInitial: boolean;
  error: DeepReadonly<AxiosError> | null;
  workGroupJobTypeEmployeeTraining: DeepReadonly<IWorkGroupJobTypeEmployeeTraining[]>;
  totalCount: number;
  searchValue: string | string[];
  handleSearch: (searchText: string) => void;
  fetchWorkGroupJobTypeEmployeeTraining: (top: number, skip: number) => Promise<IWorkGroupJobTypeEmployeeTraining[]>;
};

type Props = OwnProps & RouteComponentProps<RouteParams> & WithTheme;

const WorkGroupJobTypeEmployee: React.FC<Props> = ({
  isFetchingInitial,
  error,
  workGroupJobTypeEmployeeTraining,
  totalCount,
  searchValue,
  handleSearch,
  fetchWorkGroupJobTypeEmployeeTraining,
  match: {
    params: { organizationId, clientId, workGroupContractorId, workGroupJobTypeId, workGroupJobTypeEmployeeId }
  },
  theme
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <ContractorWorkGroupJobTypeEmployeeHeaderContainer />
      {(searchValue || totalCount > 0) && (
        <GridContainer justify="flex-end">
          <Grid item xs={12} md={3}>
            <Search handleSearch={handleSearch} searchValue={searchValue} />
          </Grid>
        </GridContainer>
      )}
      {totalCount > 0 && !error ? (
        <InfiniteCardGrid
          items={workGroupJobTypeEmployeeTraining}
          totalCount={totalCount}
          fetchItems={fetchWorkGroupJobTypeEmployeeTraining}
          subtitle
        >
          {({
            item: {
              employeeTrainingRequirementId,
              jobTypeTrainingRequirementId,
              trainingRequirementName,
              isCompliant,
              trainingRequirement
            }
          }) => (
            <InfoCard
              to={`/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}/employees/${workGroupJobTypeEmployeeId}/training/${employeeTrainingRequirementId}`}
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
              subtitle={
                <Typography
                  style={{
                    color: isCompliant ? theme.palette.secondary.main : theme.palette.error.main,
                    fontWeight: 'bold'
                  }}
                >
                  {isCompliant
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

export const WorkGroupJobTypeEmployeeComponent = withTheme(withRouter(WorkGroupJobTypeEmployee));
