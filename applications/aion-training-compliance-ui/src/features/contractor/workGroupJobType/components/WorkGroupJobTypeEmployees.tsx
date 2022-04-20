import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { assignComplianceColor, getComplianceLevel } from 'helpers/assignComplianceColor';
import { AxiosError } from 'axios';
import { ContractorWorkGroupJobTypeHeaderContainer } from '../containers/ContractorWorkGroupJobTypeHeader';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { formatCompliancePercentage } from 'helpers/formatCompliancePercentage';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { InfiniteCardGrid } from 'components/InfiniteCardGrid';
import { InfoCard } from 'components/InfoCard';
import { IWorkGroupJobTypeEmployee } from 'interfaces/workGroupJobTypeEmployee';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Message } from 'components/Message';
import { Search } from 'components/Search';
import { WithTheme, withTheme } from '@material-ui/core/styles';
import { Trans, useTranslation } from 'react-i18next';

const { Manage } = ActivityAction;
const { TrainingComplianceWorkGroupJobTypeEmployees } = ActivityResourceName;

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupContractorId: string;
  workGroupJobTypeId: string;
};

type OwnProps = {
  isFetchingInitial: boolean;
  error: DeepReadonly<AxiosError> | null;
  workGroupJobTypeEmployees: DeepReadonly<IWorkGroupJobTypeEmployee[]>;
  totalCount: number;
  searchValue: string | string[];
  handleSearch: (searchText: string) => void;
  fetchWorkGroupJobTypeEmployees: (top: number, skip: number) => Promise<IWorkGroupJobTypeEmployee[]>;
  unassignWorkGroupJobTypeEmployee: (workGroupJobTypeEmployeeId: string) => () => Promise<void>;
  hasGlobalPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
  hasOrganizationPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
};

type Props = WithTheme & OwnProps & RouteComponentProps<RouteParams>;

const WorkGroupJobTypeEmployees: React.FC<Props> = ({
  isFetchingInitial,
  error,
  workGroupJobTypeEmployees,
  totalCount,
  searchValue,
  handleSearch,
  hasGlobalPermission,
  hasOrganizationPermission,
  fetchWorkGroupJobTypeEmployees,
  unassignWorkGroupJobTypeEmployee,
  theme,
  match: {
    params: { organizationId, clientId, workGroupContractorId, workGroupJobTypeId }
  }
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <ContractorWorkGroupJobTypeHeaderContainer />
      <GridContainer justify="space-between">
        <Grid item>
          {(hasGlobalPermission(Manage, TrainingComplianceWorkGroupJobTypeEmployees) ||
            hasOrganizationPermission(Manage, TrainingComplianceWorkGroupJobTypeEmployees)) && (
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              component={Link}
              to={`/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}/add-employees`}
            >
              {t('trainingCompliance.contractor.workGroupJobType.assignEmployees', 'Assign Employees')}
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
          items={workGroupJobTypeEmployees}
          totalCount={totalCount}
          fetchItems={fetchWorkGroupJobTypeEmployees}
          subtitle
        >
          {({ item: { id, employeeName, compliantTrainingPercentage, totalTrainingCount } }) => {
            const percentage = formatCompliancePercentage(compliantTrainingPercentage);
            const complianceLevel = getComplianceLevel(percentage);
            const color = assignComplianceColor(theme, complianceLevel);

            return (
              <InfoCard
                to={`/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}/employees/${id}`}
                key={id}
                cardType={t('trainingCompliance.common.assignedEmployee', 'Assigned Employee')}
                variant="employee"
                name={employeeName}
                subtitle={
                  totalTrainingCount > 0 ? (
                    <Typography variant="body2" color="textSecondary">
                      <Trans i18nKey="trainingCompliance.common.percentageOfTrainingCompliant">
                        <span style={{ color, fontWeight: 'bold' }}>{{ percentage }}%</span> of training compliant
                      </Trans>
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      <span style={{ fontWeight: 'bold' }}>
                        {t('trainingCompliance.common.noTrainingAssigned', 'No Training Assigned')}
                      </span>
                    </Typography>
                  )
                }
                withMenu={
                  hasGlobalPermission(Manage, TrainingComplianceWorkGroupJobTypeEmployees) ||
                  hasOrganizationPermission(Manage, TrainingComplianceWorkGroupJobTypeEmployees)
                    ? true
                    : false
                }
                handleDelete={
                  hasGlobalPermission(Manage, TrainingComplianceWorkGroupJobTypeEmployees) ||
                  hasOrganizationPermission(Manage, TrainingComplianceWorkGroupJobTypeEmployees)
                    ? unassignWorkGroupJobTypeEmployee(id)
                    : undefined
                }
              />
            );
          }}
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
        <Message message={t('trainingCompliance.common.noEmployeesAssigned', 'No employees have been assigned')} />
      )}
    </React.Fragment>
  );
};

export const WorkGroupJobTypeEmployeesComponent = withTheme(withRouter(WorkGroupJobTypeEmployees));
