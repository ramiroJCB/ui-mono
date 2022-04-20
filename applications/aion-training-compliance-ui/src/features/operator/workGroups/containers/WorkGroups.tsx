import * as React from 'react';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { connect } from 'react-redux';
import { fetchUserInfoIfNeeded, hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { fetchWorkGroups } from '@pec/aion-ui-core/actions/fetchWorkGroups';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';
import { WorkGroupsComponent } from '../components/WorkGroups';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = ({
  userInfo: { userInfo, isFetching: isFetchingUserInfo, error: userInfoError },
  workGroups: { isFetchingInitial: isFetchingInitialWorkGroups, workGroups, totalCount, error: workGroupsError }
}: RootState) => ({
  isFetching: isFetchingUserInfo || isFetchingInitialWorkGroups,
  workGroups,
  totalCount,
  userInfo,
  error: userInfoError || workGroupsError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchWorkGroups: (top: number = 0, skip: number = 0) =>
    dispatch(fetchWorkGroups(organizationId, top, skip, parse(search).name)),
  fetchUserInfoIfNeeded: () => dispatch(fetchUserInfoIfNeeded())
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  WithEnhancedRouterProps;

class WorkGroups extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchWorkGroups();
    props.fetchUserInfoIfNeeded();
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

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      fetchWorkGroups,
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      fetchWorkGroups();
    }
  }

  handleSearch = (searchText: string) => this.props.handleQueryParamChange('name', searchText);

  render() {
    const {
      workGroups,
      error,
      totalCount,
      fetchWorkGroups,
      isFetching,
      location: { search }
    } = this.props;

    return (
      <WorkGroupsComponent
        isFetchingInitial={isFetching}
        error={error}
        workGroups={workGroups}
        totalCount={totalCount}
        searchValue={parse(search).name || ''}
        handleSearch={this.handleSearch}
        fetchWorkGroups={fetchWorkGroups}
        hasGlobalPermission={this.hasGlobalPermission}
        hasOrganizationPermission={this.hasOrganizationPermission}
      />
    );
  }
}

export const WorkGroupsContainer = withEnhancedRouter(connect(mapStateToProps, mapDispatchToProps)(WorkGroups));
