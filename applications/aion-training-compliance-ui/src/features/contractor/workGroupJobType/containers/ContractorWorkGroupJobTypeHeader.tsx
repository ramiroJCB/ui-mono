import * as React from 'react';
import { connect } from 'react-redux';
import { fetchWorkGroupJobTypeIfNeeded } from 'features/workGroupJobType/actions/fetchWorkGroupJobType';
import { Header } from 'components/Header';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupContractorId: string;
  workGroupJobTypeId: string;
};

const mapStateToProps = (state: RootState) => state.workGroupJobType;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { workGroupJobTypeId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchWorkGroupJobTypeIfNeeded: () => dispatch(fetchWorkGroupJobTypeIfNeeded(workGroupJobTypeId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class ContractorWorkGroupJobTypeHeader extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchWorkGroupJobTypeIfNeeded();
  }

  render() {
    const {
      isFetching,
      workGroupJobType,
      match: {
        params: { organizationId, clientId, workGroupContractorId, workGroupJobTypeId }
      },
      t
    } = this.props;

    return (
      <Header
        item={workGroupJobType}
        isFetching={isFetching}
        toolbarLinks={[
          {
            label: t('trainingCompliance.common.assignedEmployees', 'Assigned Employees'),
            to: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}`
          },
          {
            label: t('trainingCompliance.common.requiredTraining', 'Required Training'),
            to: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}/training`
          },
          {
            label: t('trainingCompliance.common.generalInfo', 'General Info'),
            to: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}/general-info`
          }
        ]}
      >
        {({ jobTypeName }) => jobTypeName}
      </Header>
    );
  }
}

export const ContractorWorkGroupJobTypeHeaderContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ContractorWorkGroupJobTypeHeader))
);
