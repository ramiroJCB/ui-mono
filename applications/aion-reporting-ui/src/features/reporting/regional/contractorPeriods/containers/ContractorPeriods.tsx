import * as React from 'react';
import { connect } from 'react-redux';
import { ContractorPeriodsComponent } from 'components/ContractorPeriods';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchRegionalContractorPeriodsIfNeeded } from '../actions/fetchRegionalContractorPeriods';
import { History } from 'history';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  history: History;
  organizationId: string;
  clientId: string;
  periodId: string;
};

const mapStateToProps = (state: RootState, { periodId }: OwnProps) => {
  const { isFetching, error, periods } = state.regionalContractorPeriods;

  return {
    isFetching,
    selectedPeriod: periods && periodId && periods.find(p => p.periodId === periodId),
    error,
    periods
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { organizationId, clientId }: OwnProps
) => ({
  fetchRegionalContractorPeriodsIfNeeded: () =>
    dispatch(fetchRegionalContractorPeriodsIfNeeded(organizationId, clientId))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class ContractorPeriods extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchRegionalContractorPeriodsIfNeeded();
  }

  handleMenuItemClick = (periodId: string) => () => {
    const { organizationId, clientId, history } = this.props;
    history.push(`/${organizationId}/reporting/regional/clients/${clientId}/periods/${periodId}`);
  };

  render() {
    const { periods, isFetching, error, selectedPeriod, organizationId, clientId, history } = this.props;

    return periods && selectedPeriod && !isFetching ? (
      <ContractorPeriodsComponent
        history={history}
        organizationId={organizationId}
        clientId={clientId}
        selectedPeriod={selectedPeriod}
        periods={periods}
        handleMenuItemClick={this.handleMenuItemClick}
      />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const ContractorPeriodsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContractorPeriods);
