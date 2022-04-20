import * as React from 'react';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchSitesIfNeeded } from 'actions/sites';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { NavContainer } from './Nav';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { SitesComponent } from 'components/Sites';
import { ThunkDispatch } from 'redux-thunk';
import { fetchSiteTagsIfNeeded } from 'actions/siteTags';
import { TagsDrawer } from 'components/tagsDrawer';
import { selectTag, clearTag } from 'actions/selectTag';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = ({
  sites: { isFetching: isFetchingSites, sites, error: sitesError },
  siteTags: { isFetching: isFetchingTags, siteTags, error: tagsError, selectedSiteTags }
}: RootState) => ({
  isFetching: isFetchingSites || isFetchingTags,
  sites: !!selectedSiteTags.length
    ? sites?.filter(site => selectedSiteTags.some(tag => site.tags.includes(tag)))
    : sites,
  siteTags,
  error: sitesError || tagsError,
  selectedSiteTags
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchSitesIfNeeded: (query?: string) => dispatch(fetchSitesIfNeeded(organizationId, query)),
  fetchSiteTagsIfNeeded: () => dispatch(fetchSiteTagsIfNeeded(organizationId)),
  selectTag: (tagName: string) => dispatch(selectTag(tagName)),
  clearTag: () => dispatch(clearTag())
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

type State = {
  searchQuery: string | null;
  openDrawer: boolean;
};

class Sites extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.props.fetchSitesIfNeeded();
    this.props.fetchSiteTagsIfNeeded();
    this.state = {
      searchQuery: null,
      openDrawer: false
    };
  }

  handleSearch = (query: string) => {
    this.setState({ searchQuery: query });
    this.props.fetchSitesIfNeeded(query);
  };

  handleTagSelect = (name: string) => () => this.props.selectTag(name);

  handleDrawer = (nextState: boolean) => () => this.setState({ openDrawer: nextState });

  handleTagClear = () => this.props.clearTag();

  render() {
    const {
      sites,
      isFetching,
      error,
      match: {
        params: { organizationId }
      },
      history,
      siteTags,
      selectedSiteTags,
      t
    } = this.props;
    const { searchQuery, openDrawer } = this.state;
    return (
      <NavContainer title={t('smart.common.sites', 'Sites')}>
        {sites && !isFetching ? (
          [
            <SitesComponent
              organizationId={organizationId}
              key="sitesComponent"
              sites={sites}
              history={history}
              handleSearch={this.handleSearch}
              searchQuery={searchQuery}
              openDrawer={this.handleDrawer(true)}
              selectedTags={selectedSiteTags.length}
            />,
            <TagsDrawer
              siteTags={siteTags}
              key="tagsDrawer"
              isDrawerOpen={openDrawer}
              handleDrawerClose={this.handleDrawer(false)}
              handleTagClick={this.handleTagSelect}
              selectedTags={selectedSiteTags}
              handleTagClearClick={this.handleTagClear}
            />
          ]
        ) : error ? (
          <Error />
        ) : (
          <Loading />
        )}
      </NavContainer>
    );
  }
}

export const SitesContainer = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Sites));
