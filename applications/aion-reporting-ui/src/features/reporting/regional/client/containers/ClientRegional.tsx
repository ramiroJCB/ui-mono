import * as React from 'react';
import { ClientRegionalForm } from '../components/ClientRegionalForm';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchOrganizationIfNeeded } from '@pec/aion-ui-core/actions/organization';
import { fetchRegionalContractorsIfNeeded } from '../../contractors/actions';
import { fetchRegionalMetricsIfNeeded } from '../../metrics/actions';
import { fetchRegionsIfNeeded } from '../../regions/actions';
import { History, Location } from 'history';
import { IClientRegionalForm } from 'interfaces/clientRegionalForm';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { merge, parse, stringify, toArray } from '@pec/aion-ui-core/helpers/querystring';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  history: History;
  match: {
    params: {
      organizationId: string;
      periodId: string;
    };
  };
  location: Location;
};

const mapStateToProps = (
  state: RootState,
  {
    match: {
      params: { periodId }
    },
    location: { search }
  }: OwnProps
) => {
  const {
    clientPeriods: { clientPeriods, isFetching: isFetchingClientPeriods, error: clientPeriodsError },
    organization: { organization, isFetching: isFetchingOrganization, fetchError: organizationError },
    regionalContractors: { contractors, isFetching: isFetchingContractors, error: contractorsError, totalCount },
    regionalMetrics: { regionalMetrics, isFetching: isFetchingRegionalMetrics, error: regionalMetricsError },
    regions: { regions, isFetching: isFetchingRegions, error: regionsError }
  } = state;

  const { contractorIds } = parse(search);

  return {
    contractors,
    regionalMetrics,
    clientPeriods,
    regions,
    isFetching:
      isFetchingContractors ||
      isFetchingRegionalMetrics ||
      isFetchingClientPeriods ||
      isFetchingRegions ||
      isFetchingOrganization,
    selectedClientPeriod: clientPeriods && periodId && clientPeriods.find(p => p.id === periodId),
    error: contractorsError || regionalMetricsError || clientPeriodsError || regionsError || organizationError,
    totalCount,
    showTotal: Boolean(organization && !organization.features.includes(OrganizationFeature.RegionMetricsWithoutTotal)),
    initialValues: {
      contractors:
        contractors && toArray(contractorIds).map(contractorId => contractors.find(({ id }) => id === contractorId))
    }
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, periodId }
    },
    location: { search }
  }: OwnProps
) => ({
  fetchOrganizationIfNeeded: () => dispatch(fetchOrganizationIfNeeded(organizationId)),
  fetchRegionalContractorsIfNeeded: () =>
    dispatch(
      fetchRegionalContractorsIfNeeded(organizationId, periodId, toArray(parse(search).contractorIds), parse(search))
    ),
  fetchRegionalMetricsIfNeeded: () => dispatch(fetchRegionalMetricsIfNeeded(organizationId, periodId)),
  fetchRegionsIfNeeded: () => dispatch(fetchRegionsIfNeeded(organizationId, periodId))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class ClientRegional extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    props.fetchOrganizationIfNeeded();
    props.fetchRegionalContractorsIfNeeded();
    props.fetchRegionalMetricsIfNeeded();
    props.fetchRegionsIfNeeded();

    if (!props.location.search) {
      this.redirectToFirstPage();
    }
  }

  componentDidUpdate({
    match: {
      params: { periodId: prevPeriodId }
    },
    location: { search: prevSearch }
  }: Props) {
    const {
      match: {
        params: { periodId }
      },
      location: { search }
    } = this.props;

    if (prevPeriodId !== periodId || prevSearch !== search) {
      this.props.fetchRegionalContractorsIfNeeded();
      this.props.fetchRegionalMetricsIfNeeded();
      this.props.fetchRegionsIfNeeded();
    }
  }

  redirectToFirstPage() {
    this.props.history.replace({
      search: stringify({
        page: '1'
      })
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

  onSubmit = ({ contractors }: IClientRegionalForm) =>
    new Promise(resolve => {
      this.props.history.push({
        search: stringify({
          contractorIds: contractors.map(c => c.id),
          page: '1'
        })
      });
      resolve();
    });

  render() {
    const {
      match: {
        params: { organizationId, periodId }
      },
      location: { search },
      history,
      contractors,
      regionalMetrics,
      clientPeriods,
      regions,
      isFetching,
      initialValues,
      error,
      selectedClientPeriod,
      totalCount,
      showTotal
    } = this.props;
    const { page } = parse(search);

    return !isFetching && contractors && regionalMetrics && clientPeriods && selectedClientPeriod && regions ? (
      <ClientRegionalForm
        organizationId={organizationId}
        periodId={periodId}
        history={history}
        contractors={contractors}
        clientPeriods={clientPeriods}
        selectedClientPeriod={selectedClientPeriod}
        page={page ? parseInt(page.toString(), 10) - 1 : 0} // MUI is zero-indexed; API is one-indexed
        totalCount={totalCount}
        handleChangePage={this.handleChangePage}
        onSubmit={this.onSubmit}
        initialValues={initialValues}
        showTotal={showTotal}
        search={search}
      />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const ClientRegionalContainer = connect(mapStateToProps, mapDispatchToProps)(ClientRegional);
