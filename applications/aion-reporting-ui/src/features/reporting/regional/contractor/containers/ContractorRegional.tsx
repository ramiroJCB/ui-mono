import * as React from 'react';
import { addRegionalChangeLogEntry } from '../../changeLogEntry/actions';
import { connect } from 'react-redux';
import { ContractorRegionalForm } from './ContractorRegionalForm';
import { fetchClientIfNeeded } from '@pec/aion-ui-core/actions/client';
import { fetchPeriodRegionsByContractorIfNeeded } from '../../periodRegionsByContractor/actions';
import { fetchRegionalContractorPeriodsIfNeeded } from '../../contractorPeriods/actions/fetchRegionalContractorPeriods';
import { fetchRegionalMetricsIfNeeded } from '../../metrics/actions';
import { fetchRegionalMetricValues } from '../../metricValues/actions/fetchRegionalMetricValues';
import { fetchRegionalReportSettingsIfNeeded } from '../../../regional/clientRegionalReportSettings/actions/fetchRegionalReportSettings';
import { getStatus } from 'helpers';
import { History } from 'history';
import { IContractorRegionalForm } from 'interfaces/contractorRegionalForm';
import { IMappedMetric } from 'interfaces/mappedMetric';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { mapRegionMetrics } from '../helpers';
import { PeriodStatus } from 'interfaces/contractorPeriod';
import { RegionalReportOptionKey } from 'interfaces/regionalReportOption';
import { RegionalReportSettingValue } from 'interfaces/regionalReportSetting';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { updateRegionalContractorPeriodStatus } from '../../contractorPeriods/actions/updateRegionalContractorPeriodStatus';
import { updateRegionalMetricValue } from '../../metricValues/actions/updateRegionalMetricValue';

