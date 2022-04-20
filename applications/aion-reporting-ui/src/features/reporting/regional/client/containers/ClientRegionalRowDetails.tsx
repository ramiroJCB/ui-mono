import * as React from 'react';
import { ClientRegionalRowDetailsComponent } from '../components/ClientRegionalRowDetails';
import { connect } from 'react-redux';
import { DeepReadonly } from 'utility-types';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchPeriodRegionsByContractorIfNeeded } from '../../periodRegionsByContractor/actions';
import { fetchRegionalChangeLogByContractorIfNeeded } from '../../changeLogByContractor/actions';
import { fetchRegionalMetricsIfNeeded } from '../../metrics/actions';
import { fetchRegionalMetricValuesByContractorIfNeeded } from '../../metricValuesByContractor/actions';
import { IMetricContractor } from 'interfaces/metricContractor';
import { IRegion } from 'interfaces/region';
import { IRegionalMetric } from 'interfaces/regionalMetric';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { PeriodStatus } from 'interfaces/contractorPeriod';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';

const { Submitted } = PeriodStatus;

type OwnProps = {
  contractor: IMetricContractor;
  expanded?: boolean;
  showTotal: boolean;
};

type RouteParams = {
  organizationId: string;
  periodId: string;
};

const mapStateToProps = (
  {
    periodRegionsByContractor,
    regionalMetrics: { regionalMetrics, isFetching: isFetchingRegionalMetrics, error: regionalMetricsError },
    regionalMetricValuesByContractor,
    regionalChangeLogByContractor
  }: RootState,
  {
    contractor: { id: contractorId },
    match: {
      params: { periodId }
    }
  }: RouteComponentProps<RouteParams> & OwnProps
) => {
  const contractorPeriodRegions = periodRegionsByContractor[contractorId] || {
    isFetching: false,
    regions: null,
    error: null,
    periodId: null
  };

  const regionalMetricValues = regionalMetricValuesByContractor[contractorId] || {
    isFetching: false,
    regionMetrics: null,
    search: null,
    error: null
  };

  const regionalChangeLog =
    regionalChangeLogByContractor[contractorId] && regionalChangeLogByContractor[contractorId].periodId === periodId
      ? regionalChangeLogByContractor[contractorId]
      : {
          isFetching: false,
          regionalChangeLog: null,
          periodId: null,
          error: null
        };

  return {
    isFetching:
      isFetchingRegionalMetrics ||
      contractorPeriodRegions.isFetching ||
      regionalMetricValues.isFetching ||
      regionalChangeLog.isFetching,
    error:
      regionalMetricsError || contractorPeriodRegions.error || regionalMetricValues.error || regionalChangeLog.error,
    contractorPeriodRegions,
    regionalChangeLog,
    regionalMetricValues,
    regionalMetrics
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    contractor: { id: contractorId },
    location: { search },
    match: {
      params: { organizationId, periodId }
    }
  }: RouteComponentProps<RouteParams> & OwnProps
) => ({
  fetchPeriodRegionsByContractorIfNeeded: () =>
    dispatch(fetchPeriodRegionsByContractorIfNeeded(contractorId, periodId)),
  fetchRegionalMetricsIfNeeded: () => dispatch(fetchRegionalMetricsIfNeeded(organizationId, periodId)),
  fetchRegionalMetricValuesByContractorIfNeeded: (
    selectedRegions: DeepReadonly<IRegion[]>,
    selectedRegionalMetrics: DeepReadonly<IRegionalMetric[]>
  ) =>
    dispatch(
      fetchRegionalMetricValuesByContractorIfNeeded(
        periodId,
        contractorId,
        selectedRegions,
        selectedRegionalMetrics,
        search
      )
    ),
  fetchRegionalChangeLogByContractorIfNeeded: () =>
    dispatch(fetchRegionalChangeLogByContractorIfNeeded(periodId, contractorId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  OwnProps;

class ClientRegionalRowDetails extends React.Component<Props> {
  componentDidUpdate({
    match: {
      params: { periodId: prevPeriodId }
    }
  }: Props) {
    const {
      match: {
        params: { periodId }
      },
      contractor: { isEditedAfterDeadline, metricStatus },
      expanded,
      contractorPeriodRegions: { regions, periodId: contractorRegionsPeriodId },
      regionalMetrics
    } = this.props;

    // Don't refetch if the user changed the period with a panel expanded
    if (expanded && periodId === prevPeriodId) {
      this.props.fetchPeriodRegionsByContractorIfNeeded();
      if (isEditedAfterDeadline && metricStatus === Submitted) {
        this.props.fetchRegionalChangeLogByContractorIfNeeded();
      }
      // Don't refetch until after fetchPeriodRegionsByContractorIfNeeded() resolves
      if (regions && regionalMetrics && periodId === contractorRegionsPeriodId) {
        this.props.fetchRegionalMetricValuesByContractorIfNeeded(regions, regionalMetrics);
      }
    }
  }

  render() {
    const {
      isFetching,
      error,
      regionalChangeLog: { regionalChangeLog },
      regionalMetricValues: { regionMetrics },
      showTotal
    } = this.props;

    return !isFetching && regionMetrics ? (
      <ClientRegionalRowDetailsComponent
        regionMetrics={regionMetrics}
        showTotal={showTotal}
        regionalChangeLog={regionalChangeLog}
      />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const ClientRegionalRowDetailsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ClientRegionalRowDetails)
);
