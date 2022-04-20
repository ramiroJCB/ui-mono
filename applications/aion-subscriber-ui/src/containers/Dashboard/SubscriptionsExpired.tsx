import * as React from 'react';
import { connect } from 'react-redux';
import { fetchSubscriptionsIfNeeded } from '@pec/aion-ui-core/actions/subscriptions';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { SubscriptionsExpiredComponent } from 'components/Dashboard/SubscriptionsExpired';
import { SubscriptionStatus } from '@pec/aion-ui-core/interfaces/subscription';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => {
  const { subscriptions } = state.subscriptions;

  return {
    expiredSubscriptions: subscriptions
      ? subscriptions.filter(({ isExpired, status }) => isExpired || status === SubscriptionStatus.Inactive)
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
  fetchSubscriptionsIfNeeded: () => dispatch(fetchSubscriptionsIfNeeded(organizationId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class SubscriptionsExpired extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchSubscriptionsIfNeeded();
  }

  render() {
    const { expiredSubscriptions } = this.props;

    return expiredSubscriptions && expiredSubscriptions.length > 0 ? (
      <SubscriptionsExpiredComponent expiredSubscriptions={expiredSubscriptions} />
    ) : null;
  }
}

export const SubscriptionsExpiredContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SubscriptionsExpired)
);
