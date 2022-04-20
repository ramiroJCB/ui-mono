import * as React from 'react';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { connect } from 'react-redux';
import { fetchTrainings } from '../actions';
import { fetchUserInfoIfNeeded, hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { TrainingsComponent } from '../components/Trainings';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = ({
  userInfo: { userInfo, isFetching: isFetchingUserInfo, error: userInfoError },
  trainings: { isFetchingInitial: isFetchingInitialTrainings, trainings, totalCount, error: trainingsError }
}: RootState) => ({
  isFetching: isFetchingUserInfo || isFetchingInitialTrainings,
  trainings,
  totalCount,
  userInfo,
  error: userInfoError || trainingsError
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
  fetchTrainings: (top: number = 0, skip: number = 0) =>
    dispatch(fetchTrainings(organizationId, top, skip, parse(search).name)),
  fetchUserInfoIfNeeded: () => dispatch(fetchUserInfoIfNeeded())
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  WithEnhancedRouterProps;

class Trainings extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchTrainings();
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
      fetchTrainings,
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      fetchTrainings();
    }
  }

  handleSearch = (searchText: string) => this.props.handleQueryParamChange('name', searchText);

  render() {
    const {
      trainings,
      error,
      totalCount,
      fetchTrainings,
      isFetching,
      location: { search }
    } = this.props;

    return (
      <TrainingsComponent
        isFetching={isFetching}
        error={error}
        trainings={trainings}
        totalCount={totalCount}
        searchValue={parse(search).name || ''}
        handleSearch={this.handleSearch}
        fetchTrainings={fetchTrainings}
        hasGlobalPermission={this.hasGlobalPermission}
        hasOrganizationPermission={this.hasOrganizationPermission}
      />
    );
  }
}

export const TrainingsContainer = withEnhancedRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Trainings)
);
