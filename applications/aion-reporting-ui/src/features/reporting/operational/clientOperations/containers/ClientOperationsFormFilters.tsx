import * as React from 'react';
import { ClientOperationsFormFiltersComponent } from '../components/ClientOperationsFormFilters';
import { connect } from 'react-redux';
import { DisplayPeriodStatus } from 'interfaces/contractorPeriod';
import { fetchOperationalMetricsIfNeeded } from '../../metrics/actions';
import { formValueSelector } from 'redux-form';
import { IClientOperationsForm } from 'interfaces/clientOperationsForm';
import { IPeriodStatus } from 'interfaces/periodStatus';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';
import { getLocalizedPeriodStatus } from 'helpers';
import i18next from 'i18next';

const t = i18next.t.bind(i18next);

type RouteParams = {
  organizationId: string;
  periodId: string;
};

const selector = formValueSelector<RootState>('clientOperationsForm');

const mapStateToProps = (state: RootState) => {
  const {
    operationalMetrics: { operationalMetrics, isFetching: isFetchingOperationalMetrics, error: operationalMetricsError }
  } = state;

  const periodStatuses = Object.keys(DisplayPeriodStatus).map(
    (key, index): IPeriodStatus => ({
      id: index.toString(),
      name: DisplayPeriodStatus[key],
      label: getLocalizedPeriodStatus(DisplayPeriodStatus[key], t)
    })
  );

  const {
    contractors: selectedContractors,
    operationalMetrics: selectedOperationalMetrics,
    periodStatuses: selectedPeriodStatuses
  } = selector(state, 'contractors', 'operationalMetrics', 'periodStatuses') as IClientOperationsForm;

  return {
    operationalMetrics,
    periodStatuses,
    isFetching: isFetchingOperationalMetrics,
    selectedContractorsLength: selectedContractors ? selectedContractors.length : 0,
    selectedOperationalMetricsLength: selectedOperationalMetrics ? selectedOperationalMetrics.length : 0,
    selectedPeriodStatusesLength: selectedPeriodStatuses ? selectedPeriodStatuses.length : 0,
    error: operationalMetricsError
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, periodId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchOperationalMetricsIfNeeded: () => dispatch(fetchOperationalMetricsIfNeeded(organizationId, periodId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class ClientOperationsFormFilters extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchOperationalMetricsIfNeeded();
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
      this.props.fetchOperationalMetricsIfNeeded();
    }
  }

  render() {
    const {
      match: {
        params: { organizationId, periodId }
      },
      operationalMetrics,
      periodStatuses,
      selectedContractorsLength,
      selectedOperationalMetricsLength,
      selectedPeriodStatusesLength
    } = this.props;

    return (
      <ClientOperationsFormFiltersComponent
        organizationId={organizationId}
        periodId={periodId}
        operationalMetrics={operationalMetrics}
        periodStatuses={periodStatuses}
        selectedContractorsLength={selectedContractorsLength}
        selectedOperationalMetricsLength={selectedOperationalMetricsLength}
        selectedPeriodStatusesLength={selectedPeriodStatusesLength}
      />
    );
  }
}

export const ClientOperationsFormFiltersContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ClientOperationsFormFilters)
);
