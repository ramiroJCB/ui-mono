import * as React from 'react';
import { ClientIncidentsContainer } from '../clientIncidents/containers/ClientIncidents';
import { connect } from 'react-redux';
import { ContractorIncidentsContainer } from '../contractorIncidents/containers/ContractorIncidents';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchOrganizationIfNeeded } from '@pec/aion-ui-core/actions/organization';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => state.organization;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchOrganizationIfNeeded: () => dispatch(fetchOrganizationIfNeeded(organizationId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class IncidentsReport extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchOrganizationIfNeeded();
  }

  render() {
    const {
      organization,
      fetchError,
      match: {
        params: { organizationId }
      }
    } = this.props;
    const { Client, Subscriber } = OrganizationFeature;

    return organization && organization.features.includes(Client) ? (
      <ClientIncidentsContainer />
    ) : organization && organization.features.includes(Subscriber) ? (
      <ContractorIncidentsContainer organizationId={organizationId} />
    ) : fetchError ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const IncidentsReportContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(IncidentsReport);
