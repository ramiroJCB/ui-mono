import * as React from 'react';
import { connect } from 'react-redux';
import { fetchWorkGroupJobTypeEmployeeIfNeeded } from 'features/workGroupJobTypeEmployee/actions/fetchWorkGroupJobTypeEmployee';
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
  workGroupJobTypeEmployeeId: string;
};

const mapStateToProps = (state: RootState) => state.workGroupJobTypeEmployee;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { workGroupJobTypeEmployeeId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchWorkGroupJobTypeEmployeeIfNeeded: () =>
    dispatch(fetchWorkGroupJobTypeEmployeeIfNeeded(workGroupJobTypeEmployeeId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class ContractorWorkGroupJobTypeEmployeeHeader extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchWorkGroupJobTypeEmployeeIfNeeded();
  }

  render() {
    const {
      isFetching,
      workGroupJobTypeEmployee,
      match: {
        params: { organizationId, clientId, workGroupContractorId, workGroupJobTypeId, workGroupJobTypeEmployeeId }
      },
      t
    } = this.props;

    return (
      <Header
        item={workGroupJobTypeEmployee}
        isFetching={isFetching}
        toolbarLinks={[
          {
            label: t('trainingCompliance.common.requiredTraining', 'Required Training'),
            to: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}/employees/${workGroupJobTypeEmployeeId}`
          },
          {
            label: t('trainingCompliance.common.generalInfo', 'General Info'),
            to: `/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}/employees/${workGroupJobTypeEmployeeId}/general-info`
          }
        ]}
      >
        {({ employeeName }) => employeeName}
      </Header>
    );
  }
}

export const ContractorWorkGroupJobTypeEmployeeHeaderContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ContractorWorkGroupJobTypeEmployeeHeader))
);
