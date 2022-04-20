import * as React from 'react';
import ManageUserActivities from 'components/ManageUserActivities';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchActivityResourcesIfNeeded } from 'actions/activityResources';
import { fetchUserActivitiesIfNeeded } from 'actions/fetchUserActivities';
import { fetchUserIfNeeded } from 'actions/user';
import { IActivityResource } from 'interfaces/activityResource';
import { IUserActivityMap } from 'interfaces/userActivity';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { mapUserActivities, orderedActions, unmapUserActivities } from 'helpers/userActivities';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { updateUserActivities } from 'actions/updateUserActivities';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';

type OwnProps = {
  match: {
    params: {
      userId: string;
      activityType: UserInfoActivitiesType;
      scopeId?: string;
    };
  };
};

const mapStateToProps = ({
  user: { user, isFetching: isFetchingUser, error: userError },
  userActivities: { userActivities, isFetching: isFetchingUserActivities, error: userActivitiesError },
  activityResources: { activityResources, isFetching: isFetchingActivityResources, error: activityResourcesError }
}: RootState) => ({
  user,
  userActivityMap: userActivities && mapUserActivities(userActivities),
  activityResources,
  isFetching: isFetchingActivityResources || isFetchingUser || isFetchingUserActivities,
  error: userError || userActivitiesError || activityResourcesError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { userId, activityType, scopeId }
    }
  }: OwnProps
) => ({
  fetchActivityResourcesIfNeeded: () => dispatch(fetchActivityResourcesIfNeeded()),
  fetchUserActivitiesIfNeeded: () => dispatch(fetchUserActivitiesIfNeeded(userId, activityType, scopeId)),
  fetchUserIfNeeded: () => dispatch(fetchUserIfNeeded(userId)),
  updateUserActivities: (userActivityMap: IUserActivityMap, activityResources: IActivityResource[]) =>
    dispatch(
      updateUserActivities(userId, activityType, scopeId, unmapUserActivities(userActivityMap), activityResources)
    )
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class ManageUserActivitiesContainer extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchActivityResourcesIfNeeded();
    this.props.fetchUserActivitiesIfNeeded();
    this.props.fetchUserIfNeeded();
  }

  onSubmit = async (userActivityMap: IUserActivityMap, activityResources: IActivityResource[]) => {
    await this.props.updateUserActivities(userActivityMap, activityResources);
  };

  render() {
    const {
      user,
      userActivityMap,
      activityResources,
      isFetching,
      error,
      match: {
        params: { activityType, scopeId }
      }
    } = this.props;

    return user && userActivityMap && activityResources && !isFetching ? (
      <ManageUserActivities
        user={user}
        userActivityMap={userActivityMap}
        activityResources={activityResources}
        isFetching={isFetching}
        orderedActions={orderedActions}
        activityType={activityType}
        scopeId={scopeId}
        onSubmit={this.onSubmit}
      />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUserActivitiesContainer);
