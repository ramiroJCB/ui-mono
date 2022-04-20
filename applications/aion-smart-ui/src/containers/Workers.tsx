import * as React from 'react';
import withWidth, { isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchSiteIfNeeded } from 'actions/fetchSite';
import { fetchWorkersIfNeeded } from 'actions/workers';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { NavContainer } from './Nav';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { WorkersComponent } from 'components/Workers';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type RouteParams = {
  organizationId: string;
  siteId: string;
};

const mapStateToProps = ({
  site: { site, isFetching: isFetchingSite, error: siteError },
  workers: { workers, isFetching: isFetchingWorkers, error: workersError }
}: RootState) => ({
  site,
  workers,
  isFetching: isFetchingSite || isFetchingWorkers,
  error: siteError || workersError
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
  fetchWorkersIfNeeded: () => dispatch(fetchWorkersIfNeeded(organizationId, siteId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithWidth &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class Workers extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.props.fetchWorkersIfNeeded();
  }

  render() {
    const { site, workers, isFetching, error, width, t } = this.props;

    const children =
      site && workers && !isFetching ? (
        <WorkersComponent site={site} workers={workers} />
      ) : error ? (
        <Error />
      ) : (
        <Loading />
      );

    return isWidthUp('lg', width) ? (
      <React.Fragment>{children}</React.Fragment>
    ) : (
      <NavContainer title={t('smart.titles.workersOnSite', 'Workers on Site')}>{children}</NavContainer>
    );
  }
}

export const WorkersContainer = withWidth()(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Workers)))
);
