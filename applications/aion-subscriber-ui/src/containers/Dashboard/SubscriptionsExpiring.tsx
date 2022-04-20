import * as React from 'react';
import { connect } from 'react-redux';
import { fetchSubscriptionsIfNeeded } from '@pec/aion-ui-core/actions/subscriptions';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { SubscriptionsExpiringComponent } from 'components/Dashboard/SubscriptionsExpiring';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => {
  const { subscriptions } = state.subscriptions;

  return {
    expiringSubscriptions: subscriptions ? subscriptions.filter(({ isExpiring }) => isExpiring) : null
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
  fetchSubscriptionsIfNeeded: () => dispatch(fetchSubscriptionsIfNeeded(organizationId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class SubscriptionsExpiring extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchSubscriptionsIfNeeded();
  }

  render() {
    const { expiringSubscriptions } = this.props;

    return expiringSubscriptions && expiringSubscriptions.length > 0 ? (
      <SubscriptionsExpiringComponent expiringSubscriptions={expiringSubscriptions} />
    ) : null;
  }
}

export const SubscriptionsExpiringContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SubscriptionsExpiring)
);
