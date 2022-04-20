import * as React from 'react';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchSiteIfNeeded } from 'actions/fetchSite';
import { fetchWorkGroups } from '@pec/aion-ui-core/actions/fetchWorkGroups';
import { hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { NavContainer } from './Nav';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { SiteInfoComponent } from 'components/SiteInfo';
import { ThunkDispatch } from 'redux-thunk';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type RouteParams = {
  organizationId: string;
  siteId: string;
};

const mapStateToProps = ({
  serverTokens: { gmapsIsLoaded },
  site: { site, isFetching: isFetchingSite, error: siteError },
  workGroups: { isFetching: isFetchingWorkgroups, workGroups },
  userInfo: { userInfo }
}: RootState) => ({
  gmapsIsLoaded,
  site,
  isFetching: isFetchingSite || isFetchingWorkgroups,
  workGroups,
  error: siteError,
  userInfo
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, siteId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchSiteIfNeeded: () => dispatch(fetchSiteIfNeeded(organizationId, siteId)),
  fetchWorkGroups: () => dispatch(fetchWorkGroups(organizationId, null))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class SiteInfo extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.props.fetchSiteIfNeeded();
    this.fetchSiteInfoIfAllowed();
  }

  componentDidUpdate({ userInfo: prevUserInfo }: Props) {
    const { userInfo, workGroups } = this.props;
    if (prevUserInfo === null && userInfo !== null && workGroups === null) {
      this.fetchSiteInfoIfAllowed();
    }
  }

  fetchSiteInfoIfAllowed = () => {
    const { userInfo, fetchWorkGroups } = this.props;
    if (hasPermission(userInfo, ActivityAction.Read, ActivityResourceName.TrainingComplianceWorkGroups)) {
      fetchWorkGroups();
    }
  };

  render() {
    const { gmapsIsLoaded, site, isFetching, error, workGroups, t } = this.props;
    return (
      <NavContainer title={t('smart.common.site', 'Site')}>
        {gmapsIsLoaded && site && !isFetching ? (
          <SiteInfoComponent site={site} workgroups={workGroups} />
        ) : error ? (
          <Error />
        ) : (
          <Loading />
        )}
      </NavContainer>
    );
  }
}

export const SiteInfoContainer = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(SiteInfo));
