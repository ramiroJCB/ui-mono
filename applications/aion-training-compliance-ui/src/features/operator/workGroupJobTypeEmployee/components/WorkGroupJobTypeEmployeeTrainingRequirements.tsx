import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Header } from 'components/Header';
import { InfiniteCardGrid } from 'components/InfiniteCardGrid';
import { InfoCard } from 'components/InfoCard';
import { IWorkGroupJobTypeEmployee } from 'interfaces/workGroupJobTypeEmployee';
import { IWorkGroupJobTypeEmployeeTraining } from '@pec/aion-ui-core/interfaces/workGroupJobTypeEmployeeTraining';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Message } from 'components/Message';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Search } from 'components/Search';
import { withTheme, WithTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  workGroupId: string;
  workGroupJobTypeId: string;
  workGroupJobTypeContractorId: string;
  workGroupJobTypeEmployeeId: string;
};

type OwnProps = {
  isFetchingWorkGroupJobTypeEmployee: boolean;
  isFetchingInitialEmployeeTraining: boolean;
  error: DeepReadonly<AxiosError> | null;
  workGroupJobTypeEmployee: DeepReadonly<IWorkGroupJobTypeEmployee> | null;
  workGroupJobTypeEmployeeTraining: DeepReadonly<IWorkGroupJobTypeEmployeeTraining[]>;
  totalCount: number;
  searchValue: string | string[];
  handleSearch: (searchText: string) => void;
  fetchWorkGroupJobTypeEmployeeTraining: (top: number, skip: number) => Promise<IWorkGroupJobTypeEmployeeTraining[]>;
};

type Props = WithTheme & RouteComponentProps<RouteParams> & OwnProps;

const WorkGroupJobTypeEmployeeTraining: React.FC<Props> = ({
  isFetchingWorkGroupJobTypeEmployee,
  isFetchingInitialEmployeeTraining,
  error,
  workGroupJobTypeEmployee,
  workGroupJobTypeEmployeeTraining,
  totalCount,
  searchValue,
  handleSearch,
  fetchWorkGroupJobTypeEmployeeTraining,
  theme,
  match: {
    params: {
      organizationId,
      workGroupJobTypeEmployeeId,
      workGroupJobTypeContractorId,
      workGroupId,
      workGroupJobTypeId
    }
  }
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Header
        item={workGroupJobTypeEmployee}
        isFetching={isFetchingWorkGroupJobTypeEmployee}
        toolbarLinks={[
          {
            label: t('trainingCompliance.operator.workGroupJobTypeEmployee.training', 'Training'),
            to: `/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}/contractors/${workGroupJobTypeContractorId}/employees/${workGroupJobTypeEmployeeId}`
          }
        ]}
      >
        {({ employeeName }) => employeeName}
      </Header>
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
              jobTypeTrainingRequirementId,
              trainingRequirementName,
              isCompliant,
              trainingRequirement,
              employeeTrainingRequirementId
            }
          }) => (
            <InfoCard
              to={
                isCompliant
                  ? `/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}/contractors/${workGroupJobTypeContractorId}/employees/${workGroupJobTypeEmployeeId}/training/${employeeTrainingRequirementId}`
                  : undefined
              }
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
      ) : !isFetchingInitialEmployeeTraining && searchValue && totalCount === 0 ? (
        <Message message={t('trainingCompliance.common.noSearchResultsFound', 'No search results found')} />
      ) : isFetchingInitialEmployeeTraining ? (
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

export const WorkGroupJobTypeEmployeeTrainingComponent = withTheme(withRouter(WorkGroupJobTypeEmployeeTraining));
