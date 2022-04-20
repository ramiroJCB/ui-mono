import * as React from 'react';
import { connect } from 'react-redux';
import { ContractorOperationsForm } from './ContractorOperationsForm';
import { fetchClientIfNeeded } from '@pec/aion-ui-core/actions/client';
import { fetchOperationalContractorPeriodsIfNeeded } from '../../contractorPeriods/actions/fetchOperationalContractorPeriods';
import { fetchOperationalMetricsIfNeeded } from '../../metrics/actions';
import { fetchOperationalMetricValues } from '../../metricValues/actions/fetchOperationalMetricValues';
import { getStatus } from 'helpers';
import { History } from 'history';
import { IMappedOperationalMetric } from 'interfaces/mappedOperationalMetric';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { mapOperationalMetrics } from '../helpers';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { updateOperationalContractorPeriodStatus } from '../../contractorPeriods/actions/updateOperationalContractorPeriodStatus';
import { updateOperationalMetricValue } from '../../metricValues/actions/updateOperationalMetricValue';

type OwnProps = {
  history: History;
  match: {
    params: {
      organizationId: string;
      clientId: string;
      periodId: string;
    };
  };
};

const mapStateToProps = (
  {
    client: { client, isFetching: isFetchingClient, error: clientError },
    operationalMetrics: { operationalMetrics, isFetching: isFetchingMetrics, error: metricsError },
    operationalMetricValues: {
      operationalMetricValues,
      isFetching: isFetchingOperationalMetricValues,
      error: operationalMetricValuesError
    },
    operationalContractorPeriods: { periods, isFetching: isFetchingPeriods, error: periodsError }
  }: RootState,
  {
    match: {
      params: { periodId }
    }
  }: OwnProps
) => ({
  client,
  operationalMetrics,
  operationalMetricValues,
  selectedPeriod: periods && periodId && periods.find(p => p.periodId === periodId),
  error: clientError || periodsError || metricsError || operationalMetricValuesError,
  isFetching: isFetchingClient || isFetchingPeriods || isFetchingMetrics || isFetchingOperationalMetricValues
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, clientId, periodId }
    }
  }: OwnProps
) => ({
  fetchClientIfNeeded: () => dispatch(fetchClientIfNeeded(clientId)),
  fetchOperationalContractorPeriodsIfNeeded: () =>
    dispatch(fetchOperationalContractorPeriodsIfNeeded(organizationId, clientId)),
  fetchOperationalMetricsIfNeeded: () => dispatch(fetchOperationalMetricsIfNeeded(organizationId, periodId, clientId)),
  fetchOperationalMetricValues: () => dispatch(fetchOperationalMetricValues(organizationId, periodId)),
  updateOperationalContractorPeriodStatus: (contractorPeriodId: string) =>
    dispatch(updateOperationalContractorPeriodStatus(contractorPeriodId, organizationId, periodId, clientId)),
  updateOperationalMetricValue: (metricValue: IMappedOperationalMetric) =>
    dispatch(updateOperationalMetricValue(organizationId, metricValue))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class ContractorOperations extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    props.fetchClientIfNeeded();
    props.fetchOperationalContractorPeriodsIfNeeded();
    props.fetchOperationalMetricsIfNeeded();
    props.fetchOperationalMetricValues();
  }

  componentDidUpdate({
    match: {
      params: { periodId: prevPeriodId }
    }
  }: Props) {
    const {
      match: {
        params: { periodId }
      }
    } = this.props;

    if (prevPeriodId !== periodId) {
      this.props.fetchClientIfNeeded();
      this.props.fetchOperationalMetricsIfNeeded();
      this.props.fetchOperationalMetricValues();
    }
  }

  onSubmitMetricValue = (metric: IMappedOperationalMetric) => {
    this.props.updateOperationalMetricValue(metric);
  };

  onSubmit = (contractorPeriodId: string) => async () =>
    await this.props.updateOperationalContractorPeriodStatus(contractorPeriodId);

  render() {
    const {
      client,
      operationalMetrics,
      operationalMetricValues,
      selectedPeriod,
      isFetching,
      history,
      match: {
        params: { organizationId, clientId, periodId }
      }
    } = this.props;

    if (!selectedPeriod) {
      return null;
    }

    const {
      endDate,
      gracePeriodMillis,
      reportStatus: metricStatus,
      reportStatusUpdatedDateUtc: metricStatusUpdatedDateUtc
    } = selectedPeriod;

    const status = getStatus(endDate, gracePeriodMillis, metricStatus, metricStatusUpdatedDateUtc);
    const mappedOperationalMetrics =
      operationalMetrics && operationalMetricValues
        ? mapOperationalMetrics(operationalMetrics, operationalMetricValues)
        : [];

    return client ? (
      <ContractorOperationsForm
        history={history}
        organizationId={organizationId}
        clientId={clientId}
        clientName={client.name}
        periodId={periodId}
        operationalMetrics={operationalMetrics}
        mappedMetrics={mappedOperationalMetrics}
        isFetching={isFetching}
        onSubmitMetricValue={this.onSubmitMetricValue}
        onSubmit={this.onSubmit(selectedPeriod.id)}
        initialValues={{
          status,
          contractorId: organizationId,
          operationalMetrics: mappedOperationalMetrics
        }}
      />
    ) : (
      <Loading />
    );
  }
}

export const ContractorOperationsContainer = connect(mapStateToProps, mapDispatchToProps)(ContractorOperations);
