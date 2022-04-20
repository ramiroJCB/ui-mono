import * as React from 'react';
import { ClientIncidentsForm } from './ClientIncidentsForm';
import { connect } from 'react-redux';
import { fetchClientIncidentCategoriesIfNeeded } from '../../clientCategories/actions/fetchClientIncidentCategories';
import { fetchClientIncidentTypesIfNeeded } from '../../clientTypes/actions/fetchClientIncidentTypes';
import { fetchContractorsIfNeeded } from 'features/contractors/actions';
import { fetchIncidentsByClientIfNeeded } from '../../actions/fetchIncidentsByClient';
import { IClientIncidentsForm } from 'interfaces/clientIncidentsForm';
import { merge, parse, stringify, toArray } from '@pec/aion-ui-core/helpers/querystring';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState, { location: { search } }: RouteComponentProps<RouteParams>) => {
  const {
    contractors: { contractors },
    clientIncidentTypes: { incidentTypes },
    clientIncidentCategories: { incidentCategories }
  } = state;
  const { start, end, contractorIds, incidentTypeIds, incidentCategoryIds, page } = parse(search);

  return {
    ...state.incidents,
    page,
    initialValues: {
      start,
      end,
      contractors:
        contractors && toArray(contractorIds).map(contractorId => contractors.find(({ id }) => id === contractorId)),
      types: incidentTypes && toArray(incidentTypeIds).map(typeId => incidentTypes.find(({ id }) => id === typeId)),
      categories:
        incidentCategories &&
        toArray(incidentCategoryIds).map(categoryId => incidentCategories.find(({ id }) => id === categoryId))
    } as IClientIncidentsForm
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    },
    location: { search }
  }: RouteComponentProps<RouteParams>
) => {
  const parsedSearch = parse(search);
  return {
    fetchContractorsIfNeeded: () =>
      dispatch(
        fetchContractorsIfNeeded(
          organizationId,
          OrganizationFeature.IncidentReports,
          toArray(parsedSearch.contractorIds)
        )
      ),
    fetchIncidentsByClientIfNeeded: () => dispatch(fetchIncidentsByClientIfNeeded(organizationId, parsedSearch)),
    fetchClientIncidentTypesIfNeeded: () => dispatch(fetchClientIncidentTypesIfNeeded(organizationId)),
    fetchClientIncidentCategoriesIfNeeded: () => dispatch(fetchClientIncidentCategoriesIfNeeded(organizationId))
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class ClientIncidents extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.fetchInitial();
  }

  async fetchInitial() {
    if (!this.props.location.search) {
      await this.redirectToYear();
    }

    this.props.fetchContractorsIfNeeded();
    this.props.fetchIncidentsByClientIfNeeded();
    this.props.fetchClientIncidentTypesIfNeeded();
    this.props.fetchClientIncidentCategoriesIfNeeded();
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      location: { search }
    } = this.props;

    if (prevSearch !== search) {
      this.props.fetchIncidentsByClientIfNeeded();
    }
  }

  getEndDate() {
    const endOfDay = new Date().setHours(23, 59, 59, 999);

    return new Date(endOfDay).toISOString();
  }

  getStartDate() {
    const date = new Date();

    return new Date(date.setMonth(date.getMonth() - 12)).toISOString();
  }

  redirectToYear() {
    return new Promise(resolve => {
      this.props.history.replace({
        search: stringify({
          start: this.getStartDate(),
          end: this.getEndDate(),
          page: '1'
        })
      });

      resolve();
    });
  }

  handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    const {
      history,
      location: { search }
    } = this.props;
    history.push({
      search: merge(search, {
        page: (page + 1).toString() // MUI is zero-indexed; API is one-indexed
      })
    });
  };

  onSubmit = ({ start, end, contractors, types, categories }: IClientIncidentsForm) =>
    new Promise(resolve => {
      this.props.history.push({
        search: stringify({
          start,
          end,
          contractorIds: contractors.map(c => c.id),
          incidentTypeIds: types.map(t => t.id),
          incidentCategoryIds: categories.map(c => c.id),
          page: '1'
        })
      });
      resolve();
    });

  render() {
    const {
      match: {
        params: { organizationId }
      },
      incidents,
      page,
      initialValues,
      totalCount,
      error,
      isFetching
    } = this.props;

    return (
      <ClientIncidentsForm
        organizationId={organizationId}
        incidents={incidents}
        responseError={error}
        isFetching={isFetching}
        page={page ? parseInt(page.toString(), 10) - 1 : 0} // MUI is zero-indexed; API is one-indexed
        totalCount={totalCount}
        handleChangePage={this.handleChangePage}
        onSubmit={this.onSubmit}
        initialValues={initialValues}
      />
    );
  }
}

export const ClientIncidentsContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(ClientIncidents));
