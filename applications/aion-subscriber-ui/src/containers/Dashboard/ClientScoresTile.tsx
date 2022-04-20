import * as React from 'react';
import { ClientScoresTileComponent } from 'components/Dashboard/ClientScoresTile';
import { connect } from 'react-redux';
import { fetchRankingsIfNeeded } from '@pec/aion-ui-core/actions/rankings';
import { getOptionsIfNeeded } from '@pec/aion-ui-core/actions/options';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';
import { Tile } from 'components/Tile';
import { toggleClientScoresTileExpandedOrganizationId } from 'actions/options';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type RouteParams = {
  organizationId: string;
};

// TODO: Do sorting in the API and simply return state.rankings here.
const mapStateToProps = ({
  rankings: { rankings, error },
  options: { clientScoresTileExpandedOrganizationIds }
}: RootState) => ({
  rankings:
    rankings &&
    rankings.map(r => ({
      isExpanded: clientScoresTileExpandedOrganizationIds.indexOf(r.organization.id) > -1,
      ...r
    })),
  error,
  clientScoresTileExpandedOrganizationIds
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchRankingsIfNeeded: () => dispatch(fetchRankingsIfNeeded(organizationId)),
  getOptionsIfNeeded: () => dispatch(getOptionsIfNeeded()),
  handleAccordionTitleClick: (organizationId: string) => () =>
    dispatch(toggleClientScoresTileExpandedOrganizationId(organizationId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class ClientScoresTile extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchRankingsIfNeeded();
    props.getOptionsIfNeeded();
  }

  render() {
    const { rankings, error, t } = this.props;

    return rankings ? (
      <ClientScoresTileComponent rankings={rankings} handleClick={this.props.handleAccordionTitleClick} />
    ) : (
      <Tile
        isLoading={!error}
        hasError={!!error}
        primaryText={t('subscriber.dashboard.clientScoresTile.title', 'Client Scores')}
      />
    );
  }
}

export const ClientScoresTileContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ClientScoresTile))
);
