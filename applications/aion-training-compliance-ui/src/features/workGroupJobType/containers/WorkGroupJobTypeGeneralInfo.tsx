import * as React from 'react';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { connect } from 'react-redux';
import { fetchOrganizationIfNeeded } from '@pec/aion-ui-core/actions/organization';
import { fetchUserInfoIfNeeded, hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { fetchWorkGroupJobTypeIfNeeded } from '../actions/fetchWorkGroupJobType';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { unassignWorkGroupJobType } from '../actions/unassignWorkGroupJobType';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';
import { WorkGroupJobTypeGeneralInfoComponent } from '../components/WorkGroupJobTypeGeneralInfo';

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupId: string;
  workGroupJobTypeId: string;
};

const mapStateToProps = ({
  userInfo: { userInfo, isFetching: isFetchingUserInfo, error: userInfoError },
  organization: { organization },
  workGroupJobType: { workGroupJobType, isFetching: isFetchingWorkGroupJobType, fetchError: fetchWorkGroupJobTypeError }
}: RootState) => ({
  isFetching: isFetchingUserInfo || isFetchingWorkGroupJobType,
  workGroupJobType,
  userInfo,
  organization,
  error: userInfoError || fetchWorkGroupJobTypeError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, workGroupId, workGroupJobTypeId }
    },
    history
  }: RouteComponentProps<RouteParams>
) => ({
  fetchOrganizationIfNeeded: () => dispatch(fetchOrganizationIfNeeded(organizationId)),
  fetchWorkGroupJobTypeIfNeeded: () => dispatch(fetchWorkGroupJobTypeIfNeeded(workGroupJobTypeId)),
  unassignWorkGroupJobType: (workGroupJobTypeId: string) => () =>
    dispatch(unassignWorkGroupJobType(history, organizationId, workGroupId, workGroupJobTypeId)),
  fetchUserInfoIfNeeded: () => dispatch(fetchUserInfoIfNeeded())
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class WorkGroupJobTypeGeneralInfo extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchOrganizationIfNeeded();
    props.fetchWorkGroupJobTypeIfNeeded();
    props.fetchUserInfoIfNeeded();
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

  componentDidUpdate() {
    this.redirectIfDeleted();
  }

  redirectIfDeleted() {
    const {
      workGroupJobType,
      history,
      match: {
        params: { organizationId, workGroupId }
      }
    } = this.props;

    if (workGroupJobType && workGroupJobType.isDeleted) {
      history.replace(`/${organizationId}/training-compliance/work-groups/${workGroupId}`);
    }
  }

  render() {
    const { workGroupJobType, isFetching, error, organization, unassignWorkGroupJobType } = this.props;

    return (
      <WorkGroupJobTypeGeneralInfoComponent
        isFetching={isFetching}
        error={error}
        workGroupJobType={workGroupJobType}
        organization={organization}
        unassignWorkGroupJobType={unassignWorkGroupJobType}
        hasGlobalPermission={this.hasGlobalPermission}
        hasOrganizationPermission={this.hasOrganizationPermission}
      />
    );
  }
}

export const WorkGroupJobTypeGeneralInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkGroupJobTypeGeneralInfo);
