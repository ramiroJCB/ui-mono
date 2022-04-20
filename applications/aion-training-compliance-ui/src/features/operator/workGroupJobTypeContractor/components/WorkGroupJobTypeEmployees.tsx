import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { assignComplianceColor, getComplianceLevel } from 'helpers/assignComplianceColor';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { formatCompliancePercentage } from 'helpers/formatCompliancePercentage';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { InfiniteCardGrid } from 'components/InfiniteCardGrid';
import { InfoCard } from 'components/InfoCard';
import { IOperatorWorkGroupJobTypeContractor } from 'interfaces/operatorWorkGroupJobTypeContractor';
import { IWorkGroupJobTypeEmployee } from 'interfaces/workGroupJobTypeEmployee';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Message } from 'components/Message';
import { OperatorWorkGroupJobTypeContractorHeaderContainer } from '../containers/OperatorWorkGroupJobTypeContractorHeader';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Search } from 'components/Search';
import { WithTheme, withTheme } from '@material-ui/core/styles';
import { Trans, useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  workGroupId: string;
  workGroupJobTypeId: string;
  workGroupJobTypeContractorId: string;
};

type OwnProps = {
  isFetchingInitial: boolean;
  error: DeepReadonly<AxiosError> | null;
  workGroupJobTypeEmployees: DeepReadonly<IWorkGroupJobTypeEmployee[]>;
  totalCount: number;
  workGroupJobTypeContractor: DeepReadonly<IOperatorWorkGroupJobTypeContractor> | null;
  searchValue: string | string[];
  handleSearch: (searchText: string) => void;
  fetchWorkGroupJobTypeEmployees: (
    contractorId: string,
    workGroupJobTypeId: string
  ) => (top: number, skip: number) => Promise<IWorkGroupJobTypeEmployee[]>;
};

type Props = WithTheme & OwnProps & RouteComponentProps<RouteParams>;

const WorkGroupJobTypeEmployees: React.FC<Props> = ({
  isFetchingInitial,
  error,
  workGroupJobTypeEmployees,
  totalCount,
  searchValue,
  handleSearch,
  workGroupJobTypeContractor,
  fetchWorkGroupJobTypeEmployees,
  theme,
  match: {
    params: { organizationId, workGroupId, workGroupJobTypeId, workGroupJobTypeContractorId }
  }
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <OperatorWorkGroupJobTypeContractorHeaderContainer />
      {(searchValue || totalCount > 0) && (
        <GridContainer justify="flex-end">
          <Grid item xs={12} md={3}>
            <Search handleSearch={handleSearch} searchValue={searchValue} />
          </Grid>
        </GridContainer>
      )}
      {totalCount > 0 && workGroupJobTypeContractor && !error ? (
        <InfiniteCardGrid
          items={workGroupJobTypeEmployees}
          totalCount={totalCount}
          fetchItems={fetchWorkGroupJobTypeEmployees(
            workGroupJobTypeContractor.contractorOrganizationId,
            workGroupJobTypeContractor.workGroupJobTypeId
          )}
          subtitle
        >
          {({ item: { id, employeeName, compliantTrainingPercentage, totalTrainingCount } }) => {
            const percentage = formatCompliancePercentage(compliantTrainingPercentage);
            const complianceLevel = getComplianceLevel(percentage);
            const color = assignComplianceColor(theme, complianceLevel);

            return (
              <InfoCard
                key={id}
                to={`/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}/contractors/${workGroupJobTypeContractorId}/employees/${id}`}
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
