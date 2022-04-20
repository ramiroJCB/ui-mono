import * as React from 'react';
import { connect } from 'react-redux';
import { ConnectionStatus, ISearchContractorsForm } from 'interfaces/searchContractorsForm';
import { connectionStatuses, employeeCounts } from '../components/SearchFilters';
import { distances, SearchContractorsFormComponent } from '../components/SearchContractorsForm';
import { fetchSearchResults } from '../actions/fetchSearchResults';
import { parse, stringify } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { USAStates } from '@pec/aion-ui-core/constants/USAStates';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => state.searchResults;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  fetchSearchResults: (values: ISearchContractorsForm) => dispatch(fetchSearchResults(values))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

type QueryStringParams = {
  [key: string]: string;
};

class SearchContractorsForm extends React.Component<Props> {
  componentDidMount() {
    const {
      fetchSearchResults,
      location: { search },
      values: { keyword, city, state, distance }
    } = this.props;
    const requiredFields = keyword && city && state?.value && distance?.value;

    if (search && !requiredFields) {
      fetchSearchResults(this.getValues());
    }
  }

  onSubmit = (values: ISearchContractorsForm) => {
    const filters =
      values.filters &&
      Object.entries(values.filters).reduce(
        (filters, [key, value]) => ({ ...filters, [key]: value ? value.value.toString() : '' }),
        {}
      );

    this.props.history.push({
      search: stringify({
        keyword: values.keyword,
        city: values.city,
        state: values.state?.value || '',
        distance: values.distance?.value ? values.distance.value.toString() : '>500',
        ...filters
      })
    });

    return this.props.fetchSearchResults(values);
  };

  getValues() {
    const {
      location: { search }
    } = this.props;
    const {
      keyword,
      city,
      state,
      distance,
      employeeCount,
      naicsCode,
      tag,
      businessUnit,
      predictiveRanking,
      connectionStatus
    } = parse(search) as QueryStringParams;
    const { Connected, NotConnected } = ConnectionStatus;

    const values: ISearchContractorsForm = {
      keyword: keyword || '',
      city: city || '',
      state: USAStates.find(({ value }) => value === state),
      distance: distances.find(({ value }) => (distance === '>500' ? value === '' : value === parseInt(distance))),
      filters: {
        employeeCount: employeeCount ? employeeCounts.find(({ value }) => value === employeeCount) : undefined,
        naicsCode: naicsCode ? { value: naicsCode, label: naicsCode } : undefined,
        tag: tag ? { value: tag, label: tag } : undefined,
        businessUnit:
          businessUnit && connectionStatus !== NotConnected ? { value: businessUnit, label: businessUnit } : undefined,
        predictiveRanking: predictiveRanking ? { value: predictiveRanking, label: predictiveRanking } : undefined,
        connectionStatus: connectionStatus
          ? connectionStatuses.find(({ value }) => value === connectionStatus)
          : businessUnit
          ? { value: Connected, label: 'Connected' }
          : undefined
      }
    };

    return values;
  }

  render() {
    const {
      totalCount,
      values,
      searchFilters,
      location: { search }
    } = this.props;
    const { employeeCount, naicsCode, tag, businessUnit, predictiveRanking, connectionStatus } = parse(
      search
    ) as QueryStringParams;

    return (
      <SearchContractorsFormComponent
        returnValues={values}
        totalCount={totalCount}
        initialValues={this.getValues()}
        onSubmit={this.onSubmit}
        searchFilters={searchFilters}
        isFiltered={Boolean(employeeCount || naicsCode || tag || businessUnit || predictiveRanking || connectionStatus)}
      />
    );
  }
}

export const SearchContractorsFormContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchContractorsForm)
);
