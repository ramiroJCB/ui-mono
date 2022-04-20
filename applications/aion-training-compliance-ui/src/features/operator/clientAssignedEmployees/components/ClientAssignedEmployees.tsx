import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { assignComplianceColor, getComplianceLevel } from 'helpers/assignComplianceColor';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { formatCompliancePercentage } from 'helpers/formatCompliancePercentage';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IClientAssignedEmployee } from 'interfaces/clientAssignedEmployee';
import { InfiniteCardGrid } from 'components/InfiniteCardGrid';
import { InfoCard } from 'components/InfoCard';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Message } from 'components/Message';
import { OperatorHeader } from 'features/operator/components/OperatorHeader';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Search } from 'components/Search';
import { Typography } from '@material-ui/core';
import { WithTheme, withTheme } from '@material-ui/core/styles';
import { Trans, useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  isFetchingInitial: boolean;
  error: DeepReadonly<AxiosError> | null;
  clientAssignedEmployees: DeepReadonly<IClientAssignedEmployee[]>;
  totalCount: number;
  searchValue: string | string[];
  handleSearch: (searchText: string) => void;
  fetchClientAssignedEmployees: (top: number, skip: number) => Promise<IClientAssignedEmployee[]>;
};

type Props = WithTheme & RouteComponentProps<RouteParams> & OwnProps;

const ClientAssignedEmployees: React.FC<Props> = ({
  isFetchingInitial,
  error,
  clientAssignedEmployees,
  totalCount,
  searchValue,
  handleSearch,
  fetchClientAssignedEmployees,
  theme,
  match: {
    params: { organizationId }
  }
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <OperatorHeader />
      <GridContainer justify="flex-end">
        {(searchValue || totalCount > 0) && (
          <Grid item xs={12} md={3}>
            <Search handleSearch={handleSearch} searchValue={searchValue} />
          </Grid>
        )}
      </GridContainer>
      {totalCount > 0 && !error ? (
        <InfiniteCardGrid
          items={clientAssignedEmployees}
          totalCount={totalCount}
          fetchItems={fetchClientAssignedEmployees}
          secondaryTitle
          subtitle
        >
          {({
            item: { id, employeeId, employeeName, contractorName, compliantTrainingPercentage, totalTrainingCount }
          }) => {
            const percentage = formatCompliancePercentage(compliantTrainingPercentage);
            const complianceLevel = getComplianceLevel(percentage);
            const color = assignComplianceColor(theme, complianceLevel);

            return (
              <InfoCard
                to={`/${organizationId}/training-compliance/assigned-employees/${employeeId}`}
                key={id}
                cardType={t('trainingCompliance.common.assignedEmployee', 'Assigned Employee')}
                variant="employee"
                name={employeeName}
                secondaryTitle={contractorName}
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

export const ClientAssignedEmployeesComponent = withTheme(withRouter(ClientAssignedEmployees));
