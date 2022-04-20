import * as React from 'react';
import ManageUser from 'components/ManageUser';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchOrganizationsForUserIfNeeded } from 'actions/organizationsForUser';
import { fetchUserIfNeeded } from 'actions/user';
import { History } from 'history';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RootActions } from '@pec/aion-ui-core/combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  match: {
    params: {
      userId: string;
    };
  };
  history: History;
};

const mapStateToProps = ({
  user: { user, isFetching: isFetchingUser, error: userError },
  organizationsForUser: {
    organizationsForUser,
    isFetching: isFetchingOrganizationsForUser,
    error: organizationsForUserError
  }
}: RootState) => ({
  user,
  organizationsForUser,
  isFetching: isFetchingUser || isFetchingOrganizationsForUser,
  error: userError || organizationsForUserError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { userId }
    }
  }: OwnProps
) => ({
  fetchUserIfNeeded: () => dispatch(fetchUserIfNeeded(userId)),
  fetchOrganizationsForUserIfNeeded: () => dispatch(fetchOrganizationsForUserIfNeeded(userId))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class ManageUserContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchUserIfNeeded();
    props.fetchOrganizationsForUserIfNeeded();
  }

  onSubmitOrganizationId = (event: React.FormEvent<HTMLElement>) => {
    const {
      match: {
        params: { userId }
      },
      history
    } = this.props;
    const organizationId = event.target[0].value;

    history.push(`/users/${userId}/permissions/Organization/${organizationId}`);
  };

  onSubmitUserId = (event: React.FormEvent<HTMLElement>) => {
    const {
      match: {
        params: { userId }
      },
      history
    } = this.props;
    const forUserId = event.target[0].value;

    history.push(`/users/${userId}/permissions/User/${forUserId}`);
  };

  render() {
    const { user, organizationsForUser, isFetching, error } = this.props;

    return user && organizationsForUser && !isFetching ? (
      <ManageUser
        user={user}
        organizationsForUser={organizationsForUser}
        onSubmitOrganizationId={this.onSubmitOrganizationId}
        onSubmitUserId={this.onSubmitUserId}
      />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUserContainer);
