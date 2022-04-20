import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Results from 'components/Results';
import SearchOrganizations from 'components/SearchOrganizations';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchOrganizationsIfNeeded } from 'actions/organizations';
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

const mapStateToProps = (state: RootState) => state.organizations;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  fetchOrganizationsIfNeeded: (searchTerm: string, page: string = '1') => {
    dispatch(fetchOrganizationsIfNeeded(decodeURIComponent(searchTerm), page));
  }
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps & I18nextProps;

class OrganizationsResultsContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    const {
      match: {
        params: { searchTerm, pageNumber }
      }
    } = props;
    props.fetchOrganizationsIfNeeded(searchTerm, pageNumber);
  }

  componentDidUpdate({
    match: {
      params: { searchTerm: prevSearchTerm, pageNumber: prevPageNumber }
    }
  }: Props) {
    const { searchTerm, pageNumber } = this.props.match.params;

    if (prevSearchTerm !== searchTerm) {
      this.props.fetchOrganizationsIfNeeded(searchTerm);
    }

    if (prevSearchTerm === searchTerm && prevPageNumber !== pageNumber) {
      this.props.fetchOrganizationsIfNeeded(searchTerm, pageNumber);
    }
  }

  render() {
    const {
      history,
      organizations,
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
      <SearchOrganizations searchTerm={searchTerm} history={history}>
        {!isFetching && !error ? (
          <Results
            results={organizations}
            cols={{
              id: t('backoffice.search.id', 'ID'),
              name: t('backoffice.search.name', 'Name'),
              veriforceOrganizationName: t('backoffice.search.veriforceOrganizationName', 'Linked VeriSource Company')
            }}
            uri="/organizations/%s"
            emptyMessage={t('backoffice.organizationResults.noOrganizations', 'No Organizations match your search')}
            activePage={pageNumber}
            pageSize={pageSize}
            totalCount={totalCount}
            pageUri="/organizations/search/%s/page/%p"
            history={history}
            searchTerm={searchTerm}
            excludeLinkInProperty={'veriforceOrganizationName'}
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
      </SearchOrganizations>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OrganizationsResultsContainer));
