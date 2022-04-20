import * as React from 'react';
import { connect } from 'react-redux';
import { fetchWorkGroupJobTypeEmployeeIfNeeded } from 'features/workGroupJobTypeEmployee/actions/fetchWorkGroupJobTypeEmployee';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { WorkGroupJobTypeEmployeeGeneralInfoComponent } from '../components/WorkGroupJobTypeEmployeeGeneralInfo';

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
  RouteComponentProps<RouteParams>;

class WorkGroupJobTypeEmployeeGeneralInfo extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchWorkGroupJobTypeEmployeeIfNeeded();
  }

  render() {
    const { isFetching, workGroupJobTypeEmployee, fetchError } = this.props;

    return (
      <WorkGroupJobTypeEmployeeGeneralInfoComponent
        workGroupJobTypeEmployee={workGroupJobTypeEmployee}
        isFetching={isFetching}
        error={fetchError}
      />
    );
  }
}

export const WorkGroupJobTypeEmployeeGeneralInfoContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(WorkGroupJobTypeEmployeeGeneralInfo)
);
