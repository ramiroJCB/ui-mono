import * as React from 'react';
import { AxiosError } from 'axios';
import { ContractorHeaderContainer } from '../containers/ContractorHeader';
import { DeepReadonly } from 'utility-types';
import { Error } from '@pec/aion-ui-components/components/Error';
import { InfiniteCardGrid } from 'components/InfiniteCardGrid';
import { InfoCard } from 'components/InfoCard';
import { IWorkGroupJobTypeEmployee } from 'interfaces/workGroupJobTypeEmployee';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Message } from 'components/Message';
import { Typography } from '@material-ui/core';
import { formatCompliancePercentage } from 'helpers/formatCompliancePercentage';
import { assignComplianceColor, getComplianceLevel } from 'helpers/assignComplianceColor';
import { WithTheme, withTheme } from '@material-ui/core/styles';
import { Trans, useTranslation } from 'react-i18next';

type OwnProps = {
  isFetchingInitial: boolean;
  contractorEmployees: DeepReadonly<IWorkGroupJobTypeEmployee[]>;
  error: DeepReadonly<AxiosError> | null;
  totalCount: number;
  fetchContractorEmployees: () => Promise<IWorkGroupJobTypeEmployee[]>;
};

type Props = WithTheme & OwnProps;

const ContractorEmployees: React.FC<Props> = ({
  isFetchingInitial,
  error,
  totalCount,
  contractorEmployees,
  fetchContractorEmployees,
  theme
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <ContractorHeaderContainer />

      {totalCount > 0 && !error ? (
        <InfiniteCardGrid
          items={contractorEmployees}
          totalCount={totalCount}
          fetchItems={fetchContractorEmployees}
          subtitle
        >
          {({
            item: {
              id,
              employeeName,
              compliantTrainingPercentage,
              totalTrainingCount,
              organizationId,
              contractorId,
              employeeId
            }
          }) => {
            const percentage = formatCompliancePercentage(compliantTrainingPercentage);
            const complianceLevel = getComplianceLevel(percentage);
            const color = assignComplianceColor(theme, complianceLevel);

            return (
              <InfoCard
                key={id}
                to={`/${organizationId}/training-compliance/contractors/${contractorId}/assigned-employees/${employeeId}`}
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
      ) : !isFetchingInitial && totalCount === 0 ? (
        <Message message={t('trainingCompliance.common.noSearchResultsFound', 'No search results found')} />
      ) : isFetchingInitial ? (
        <Loading />
      ) : (
        <Message message={t('trainingCompliance.common.noEmployeesAssigned', 'No employees have been assigned')} />
      )}
    </React.Fragment>
  );
};

export const ContractorEmployeesComponent = withTheme(ContractorEmployees);
