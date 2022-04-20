import * as React from 'react';
import { ClientOperationsForm } from './ClientOperationsForm';
import { connect } from 'react-redux';
import { DisplayPeriodStatus } from 'interfaces/contractorPeriod';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchOperationalContractorsIfNeeded } from '../../contractors/actions';
import { fetchOperationalMetricsIfNeeded } from '../../metrics/actions';
import { IClientOperationsForm } from 'interfaces/clientOperationsForm';
import { IPeriodStatus } from 'interfaces/periodStatus';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { merge, parse, stringify, toArray } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';
import { getLocalizedPeriodStatus } from 'helpers';
import i18next from 'i18next';

const t = i18next.t.bind(i18next);

type RouteParams = {
  organizationId: string;
  periodId: string;
};

const mapStateToProps = (state: RootState, { location: { search } }: RouteComponentProps<RouteParams>) => {
  const {
    clientPeriods: { clientPeriods, isFetching: isFetchingClientPeriods, error: clientPeriodsError },
    operationalContractors: { contractors, isFetching: isFetchingContractors, error: contractorsError, totalCount },
    operationalMetrics: { operationalMetrics, isFetching: isFetchingOperationalMetrics, error: operationalMetricsError }
  } = state;

  const periodStatuses = Object.keys(DisplayPeriodStatus).map(
    (key, index): IPeriodStatus => ({
      id: index.toString(),
      name: DisplayPeriodStatus[key],
      label: getLocalizedPeriodStatus(DisplayPeriodStatus[key], t)
    })
  );

  const { contractorIds, operationalMetricIds, periodStatusNames, page } = parse(search);

  return {
    contractors,
    operationalMetrics,
    clientPeriods,
    isFetching: isFetchingContractors || isFetchingOperationalMetrics || isFetchingClientPeriods,
    error: contractorsError || operationalMetricsError || clientPeriodsError,
    page,
    totalCount,
    filteredContractors:
      contractors && periodStatusNames && periodStatusNames.length
        ? contractors.filter(
            contractor =>
              contractor.displayMetricStatus && toArray(periodStatusNames).includes(contractor.displayMetricStatus)
          )
        : contractors,
    initialValues: {
      contractors:
        contractors && toArray(contractorIds).map(contractorId => contractors.find(({ id }) => id === contractorId)),
      operationalMetrics:
        operationalMetrics &&
        toArray(operationalMetricIds).map(metricId => operationalMetrics.find(({ id }) => id === metricId)),
      periodStatuses: toArray(periodStatusNames).map(statusName =>
        periodStatuses.find(({ name }) => name === statusName)
      )
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
  }: RouteComponentProps<RouteParams>
) => ({
  fetchOperationalContractorsIfNeeded: () =>
    dispatch(
      fetchOperationalContractorsIfNeeded(organizationId, periodId, toArray(parse(search).contractorIds), parse(search))
    ),
  fetchOperationalMetricsIfNeeded: () => dispatch(fetchOperationalMetricsIfNeeded(organizationId, periodId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class ClientOperations extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    props.fetchOperationalContractorsIfNeeded();
    props.fetchOperationalMetricsIfNeeded();

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
      this.props.fetchOperationalContractorsIfNeeded();
      this.props.fetchOperationalMetricsIfNeeded();
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

  onSubmit = ({ contractors, operationalMetrics, periodStatuses }: IClientOperationsForm) =>
    new Promise(resolve => {
      this.props.history.push({
        search: stringify({
          contractorIds: contractors.map(c => c.id),
          operationalMetricIds: operationalMetrics.map(m => m.id),
          periodStatusNames: periodStatuses.map(s => s.name),
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
      filteredContractors,
      clientPeriods,
      isFetching,
      initialValues,
      error,
      page,
      totalCount
    } = this.props;

    return !isFetching && filteredContractors && clientPeriods ? (
      <ClientOperationsForm
        history={history}
        organizationId={organizationId}
        periodId={periodId}
        contractors={filteredContractors}
        clientPeriods={clientPeriods}
        page={page ? parseInt(page.toString(), 10) - 1 : 0} // MUI is zero-indexed; API is one-indexed
        totalCount={totalCount}
        handleChangePage={this.handleChangePage}
        onSubmit={this.onSubmit}
        initialValues={initialValues}
        search={search}
      />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const ClientOperationsContainer = connect(mapStateToProps, mapDispatchToProps)(ClientOperations);
