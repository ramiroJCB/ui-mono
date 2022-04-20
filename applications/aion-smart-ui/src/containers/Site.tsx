import * as React from 'react';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchSiteIfNeeded } from 'actions/fetchSite';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { NavContainer } from './Nav';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { SiteComponent } from 'components/Site';
import { ThunkDispatch } from 'redux-thunk';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type RouteParams = {
  organizationId: string;
  siteId: string;
};

const mapStateToProps = (state: RootState) => state.site;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, siteId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchSiteIfNeeded: () => dispatch(fetchSiteIfNeeded(organizationId, siteId))
});
type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class Site extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.props.fetchSiteIfNeeded();
  }

  render() {
    const { site, isFetching, error, t } = this.props;
    return (
      <NavContainer title={t('smart.titles.identifyAWorker', 'Identify a Worker')}>
        {site && !isFetching ? <SiteComponent site={site} /> : error ? <Error /> : <Loading />}
      </NavContainer>
    );
  }
}

export const SiteContainer = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Site));
