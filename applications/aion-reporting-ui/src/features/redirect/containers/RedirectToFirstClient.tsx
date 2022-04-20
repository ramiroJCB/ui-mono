import * as React from 'react';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchClientsIfNeeded } from '@pec/aion-ui-core/actions/selectClient';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { Redirect } from 'react-router';
import { ReportType } from '../enums/reportType';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';

const { OperationalMetrics, RegionMetrics, RegionMetricsWithoutTotal } = OrganizationFeature;

type OwnProps = {
  match: {
    params: {
      organizationId: string;
      reportType: ReportType;
    };
  };
};

const mapStateToProps = (state: RootState) => state.clients;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, reportType }
    }
  }: OwnProps
) => ({
  fetchClientsIfNeeded: () =>
    reportType === ReportType.Operations
      ? dispatch(fetchClientsIfNeeded(organizationId, [OperationalMetrics]))
      : dispatch(fetchClientsIfNeeded(organizationId, [RegionMetrics, RegionMetricsWithoutTotal]))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class RedirectToFirstClient extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClientsIfNeeded();
  }

  render() {
    const {
      clients,
      isFetching,
      error,
      match: {
        params: { organizationId, reportType }
      }
    } = this.props;

    return clients && clients.length && !isFetching ? (
      <Redirect to={`/${organizationId}/reporting/${reportType}/clients/${clients[0].id}`} /> // @TODO: Removed redirect and hardcoded index once we implement client selection
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const RedirectToFirstClientContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RedirectToFirstClient);
