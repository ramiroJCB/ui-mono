import * as React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { fetchVerificationsIfNeeded } from 'actions/verifications';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';
import { VerificationsExpiringComponent } from 'components/Dashboard/VerificationsExpiring';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => {
  const { verifications } = state.verifications;

  return {
    expiringVerifications: verifications
      ? verifications.filter(
          ({ expirationDate, expiringPeriodDays }) =>
            expirationDate !== null &&
            moment(expirationDate).isBetween(moment(), moment().add(expiringPeriodDays, 'days'))
        )
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

class VerificationsExpiring extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchVerificationsIfNeeded();
  }

  render() {
    const { expiringVerifications } = this.props;

    return expiringVerifications && expiringVerifications.length > 0 ? (
      <VerificationsExpiringComponent expiringVerifications={expiringVerifications} />
    ) : null;
  }
}

export const VerificationsExpiringContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VerificationsExpiring)
);
