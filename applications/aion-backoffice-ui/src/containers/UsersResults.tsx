import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Results from 'components/Results';
import SearchUsers from 'components/SearchUsers';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchUsersIfNeeded } from 'actions/users';
import { History } from 'history';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type OwnProps = {
  history: History;
  match: {
    params: {
      searchTerm: string;
      pageNumber: string;
    };
  };
};

const mapStateToProps = (state: RootState) => state.users;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  fetchUsersIfNeeded: (searchTerm: string, page: string = '1') => {
    dispatch(fetchUsersIfNeeded(decodeURIComponent(searchTerm), page));
  }
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps & I18nextProps;

class UsersResultsContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    const {
      match: {
        params: { searchTerm, pageNumber }
      }
    } = props;
    props.fetchUsersIfNeeded(searchTerm, pageNumber);
  }

  componentDidUpdate({
    match: {
      params: { searchTerm: prevSearchTerm, pageNumber: prevPageNumber }
    }
  }: Props) {
    const { searchTerm, pageNumber } = this.props.match.params;

    if (prevSearchTerm !== searchTerm) {
      this.props.fetchUsersIfNeeded(searchTerm);
    }

    if (prevSearchTerm === searchTerm && prevPageNumber !== pageNumber) {
      this.props.fetchUsersIfNeeded(searchTerm, pageNumber);
    }
  }

  render() {
    const {
      history,
      users,
      match: {
        params: { searchTerm, pageNumber }
      },
      pageSize,
      totalCount,
      isFetching,
      error,
      t
    } = this.props;

    return (
      <SearchUsers searchTerm={searchTerm} history={history}>
        {!isFetching && !error ? (
          <Results
            results={users}
            cols={{
              id: t('backoffice.search.id', 'ID'),
              username: t('backoffice.search.username', 'Username'),
              email: t('backoffice.search.email', 'Email')
            }}
            uri="/users/%s"
            emptyMessage={t('backoffice.userResults.noUsers', 'No Users match your search')}
            activePage={pageNumber}
            pageSize={pageSize}
            totalCount={totalCount}
            pageUri="/users/search/%s/page/%p"
            history={history}
            searchTerm={searchTerm}
            excludeLinkInProperty={''}
          />
        ) : error ? (
          <Grid item xs={12}>
            <Error />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Loading />
          </Grid>
        )}
      </SearchUsers>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(UsersResultsContainer));
