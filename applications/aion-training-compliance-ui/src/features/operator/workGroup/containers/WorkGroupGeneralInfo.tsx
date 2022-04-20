import * as React from 'react';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { connect } from 'react-redux';
import { deleteWorkGroup } from '../actions/deleteWorkGroup';
import { editWorkGroup } from '../actions/editWorkGroup';
import { fetchUserInfoIfNeeded, hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { fetchWorkGroupIfNeeded } from '../actions/fetchWorkGroup';
import { fetchWorkGroupsForValidation } from '@pec/aion-ui-core/actions/fetchWorkGroups';
import { FormApi } from 'final-form';
import { IWorkGroup } from '@pec/aion-ui-core/interfaces/workGroup';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';
import { WorkGroupGeneralInfoComponent } from '../components/WorkGroupGeneralInfo';

type RouteParams = {
  organizationId: string;
  workGroupId: string;
};

const mapStateToProps = ({
  userInfo: { userInfo, isFetching: isFetchingUserInfo, error: userInfoError },
  workGroup: { workGroup, isFetching: isFetchingWorkGroup, error: workGroupError }
}: RootState) => ({
  isFetching: isFetchingUserInfo || isFetchingWorkGroup,
  workGroup,
  userInfo,
  error: userInfoError || workGroupError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, workGroupId }
    },
    history
  }: RouteComponentProps<RouteParams>
) => ({
  fetchWorkGroupIfNeeded: () => dispatch(fetchWorkGroupIfNeeded(workGroupId)),
  fetchWorkGroupsForValidation: (name: string) => dispatch(fetchWorkGroupsForValidation(organizationId, name)),
  editWorkGroup: (values: IWorkGroup) => dispatch(editWorkGroup(workGroupId, values)),
  fetchUserInfoIfNeeded: () => dispatch(fetchUserInfoIfNeeded()),
  deleteWorkGroup: (workGroupId: string) => () => dispatch(deleteWorkGroup(history, organizationId, workGroupId)),
  organizationId
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class WorkGroupGeneralInfo extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchWorkGroupIfNeeded();
    props.fetchUserInfoIfNeeded();
  }

  componentDidUpdate() {
    this.redirectIfDeleted();
  }

  redirectIfDeleted() {
    const {
      workGroup,
      history,
      match: {
        params: { organizationId }
      }
    } = this.props;

    if (workGroup && workGroup.isDeleted) {
      history.replace(`/${organizationId}/training-compliance/work-groups`);
    }
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

  onSubmit = async (values: IWorkGroup, form: FormApi<IWorkGroup>) => {
    await this.props.editWorkGroup(values);
    form.reset();
  };

  render() {
    const { workGroup, isFetching, error, fetchWorkGroupsForValidation, deleteWorkGroup } = this.props;

    return (
      <WorkGroupGeneralInfoComponent
        isFetching={isFetching}
        error={error}
        workGroup={workGroup}
        onSubmit={this.onSubmit}
        fetchWorkGroupsForValidation={fetchWorkGroupsForValidation}
        hasGlobalPermission={this.hasGlobalPermission}
        hasOrganizationPermission={this.hasOrganizationPermission}
        deleteWorkGroup={deleteWorkGroup}
      />
    );
  }
}

export const WorkGroupGeneralInfoContainer = connect(mapStateToProps, mapDispatchToProps)(WorkGroupGeneralInfo);
