import * as React from 'react';
import { ClientRegionalFormFiltersComponent } from '../components/ClientRegionalFormFilters';
import { connect } from 'react-redux';
import { fetchRegionalMetricsIfNeeded } from '../../metrics/actions';
import { fetchRegionsIfNeeded } from '../../regions/actions';
import { formValueSelector } from 'redux-form';
import { IMetricContractor } from 'interfaces/metricContractor';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  periodId: string;
};

const selector = formValueSelector<RootState>('clientRegionalForm');

const mapStateToProps = (state: RootState) => {
  const selectedContractors = selector(state, 'contractors') as IMetricContractor[];

  return {
    selectedContractorsLength: selectedContractors ? selectedContractors.length : 0
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
  fetchRegionalMetricsIfNeeded: () => dispatch(fetchRegionalMetricsIfNeeded(organizationId, periodId)),
  fetchRegionsIfNeeded: () => dispatch(fetchRegionsIfNeeded(organizationId, periodId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class ClientRegionalFormFilters extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchRegionalMetricsIfNeeded();
    props.fetchRegionsIfNeeded();
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
      this.props.fetchRegionalMetricsIfNeeded();
      this.props.fetchRegionsIfNeeded();
    }
  }
  render() {
    const {
      match: {
        params: { organizationId, periodId }
      },
      selectedContractorsLength
    } = this.props;

    return (
      <ClientRegionalFormFiltersComponent
        organizationId={organizationId}
        periodId={periodId}
        selectedContractorsLength={selectedContractorsLength}
      />
    );
  }
}

export const ClientRegionalFormFiltersContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ClientRegionalFormFilters)
);
