import * as React from 'react';
import moment from 'moment/moment';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchReportRequest } from 'actions/report';
import { fetchSitesIfNeeded } from 'actions/sites';
import { fetchSiteTagsIfNeeded } from 'actions/siteTags';
import { formValueSelector } from 'redux-form';
import { IReportForm } from 'interfaces/reportForm';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { NavContainer } from './Nav';
import { parse, stringify, toArray } from '@pec/aion-ui-core/helpers/querystring';
import { ReportFormComponent } from 'components/ReportForm';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type RouteParams = {
  organizationId: string;
};

const selector = formValueSelector<RootState>('reportForm');

const mapStateToProps = (state: RootState, { location: { search } }: RouteComponentProps<RouteParams>) => {
  const { sites: selectedSites, tags: selectedTags } = selector(state, 'sites', 'tags');
  const {
    sites: { sites, isFetching: isFetchingSites, error: sitesError },
    siteTags: { siteTags, isFetching: isFetchingSiteTags, error: siteTagsError }
  } = state;
  const { start, end, siteIds, tags } = parse(search);

  return {
    sites,
    siteTags,
    isFetching: isFetchingSites || isFetchingSiteTags,
    initialValues: {
      start,
      end,
      sites: sites && toArray(siteIds).map(siteId => sites.find(({ id }) => id === siteId)),
      tags: siteTags && toArray(tags).map(tagName => siteTags.find(({ name }) => name === tagName))
    } as IReportForm,
    selectedSitesLength: selectedSites ? selectedSites.length : 0,
    selectedTagsLength: selectedSites ? selectedTags.length : 0,
    error: sitesError || siteTagsError
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
  fetchReportRequest: () => dispatch(fetchReportRequest()),
  fetchSitesIfNeeded: () => dispatch(fetchSitesIfNeeded(organizationId)),
  fetchSiteTagsIfNeeded: () => dispatch(fetchSiteTagsIfNeeded(organizationId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class ReportForm extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchSitesIfNeeded();
    props.fetchSiteTagsIfNeeded();
    if (!props.location.search) {
      this.redirectToToday();
    }
  }

  componentDidUpdate() {
    if (!this.props.location.search) {
      this.redirectToToday();
    }
  }

  redirectToToday = () => {
    this.props.fetchReportRequest();
    this.props.history.replace({
      search: stringify({
        start: moment()
          .startOf('day')
          .utc()
          .format(),
        end: moment()
          .endOf('day')
          .utc()
          .format(),
        page: '1'
      })
    });
  };

  onSubmit = ({ start, end, sites, tags }: IReportForm) =>
    new Promise<void>(resolve => {
      this.props.history.push({
        search: stringify({
          start,
          end,
          siteIds: sites.map(s => s.id),
          tags: tags.map(t => t.name),
          page: '1'
        })
      });
      resolve();
    });

  render() {
    const {
      sites,
      siteTags,
      isFetching,
      initialValues,
      selectedSitesLength,
      selectedTagsLength,
      error,
      location: { search },
      t
    } = this.props;

    return (
      <NavContainer title={t('smart.titles.report', 'Report')}>
        {!isFetching && sites && siteTags ? (
          <ReportFormComponent
            onSubmit={this.onSubmit}
            initialValues={initialValues}
            sites={sites}
            siteTags={siteTags}
            selectedSitesLength={selectedSitesLength}
            selectedTagsLength={selectedTagsLength}
            search={search}
          />
        ) : error ? (
          <Error />
        ) : (
          <Loading />
        )}
      </NavContainer>
    );
  }
}

export const ReportFormContainer = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ReportForm));
