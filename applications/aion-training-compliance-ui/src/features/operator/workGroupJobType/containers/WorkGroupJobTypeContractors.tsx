import * as React from 'react';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { connect } from 'react-redux';
import { fetchUserInfoIfNeeded, hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { fetchWorkGroupJobTypeContractors } from '../../workGroupJobTypeContractors/actions/fetchWorkGroupJobTypeContractors';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { unassignWorkGroupJobTypeContractor } from 'features/operator/workGroupJobTypeContractor/actions/unassignWorkGroupJobTypeContractor';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';
import { WorkGroupJobTypeContractorsComponent } from '../components/WorkGroupJobTypeContractors';

type RouteParams = {
  organizationId: string;
  workGroupId: string;
  workGroupJobTypeId: string;
};

const mapStateToProps = ({
  userInfo: { userInfo, isFetching: isFetchingUserInfo, error: userInfoError },
  workGroupJobTypeContractors: {
    isFetchingInitial: isFetchingInitialWorkGroupJobTypeContractors,
    workGroupJobTypeContractors,
    totalCount,
    error: workGroupJobTypeContractorsError
  }
}: RootState) => ({
  isFetching: isFetchingUserInfo || isFetchingInitialWorkGroupJobTypeContractors,
  workGroupJobTypeContractors,
  totalCount,
  userInfo,
  error: userInfoError || workGroupJobTypeContractorsError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { workGroupJobTypeId }
    },
    location: { search }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchWorkGroupJobTypeContractors: (top: number = 0, skip: number = 0) =>
    dispatch(fetchWorkGroupJobTypeContractors(workGroupJobTypeId, top, skip, parse(search).name)),
  unassignWorkGroupJobTypeContractor: (workGroupJobTypeContractorId: string) => () =>
    dispatch(unassignWorkGroupJobTypeContractor(workGroupJobTypeContractorId)),
  fetchUserInfoIfNeeded: () => dispatch(fetchUserInfoIfNeeded())
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  WithEnhancedRouterProps;

class WorkGroupJobTypeContractors extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchWorkGroupJobTypeContractors();
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
      fetchWorkGroupJobTypeContractors,
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      fetchWorkGroupJobTypeContractors();
    }
  }

  handleSearch = (searchText: string) => this.props.handleQueryParamChange('name', searchText);

  render() {
    const {
      workGroupJobTypeContractors,
      error,
      totalCount,
      fetchWorkGroupJobTypeContractors,
      unassignWorkGroupJobTypeContractor,
      isFetching,
      location: { search }
    } = this.props;

    return (
      <WorkGroupJobTypeContractorsComponent
        isFetching={isFetching}
        error={error}
        workGroupJobTypeContractors={workGroupJobTypeContractors}
        totalCount={totalCount}
        searchValue={parse(search).name || ''}
        handleSearch={this.handleSearch}
        fetchWorkGroupJobTypeContractors={fetchWorkGroupJobTypeContractors}
        hasGlobalPermission={this.hasGlobalPermission}
        hasOrganizationPermission={this.hasOrganizationPermission}
        unassignWorkGroupJobTypeContractor={unassignWorkGroupJobTypeContractor}
      />
    );
  }
}

export const WorkGroupJobTypeContractorsContainer = withEnhancedRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WorkGroupJobTypeContractors)
);
