import * as React from 'react';
import { connect } from 'react-redux';
import { fetchPredictiveRankingIfNeeded } from 'actions/predictiveRanking';
import { PredictiveRankingTileComponent } from 'components/Dashboard/PredictiveRankingTile';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';
import { Tile } from 'components/Tile';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = ({ predictiveRanking: { predictiveRanking, error } }: RootState) => ({
  predictiveRanking,
  error
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchPredictiveRankingIfNeeded: () => dispatch(fetchPredictiveRankingIfNeeded(organizationId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class PredictiveRankingTile extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchPredictiveRankingIfNeeded();
  }

  render() {
    const { predictiveRanking, error, t } = this.props;

    return predictiveRanking ? (
      <PredictiveRankingTileComponent
        predictiveRanking={predictiveRanking.length > 0 ? predictiveRanking[0] : undefined}
      />
    ) : (
      <Tile
        isLoading={!error}
        hasError={!!error}
        primaryText={t('subscriber.dashboard.predictiveRanking.title', 'Your PEC Predictive Ranking')}
      />
    );
  }
}

export const PredictiveRankingTileContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(PredictiveRankingTile))
);
