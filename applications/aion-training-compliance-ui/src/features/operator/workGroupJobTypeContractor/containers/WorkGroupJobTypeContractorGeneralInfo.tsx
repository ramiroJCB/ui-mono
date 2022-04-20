import * as React from 'react';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { connect } from 'react-redux';
import { fetchUserInfoIfNeeded, hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { fetchWorkGroupJobTypeContractorIfNeeded } from '../actions/fetchWorkGroupJobTypeContractor';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';
import { unassignWorkGroupJobTypeContractor } from '../actions/unassignWorkGroupJobTypeContractor';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';
import { WorkGroupJobTypeContractorGeneralInfoComponent } from '../components/WorkGroupJobTypeContractorGeneralInfo';

export type RouteParams = {
  organizationId: string;
  workGroupId: string;
  workGroupJobTypeId: string;
  workGroupJobTypeContractorId: string;
};

const mapStateToProps = ({
  userInfo: { userInfo, isFetching: isFetchingUserInfo, error: userInfoError },
  organization: { organization },
  workGroupJobTypeContractor: {
    workGroupJobTypeContractor,
    isFetching: isFetchingWorkGroupJobTypeContractor,
    fetchError: fetchWorkGroupJobTypeContractorError
  }
}: RootState) => ({
  isFetching: isFetchingWorkGroupJobTypeContractor || isFetchingUserInfo,
  workGroupJobTypeContractor,
  organization,
  userInfo,
  isFetchingUserInfo,
  error: userInfoError || fetchWorkGroupJobTypeContractorError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  routeProps: RouteComponentProps<RouteParams>
) => {
  const {
    match: {
      params: { workGroupJobTypeContractorId }
    }
  } = routeProps;

  return {
    fetchWorkGroupJobTypeContractorIfNeeded: () =>
      dispatch(fetchWorkGroupJobTypeContractorIfNeeded(workGroupJobTypeContractorId)),
    unassignWorkGroupJobTypeContractor: () =>
      dispatch(unassignWorkGroupJobTypeContractor(workGroupJobTypeContractorId, routeProps)),
    fetchUserInfoIfNeeded: () => dispatch(fetchUserInfoIfNeeded())
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class WorkGroupJobTypeContractorGeneralInfo extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchWorkGroupJobTypeContractorIfNeeded();
    props.fetchUserInfoIfNeeded();
    this.redirectIfDeleted();
  }

  componentDidUpdate() {
    this.redirectIfDeleted();
  }

  hasGlobalPermission = (action: ActivityAction, resourceName: ActivityResourceName) =>
    hasPermission(this.props.userInfo, action, resourceName);

  hasOrganizationPermission = (action: ActivityAction, resourceName: ActivityResourceName) => {
    const {
      userInfo,
      match: {
        params: { organizationId }
      }
    } = this.props;

    return organizationId
      ? hasPermission(userInfo, action, resourceName, [
          {
            type: UserInfoActivitiesType.Organization,
            id: organizationId
          }
        ])
      : false;
  };

  redirectIfDeleted() {
    const {
      workGroupJobTypeContractor,
      history,
      match: {
        params: { organizationId, workGroupId, workGroupJobTypeId }
      }
    } = this.props;

    if (workGroupJobTypeContractor && workGroupJobTypeContractor.isDeleted) {
      history.replace(
        `/${organizationId}/training-compliance/work-groups/${workGroupId}/job-types/${workGroupJobTypeId}`
      );
    }
  }

  render() {
    const { workGroupJobTypeContractor, isFetching, error, unassignWorkGroupJobTypeContractor } = this.props;

    return (
      <WorkGroupJobTypeContractorGeneralInfoComponent
        isFetching={isFetching}
        error={error}
        workGroupJobTypeContractor={workGroupJobTypeContractor}
        unassignWorkGroupJobTypeContractor={unassignWorkGroupJobTypeContractor}
        hasGlobalPermission={this.hasOrganizationPermission}
        hasOrganizationPermission={this.hasOrganizationPermission}
      />
    );
  }
}

export const WorkGroupJobTypeContractorGeneralInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkGroupJobTypeContractorGeneralInfo);
