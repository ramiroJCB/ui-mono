import * as React from 'react';
import { ClientOperationsRowDetailsComponent } from '../components/ClientOperationsRowDetails';
import { connect } from 'react-redux';
import { DeepReadonly } from 'utility-types';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchOperationalMetricsIfNeeded } from '../../metrics/actions';
import { fetchOperationalMetricValuesByContractor } from '../../metricValuesByContractor/actions';
import { IMetricContractor } from 'interfaces/metricContractor';
import { IOperationalMetric } from 'interfaces/operationalMetric';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { parse, toArray } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  contractor: IMetricContractor;
  expanded?: boolean;
};

type RouteParams = {
  organizationId: string;
  periodId: string;
};

const mapStateToProps = (
  {
    operationalMetrics: {
      operationalMetrics,
      isFetching: isFetchingOperationalMetrics,
      error: operationalMetricsError
    },
    operationalMetricValuesByContractor
  }: RootState,
  { contractor: { id } }: OwnProps
) => {
  const operationalMetricValues = operationalMetricValuesByContractor[id] || {
    isFetching: false,
    operationalMetrics: null,
    search: null,
    error: null
  };

  return {
    isFetching: isFetchingOperationalMetrics || operationalMetricValues.isFetching,
    error: operationalMetricsError || operationalMetricValues.error,
    operationalMetricValues,
    operationalMetrics
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    contractor: { id },
    match: {
      params: { organizationId, periodId }
    },
    location: { search }
  }: RouteComponentProps<RouteParams> & OwnProps
) => ({
  fetchOperationalMetricsIfNeeded: () => dispatch(fetchOperationalMetricsIfNeeded(organizationId, periodId)),
  fetchOperationalMetricValuesByContractor: (selectedOperationalMetrics: DeepReadonly<IOperationalMetric[]>) =>
    dispatch(fetchOperationalMetricValuesByContractor(periodId, id, selectedOperationalMetrics, search))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  OwnProps;

class ClientOperationsRowDetails extends React.Component<Props> {
  componentDidUpdate({ expanded: prevExpanded }: Props) {
    const {
      expanded,
      operationalMetricValues: { search: prevSearch, periodId: prevPeriodId },
      operationalMetrics: allOperationalMetrics,
      location: { search },
      match: {
        params: { periodId: selectedPeriodId }
      }
    } = this.props;

    if (
      allOperationalMetrics &&
      expanded &&
      !prevExpanded &&
      (search !== prevSearch || selectedPeriodId !== prevPeriodId)
    ) {
      const { operationalMetricIds: parsedOperationalMetricIds } = parse(search);
      const operationalMetricIds = toArray(parsedOperationalMetricIds);
      const selectedOperationalMetricsFilter =
        operationalMetricIds.length > 0
          ? allOperationalMetrics.filter(({ id }) => operationalMetricIds.includes(id))
          : allOperationalMetrics;

      this.props.fetchOperationalMetricValuesByContractor(selectedOperationalMetricsFilter);
    }
  }

  render() {
    const {
      isFetching,
      error,
      operationalMetricValues: { operationalMetrics }
    } = this.props;

    return !isFetching && operationalMetrics ? (
      <ClientOperationsRowDetailsComponent operationalMetrics={operationalMetrics} />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const ClientOperationsRowDetailsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ClientOperationsRowDetails)
);
