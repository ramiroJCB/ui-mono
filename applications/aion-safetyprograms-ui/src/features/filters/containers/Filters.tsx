import * as React from 'react';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchClients } from 'features/clients/actions/fetchClients';
import { fetchContractors } from 'features/contractors/actions/fetchContractors';
import { fetchFilters } from '../actions/fetchFilters';
import { fetchSafetyPrograms } from 'features/safetyPrograms/actions/fetchSafetyPrograms';
import { FiltersComponent } from '../components/Filters';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { merge, parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { getClientOverrideStatusDisplayValue } from 'helpers/getStatusDisplayValues';
import { ClientOverrideStatus } from 'interfaces/requirementOverride';
import { OverrideRequestsFiltersComponent } from '../components/OverrideRequestsFilters';
import i18next from 'i18next';

type RouteParams = {
  organizationId?: string;
};

type OwnProps = {
  open: boolean;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  OwnProps;

const mapStateToProps = ({
  filters: { filters, isFetching, error },
  safetyProgramClients: clients,
  contractors,
  safetyPrograms
}: RootState) => ({
  filters,
  isFetching,
  error,
  clients,
  contractors,
  safetyPrograms
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { location: { search } }: RouteComponentProps
) => ({
  fetchClients: (searchTerm: string) => dispatch(fetchClients(0, searchTerm)),
  fetchContractors: (searchTerm: string) => dispatch(fetchContractors(0, searchTerm)),
  fetchFilters: () => {
    const { clients = '', contractors = '', safetyPrograms = '', overrideStatuses = '' } = parse(search);
    dispatch(
      fetchFilters(clients.toString(), contractors.toString(), safetyPrograms.toString(), overrideStatuses.toString())
    );
  },
  fetchSafetyPrograms: (searchTerm: string) => dispatch(fetchSafetyPrograms(0, searchTerm, true))
});

export const overrideStatusOptions = Object.keys(ClientOverrideStatus).map(key => ({
  value: ClientOverrideStatus[key] as ClientOverrideStatus,
  label: getClientOverrideStatusDisplayValue(ClientOverrideStatus[key], i18next.t.bind(i18next))
}));

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchFilters();
  }

  handleSelect = (param: string) => (ids: string) => {
    const {
      history,
      location: { search }
    } = this.props;

    history.push({
      search: merge(search, {
        [param]: ids,
        page: '0'
      })
    });
  };

  wait = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  handleStatusSearch = async (criteria: string): Promise<typeof overrideStatusOptions> => {
    await this.wait(500);
    return overrideStatusOptions.filter(x => x.value.toLowerCase().indexOf(criteria.toLowerCase()) >= 0);
  };

  handleSearch = (param: string) => (searchTerm: string) => {
    const { fetchClients, fetchContractors, fetchSafetyPrograms } = this.props;

    switch (param) {
      case 'clients':
        return fetchClients(searchTerm);
      case 'contractors':
        return fetchContractors(searchTerm);
      case 'safetyPrograms':
        return fetchSafetyPrograms(searchTerm);
      case 'overrideStatuses':
        return this.handleStatusSearch(searchTerm);
      default:
        return;
    }
  };

  render() {
    const {
      open,
      filters,
      isFetching,
      error,
      clients,
      contractors,
      safetyPrograms,
      match: {
        params: { organizationId }
      },
      location: { search, pathname }
    } = this.props;
    const { statuses = '', hasUnreadContractorComments = '', isOverridden = '', hasGracePeriod = '' } = parse(search);

    return !isFetching && filters && !pathname.includes('requests') ? (
      <FiltersComponent
        organizationId={organizationId}
        open={open}
        filters={filters}
        clients={clients}
        contractors={contractors}
        safetyPrograms={safetyPrograms}
        handleSelect={this.handleSelect}
        handleSearch={this.handleSearch}
        statuses={statuses.toString()}
        hasUnreadContractorComments={hasUnreadContractorComments.toString()}
        isOverridden={isOverridden.toString()}
        hasGracePeriod={hasGracePeriod.toString()}
      />
    ) : !isFetching && filters && pathname.includes('requests') ? (
      <OverrideRequestsFiltersComponent
        organizationId={organizationId}
        open={open}
        filters={filters}
        contractors={contractors}
        safetyPrograms={safetyPrograms}
        handleSelect={this.handleSelect}
        handleSearch={this.handleSearch}
      />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const FiltersContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Component));
