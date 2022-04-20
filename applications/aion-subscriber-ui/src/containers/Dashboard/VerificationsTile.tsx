import * as React from 'react';
import { connect } from 'react-redux';
import { fetchSubscriptionsIfNeeded } from '@pec/aion-ui-core/actions/subscriptions';
import { fetchVerificationsIfNeeded } from 'actions/verifications';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';
import { Tile } from 'components/Tile';
import { VerificationsTileComponent } from 'components/Dashboard/VerificationsTile';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => {
  const {
    subscriptions: { subscriptions, error: subscriptionsError },
    verifications: { verifications, error: verificationsError }
  } = state;
  return {
    subscriptions,
    verifications,
    error: subscriptionsError || verificationsError
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
  fetchSubscriptionsIfNeeded: () => dispatch(fetchSubscriptionsIfNeeded(organizationId)),
  fetchVerificationsIfNeeded: () => dispatch(fetchVerificationsIfNeeded(organizationId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class VerificationsTile extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchSubscriptionsIfNeeded();
    props.fetchVerificationsIfNeeded();
  }

  render() {
    const { subscriptions, verifications, error, t } = this.props;

    return subscriptions && verifications ? (
      <VerificationsTileComponent subscriptions={subscriptions} verifications={verifications} />
    ) : (
      <Tile
        isLoading={!error}
        hasError={!!error}
        primaryText={t('subscriber.dashboard.verificationsTile.title', 'Subscription & Verifications')}
      />
    );
  }
}

export const VerificationsTileContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(VerificationsTile))
);
