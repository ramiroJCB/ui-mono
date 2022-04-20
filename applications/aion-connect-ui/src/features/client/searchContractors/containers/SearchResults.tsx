import * as React from 'react';
import { connect } from 'react-redux';
import { fetchSearchResultLogoIfNeeded } from '../actions/fetchSearchResultLogo';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { SearchResultsComponent } from '../components/SearchResults';
import { ThunkDispatch } from 'redux-thunk';

const mapStateToProps = (state: RootState) => state.searchResults;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  fetchSearchResultLogoIfNeeded: (organizationId: string) => dispatch(fetchSearchResultLogoIfNeeded(organizationId))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class SearchResults extends React.Component<Props> {
  render() {
    const { isFetching, error, totalCount, searchResults, fetchSearchResultLogoIfNeeded } = this.props;

    return (
      <SearchResultsComponent
        isFetching={isFetching}
        error={error}
        totalCount={totalCount}
        searchResults={searchResults}
        fetchSearchResultLogoIfNeeded={fetchSearchResultLogoIfNeeded}
      />
    );
  }
}

export const SearchResultsContainer = connect(mapStateToProps, mapDispatchToProps)(SearchResults);
