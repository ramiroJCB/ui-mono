import * as React from 'react';
import { connect } from 'react-redux';
import { fetchWorkGroupJobTypeContractorIfNeeded } from 'features/operator/workGroupJobTypeContractor/actions/fetchWorkGroupJobTypeContractor';
import { Header } from 'components/Header';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  workGroupId: string;
  workGroupJobTypeId: string;
  workGroupJobTypeContractorId: string;
};

const mapStateToProps = (state: RootState) => state.workGroupJobTypeContractor;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { workGroupJobTypeContractorId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchWorkGroupJobTypeContractorIfNeeded: () =>
    dispatch(fetchWorkGroupJobTypeContractorIfNeeded(workGroupJobTypeContractorId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class OperatorWorkGroupJobTypeContractorHeader extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchWorkGroupJobTypeContractorIfNeeded();
  }

  render() {
    const {
      isFetching,
      workGroupJobTypeContractor,
      match: {
        params: { organizationId, workGroupId, workGroupJobTypeId, workGroupJobTypeContractorId }
      },
      t
    } = this.props;

    return (
      <Header
        item={workGroupJobTypeContractor}
        isFetching={isFetching}
        toolbarLinks={[
          {
            label: t('trainingCompliance.common.assignedEmployees', 'Assigned Employees'),
            to: `/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}/contractors/${workGroupJobTypeContractorId}`
          },
          {
            label: t('trainingCompliance.common.generalInfo', 'General Info'),
            to: `/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}/contractors/${workGroupJobTypeContractorId}/general-info`
          }
        ]}
      >
        {({ contractorName }) => contractorName}
      </Header>
    );
  }
}

export const OperatorWorkGroupJobTypeContractorHeaderContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OperatorWorkGroupJobTypeContractorHeader))
);
