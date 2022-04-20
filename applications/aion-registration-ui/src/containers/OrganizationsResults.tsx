import * as React from 'react';
import Results from '../components/Results';
import SearchOrganizations from '../components/SearchOrganizations';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchOrganizationsIfNeeded } from '../actions/organizations';
import { History } from 'history';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RootActions } from '../combineActions';
import { RootState } from '../combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';
import { localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';

type OwnProps = {
  history: History;
  match: {
    params: {
      searchTerm: string;
    };
  };
};

const mapStateToProps = (state: RootState) => state.organizations;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  fetchOrganizationsIfNeeded: (searchTerm: string) => {
    dispatch(fetchOrganizationsIfNeeded(decodeURIComponent(searchTerm)));
  }
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps & I18nextProps;

class OrganizationsResultsContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    const {
      match: {
        params: { searchTerm }
      }
    } = props;
    props.fetchOrganizationsIfNeeded(searchTerm);
  }

  componentDidUpdate({
    match: {
      params: { searchTerm: prevSearchTerm }
    }
  }: Props) {
    const { searchTerm } = this.props.match.params;

    if (prevSearchTerm !== searchTerm) {
      this.props.fetchOrganizationsIfNeeded(searchTerm);
    }
  }

  render() {
    const {
      history,
      organizations,
      match: {
        params: { searchTerm }
      },
      numResults,
      isFetching,
      error,
      t
    } = this.props;

    return (
      <SearchOrganizations searchTerm={searchTerm} history={history}>
        {!isFetching && !error ? (
          <React.Fragment>
            <Results
              organizations={organizations}
              uri="/companies/%s/enter-your-info"
              emptyMessage={t(
                'registration.organizationResultsContainer.noOrganizationsMatchSearch',
                'No Organizations match your search'
              )}
            />

            {numResults > 0 && (
              <Typography variant="body2" style={{ marginLeft: '1em' }}>
                {numResults > 5
                  ? t('registration.organizationResultsContainer.moreResults', {
                      resultsLeft: localizeNumber(numResults - 5, t),
                      defaultValue: 'And {{resultsLeft}} more. Please refine your search to see them.'
                    })
                  : t('registration.organizationResultsContainer.resultsCount', {
                      count: numResults,
                      defaultValue_plural: 'Results',
                      defaultValue: 'Result'
                    })}
              </Typography>
            )}
          </React.Fragment>
        ) : error ? (
          <Error />
        ) : (
          <Loading />
        )}
      </SearchOrganizations>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OrganizationsResultsContainer));
