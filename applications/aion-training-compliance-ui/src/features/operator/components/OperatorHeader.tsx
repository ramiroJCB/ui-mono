import * as React from 'react';
import { Header } from 'components/Header';
import { RouteComponentProps, withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
};

const OperatorHeaderComponent: React.FC<RouteComponentProps<RouteParams>> = ({
  match: {
    params: { organizationId }
  }
}) => {
  const { t } = useTranslation();

  return (
    <Header
      title={t('trainingCompliance.common.trainingCompliance', 'Training Compliance')}
      toolbarLinks={[
        {
          label: t('trainingCompliance.common.workGroups', 'Work Groups'),
          to: `/${organizationId}/training-compliance/work-groups`
        },
        {
          label: t('trainingCompliance.operator.allJobTypes', 'All Job Types'),
          to: `/${organizationId}/training-compliance/job-types`
        },
        {
          label: t('trainingCompliance.operator.allContractors', 'All Contractors'),
          to: `/${organizationId}/training-compliance/contractors`
        },
        {
          label: t('trainingCompliance.common.allTraining', 'All Training'),
          to: `/${organizationId}/training-compliance/training`
        },
        {
          label: t('trainingCompliance.common.allEmployees', 'All Employees'),
          to: `/${organizationId}/training-compliance/assigned-employees`
        }
      ]}
    />
  );
};

export const OperatorHeader = withRouter(OperatorHeaderComponent);
