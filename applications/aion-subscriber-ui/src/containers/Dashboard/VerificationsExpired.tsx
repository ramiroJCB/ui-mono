import * as React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { fetchVerificationsIfNeeded } from 'actions/verifications';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';
import { VerificationsExpiredComponent } from 'components/Dashboard/VerificationsExpired';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => {
  const { verifications } = state.verifications;

  return {
    expiredVerifications: verifications
      ? verifications.filter(({ expirationDate }) => expirationDate !== null && moment(expirationDate).isBefore())
      : null
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchVerificationsIfNeeded: () => dispatch(fetchVerificationsIfNeeded(organizationId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class VerificationsExpired extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchVerificationsIfNeeded();
  }

  render() {
    const { expiredVerifications } = this.props;

    return expiredVerifications && expiredVerifications.length > 0 ? (
      <VerificationsExpiredComponent expiredVerifications={expiredVerifications} />
    ) : null;
  }
}

export const VerificationsExpiredContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VerificationsExpired)
);
