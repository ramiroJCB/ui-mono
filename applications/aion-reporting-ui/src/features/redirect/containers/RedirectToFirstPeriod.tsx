import * as React from 'react';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchClientPeriodsIfNeeded } from 'features/clientPeriods/actions';
import { fetchOperationalContractorPeriodsIfNeeded } from 'features/reporting/operational/contractorPeriods/actions/fetchOperationalContractorPeriods';
import { fetchRegionalContractorPeriodsIfNeeded } from 'features/reporting/regional/contractorPeriods/actions/fetchRegionalContractorPeriods';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Redirect } from 'react-router';
import { ReportType } from '../enums/reportType';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  match: {
    params: {
      organizationId: string;
      reportType: ReportType;
      clientId?: string;
    };
  };
};

const mapStateToProps = (
  {
    clientPeriods: { clientPeriods, isFetching: isFetchingClientPeriods, error: clientPeriodsError },
    regionalContractorPeriods: {
      periods: regionalContractorPeriods,
      isFetching: isFetchingRegionalContractorPeriods,
      error: regionalContractorPeriodsError
    },
    operationalContractorPeriods: {
      periods: operationalContractorPeriods,
      isFetching: isFetchingOperationalContractorPeriods,
      error: operationalContractorPeriodsError
    }
  }: RootState,
  {
    match: {
      params: { reportType }
    }
  }: OwnProps
) => ({
  clientPeriods,
  contractorPeriods: reportType === ReportType.Operations ? operationalContractorPeriods : regionalContractorPeriods,
  isFetching: isFetchingOperationalContractorPeriods || isFetchingRegionalContractorPeriods || isFetchingClientPeriods,
  error: regionalContractorPeriodsError || operationalContractorPeriodsError || clientPeriodsError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, reportType }
    }
  }: OwnProps
) => ({
  fetchClientPeriodsIfNeeded: () => dispatch(fetchClientPeriodsIfNeeded(organizationId)),
  fetchContractorPeriodsIfNeeded: (clientId: string) =>
    reportType === ReportType.Operations
      ? dispatch(fetchOperationalContractorPeriodsIfNeeded(organizationId, clientId))
      : dispatch(fetchRegionalContractorPeriodsIfNeeded(organizationId, clientId))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class RedirectToFirstPeriod extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    const {
      match: {
        params: { clientId }
      }
    } = props;

    if (clientId) {
      props.fetchContractorPeriodsIfNeeded(clientId);
    } else {
      props.fetchClientPeriodsIfNeeded();
    }
  }

  render() {
    const {
      clientPeriods,
      contractorPeriods,
      isFetching,
      error,
      match: {
        params: { organizationId, clientId, reportType }
      }
    } = this.props;

    return clientId &&
      contractorPeriods &&
      contractorPeriods.length > 0 &&
      !isFetching &&
      clientId === contractorPeriods[0].clientId ? (
      <Redirect
        to={`/${organizationId}/reporting/${reportType}/clients/${clientId}/periods/${contractorPeriods[0].periodId}`}
      />
    ) : clientPeriods && clientPeriods.length > 0 && !isFetching ? (
      <Redirect to={`/${organizationId}/reporting/${reportType}/periods/${clientPeriods[0].id}`} />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const RedirectToFirstPeriodContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RedirectToFirstPeriod);
