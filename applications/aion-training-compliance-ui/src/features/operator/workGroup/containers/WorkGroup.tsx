import * as React from 'react';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { connect } from 'react-redux';
import { fetchUserInfoIfNeeded, hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { fetchWorkGroupJobTypes } from 'features/operator/workGroupJobTypes/actions/fetchWorkGroupJobTypes';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';
import { WorkGroupComponent } from '../components/WorkGroup';

type RouteParams = {
  organizationId: string;
  workGroupId: string;
};

const mapStateToProps = ({
  userInfo: { userInfo, isFetching: isFetchingUserInfo, error: userInfoError },
  workGroupJobTypes: {
    isFetchingInitial: isFetchingInitialWorkGroupJobTypes,
    workGroupJobTypes,
    totalCount,
    error: workGroupTypeError
  }
}: RootState) => ({
  isFetching: isFetchingUserInfo || isFetchingInitialWorkGroupJobTypes,
  workGroupJobTypes,
  totalCount,
  userInfo,
  error: userInfoError || workGroupTypeError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    location: { search },
    match: {
      params: { workGroupId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchWorkGroupJobTypes: (top: number = 0, skip: number = 0) =>
    dispatch(fetchWorkGroupJobTypes(workGroupId, top, skip, parse(search).jobTypeName)),
  fetchUserInfoIfNeeded: () => dispatch(fetchUserInfoIfNeeded())
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  WithEnhancedRouterProps;

class WorkGroup extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchWorkGroupJobTypes();
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
      fetchWorkGroupJobTypes,
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      fetchWorkGroupJobTypes();
    }
  }

  handleSearch = (searchText: string) => this.props.handleQueryParamChange('jobTypeName', searchText);

  render() {
    const {
      workGroupJobTypes,
      fetchWorkGroupJobTypes,
      isFetching,
      error,
      totalCount,
      location: { search }
    } = this.props;

    return (
      <WorkGroupComponent
        isFetching={isFetching}
        error={error}
        workGroupJobTypes={workGroupJobTypes}
        totalCount={totalCount}
        searchValue={parse(search).jobTypeName || ''}
        handleSearch={this.handleSearch}
        fetchWorkGroupJobTypes={fetchWorkGroupJobTypes}
        hasGlobalPermission={this.hasGlobalPermission}
        hasOrganizationPermission={this.hasOrganizationPermission}
      />
    );
  }
}

export const WorkGroupContainer = withEnhancedRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WorkGroup)
);
