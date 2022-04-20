import * as React from 'react';
import { ClientIncidentsFormFiltersComponent } from '../components/ClientIncidentsFormFilters';
import { connect } from 'react-redux';
import { fetchClientIncidentCategoriesIfNeeded } from '../../clientCategories/actions/fetchClientIncidentCategories';
import { fetchClientIncidentTypesIfNeeded } from '../../clientTypes/actions/fetchClientIncidentTypes';
import { formValueSelector } from 'redux-form';
import { IClientIncidentsForm } from 'interfaces/clientIncidentsForm';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const selector = formValueSelector<RootState>('clientIncidentsForm');

const mapStateToProps = (state: RootState) => {
  const {
    clientIncidentCategories: {
      incidentCategories,
      isFetching: isFetchingIncidentCategories,
      error: incidentCategoriesError
    },
    clientIncidentTypes: { incidentTypes, isFetching: isFetchingIncidentTypes, error: incidentTypesError }
  } = state;

  const { contractors: selectedContractors, types: selectedTypes, categories: selectedCategories } = selector(
    state,
    'contractors',
    'types',
    'categories'
  ) as IClientIncidentsForm;

  return {
    incidentCategories,
    incidentTypes,
    isFetching: isFetchingIncidentCategories || isFetchingIncidentTypes,
    selectedContractorsLength: selectedContractors ? selectedContractors.length : 0,
    selectedTypesLength: selectedTypes ? selectedTypes.length : 0,
    selectedCategoriesLength: selectedCategories ? selectedCategories.length : 0,
    error: incidentCategoriesError || incidentTypesError
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
  fetchClientIncidentTypesIfNeeded: () => dispatch(fetchClientIncidentTypesIfNeeded(organizationId)),
  fetchClientIncidentCategoriesIfNeeded: () => dispatch(fetchClientIncidentCategoriesIfNeeded(organizationId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class ClientIncidentsFormFilters extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClientIncidentTypesIfNeeded();
    props.fetchClientIncidentCategoriesIfNeeded();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      this.props.fetchClientIncidentTypesIfNeeded();
      this.props.fetchClientIncidentCategoriesIfNeeded();
    }
  }
  render() {
    const {
      match: {
        params: { organizationId }
      },
      incidentCategories,
      incidentTypes,
      selectedContractorsLength,
      selectedCategoriesLength,
      selectedTypesLength
    } = this.props;

    return (
      <ClientIncidentsFormFiltersComponent
        organizationId={organizationId}
        incidentCategories={incidentCategories}
        incidentTypes={incidentTypes}
        selectedCategoriesLength={selectedCategoriesLength}
        selectedContractorsLength={selectedContractorsLength}
        selectedTypesLength={selectedTypesLength}
      />
    );
  }
}

export const ClientIncidentsFormFiltersContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ClientIncidentsFormFilters)
);
