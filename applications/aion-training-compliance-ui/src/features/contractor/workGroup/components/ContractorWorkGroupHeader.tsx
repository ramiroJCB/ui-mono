import * as React from 'react';
import { DeepReadonly } from 'ts-essentials';
import { Header } from 'components/Header';
import { IWorkGroupContractor } from 'interfaces/workGroupContractor';
import { RouteComponentProps, withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupContractorId: string;
};

type OwnProps = {
  workGroupContractor: DeepReadonly<IWorkGroupContractor> | null;
  isFetching: boolean;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const ContractorWorkGroupHeaderComponent: React.FC<Props> = ({
  match: {
    params: { organizationId, clientId, workGroupContractorId }
  },
  workGroupContractor,
  isFetching
}) => {
  const { t } = useTranslation();

  return (
    <Header
      item={workGroupContractor}
      isFetching={isFetching}
      toolbarLinks={[
        {
          label: t('trainingCompliance.contractor.workGroup.assignedJobTypes', 'Assigned Job Types'),
          to: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}`
        },
        {
          label: t('trainingCompliance.common.generalInfo', 'General Info'),
          to: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/general-info`
        }
      ]}
    >
      {({ workGroupName }) => workGroupName}
    </Header>
  );
};

export const ContractorWorkGroupHeader = withRouter(ContractorWorkGroupHeaderComponent);
