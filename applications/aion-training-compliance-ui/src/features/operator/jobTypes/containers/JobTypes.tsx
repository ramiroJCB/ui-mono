import * as React from 'react';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { connect } from 'react-redux';
import { fetchJobTypes } from '../actions';
import { fetchUserInfoIfNeeded, hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { JobTypesComponent } from '../components/JobTypes';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = ({
  userInfo: { userInfo, isFetching: isFetchingUserInfo, error: userInfoError },
  jobTypes: { isFetchingInitial: isFetchingInitialJobTypes, jobTypes, totalCount, error: jobTypesError }
}: RootState) => ({
  isFetching: isFetchingUserInfo || isFetchingInitialJobTypes,
  jobTypes,
  totalCount,
  userInfo,
  error: userInfoError || jobTypesError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    },
    location: { search }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchJobTypes: (top: number = 0, skip: number = 0) =>
    dispatch(fetchJobTypes(organizationId, top, skip, parse(search).name)),
  fetchUserInfoIfNeeded: () => dispatch(fetchUserInfoIfNeeded())
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  WithEnhancedRouterProps;

class JobTypes extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchJobTypes();
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
      fetchJobTypes,
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      fetchJobTypes();
    }
  }

  handleSearch = (searchText: string) => this.props.handleQueryParamChange('name', searchText);

  render() {
    const {
      jobTypes,
      error,
      totalCount,
      fetchJobTypes,
      isFetching,
      location: { search }
    } = this.props;

    return (
      <JobTypesComponent
        isFetching={isFetching}
        error={error}
        jobTypes={jobTypes}
        totalCount={totalCount}
        searchValue={parse(search).name || ''}
        handleSearch={this.handleSearch}
        fetchJobTypes={fetchJobTypes}
        hasGlobalPermission={this.hasGlobalPermission}
        hasOrganizationPermission={this.hasOrganizationPermission}
      />
    );
  }
}

export const JobTypesContainer = withEnhancedRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(JobTypes)
);