const { Saved, Submitted } = PeriodStatus;

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
    periodRegionsByContractor,
    regionalMetrics: { regionalMetrics, isFetching: isFetchingRegionalMetrics, error: regionalMetricsError },
    regionalMetricValues: {
      regionalMetricValues,
      isFetching: isFetchingRegionalMetricValues,
      error: regionalMetricValuesError
    },
    regionalReportSettings: {
      regionalReportSettings,
      isFetching: isFetchingRegionalReportSettings,
      error: regionalReportSettingsError
    },
    regionalContractorPeriods: { periods, isFetching: isFetchingPeriods, error: periodsError }
  }: RootState,
  {
    match: {
      params: { periodId, organizationId }
    }
  }: OwnProps
) => {
  const contractorPeriodRegions = periodRegionsByContractor[organizationId] || {
    isFetching: false,
    regions: null,
    error: null,
    periodId: periodId
  };
  return {
    client,
    contractorPeriodRegions,
    regionalMetrics,
    regionalMetricValues,
    hasIsEditableSetting: Boolean(
      regionalReportSettings &&
        regionalReportSettings.some(
          ({ regionalReportOptionKey, value }) =>
            regionalReportOptionKey === RegionalReportOptionKey.IS_EDITABLE && value === RegionalReportSettingValue.True
        )
    ),
    selectedPeriod: periods && periodId && periods.find(p => p.periodId === periodId),
    error:
      clientError ||
      periodsError ||
      regionalMetricsError ||
      regionalMetricValuesError ||
      regionalReportSettingsError ||
      contractorPeriodRegions.error,
    isFetching:
      isFetchingClient ||
      isFetchingPeriods ||
      isFetchingRegionalMetrics ||
      isFetchingRegionalMetricValues ||
      isFetchingRegionalReportSettings ||
      contractorPeriodRegions.isFetching
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, clientId, periodId }
    }
  }: OwnProps
) => ({
  addRegionalChangeLogEntry: (contractorPeriodId: string, description: string) =>
    dispatch(addRegionalChangeLogEntry(contractorPeriodId, organizationId, description)),
  fetchClientIfNeeded: () => dispatch(fetchClientIfNeeded(clientId)),
  fetchRegionalContractorPeriodsIfNeeded: () =>
    dispatch(fetchRegionalContractorPeriodsIfNeeded(organizationId, clientId)),
  fetchRegionalMetricsIfNeeded: () => dispatch(fetchRegionalMetricsIfNeeded(organizationId, periodId, clientId)),
  fetchPeriodRegionsByContractorIfNeeded: () =>
    dispatch(fetchPeriodRegionsByContractorIfNeeded(organizationId, periodId)),
  fetchRegionalMetricValues: () => dispatch(fetchRegionalMetricValues(organizationId, periodId)),
  fetchRegionalReportSettingsIfNeeded: () => dispatch(fetchRegionalReportSettingsIfNeeded(clientId)),
  updateRegionalContractorPeriodStatus: (contractorPeriodId: string, status: PeriodStatus) =>
    dispatch(updateRegionalContractorPeriodStatus(contractorPeriodId, organizationId, periodId, status, clientId)),
  updateRegionalMetricValue: (metricValue: IMappedMetric) =>
    dispatch(updateRegionalMetricValue(organizationId, metricValue))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class ContractorRegional extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClientIfNeeded();
    props.fetchRegionalContractorPeriodsIfNeeded();
    props.fetchRegionalMetricsIfNeeded();
    props.fetchPeriodRegionsByContractorIfNeeded();
    props.fetchRegionalMetricValues();
    props.fetchRegionalReportSettingsIfNeeded();
  }

  componentDidUpdate({
    match: {
      params: { organizationId: prevOrganizationId, periodId: prevPeriodId }
    }
  }: Props) {
    const {
      match: {
        params: { organizationId, periodId }
      }
    } = this.props;

    if (prevOrganizationId !== organizationId || prevPeriodId !== periodId) {
      this.props.fetchClientIfNeeded();
      this.props.fetchRegionalMetricsIfNeeded();
      this.props.fetchPeriodRegionsByContractorIfNeeded();
      this.props.fetchRegionalMetricValues();
    }
  }

  updateBooleanMetricValue = async (metric: IMappedMetric) => {
    await this.props.updateRegionalMetricValue(metric);
    this.props.fetchRegionalMetricValues();
  };

  onSubmit = (contractorPeriodId: string) => async ({ description }: IContractorRegionalForm) =>
    description
      ? (await this.props.addRegionalChangeLogEntry(contractorPeriodId, description)) &&
        (await this.props.updateRegionalContractorPeriodStatus(contractorPeriodId, Submitted))
      : await this.props.updateRegionalContractorPeriodStatus(contractorPeriodId, Submitted);

  handleEdit = (contractorPeriodId: string) => async () =>
    await this.props.updateRegionalContractorPeriodStatus(contractorPeriodId, Saved);

  render() {
    const {
      client,
      contractorPeriodRegions: { regions },
      regionalMetrics,
      regionalMetricValues,
      hasIsEditableSetting,
      updateRegionalMetricValue,
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
    const mappedRegionMetrics =
      regions && regionalMetrics && regionalMetricValues
        ? mapRegionMetrics(regions, regionalMetrics, regionalMetricValues)
        : [];

    return client ? (
      <ContractorRegionalForm
        history={history}
        organizationId={organizationId}
        clientId={clientId}
        clientName={client.name}
        selectedPeriod={selectedPeriod}
        periodId={periodId}
        regionalMetrics={regionalMetrics}
        isFetching={isFetching}
        updateBooleanMetricValue={this.updateBooleanMetricValue}
        updateDoubleMetricValue={updateRegionalMetricValue}
        onSubmit={this.onSubmit(selectedPeriod.id)}
        handleEdit={this.handleEdit(selectedPeriod.id)}
        hasIsEditableSetting={hasIsEditableSetting}
        initialValues={{
          status,
          contractorId: organizationId,
          regions: mappedRegionMetrics
        }}
      />
    ) : (
      <Loading />
    );
  }
}

export const ContractorRegionalContainer = connect(mapStateToProps, mapDispatchToProps)(ContractorRegional);
