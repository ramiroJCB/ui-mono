import * as React from 'react';
import { ClientRootCausesComponent } from '../components/ClientRootCauses';
import { connect } from 'react-redux';
import { ConnectChildren } from '@pec/aion-ui-core/types/connectChildren';
import { destroy } from 'redux-form';
import {
  fetchClientIncidentRootCauses,
  fetchClientIncidentRootCausesIfNeeded
} from '../actions/fetchClientIncidentRootCauses';
import { getOptionsAsync, setOption } from '@pec/aion-ui-core/actions/options';
import { History } from 'history';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  history: History;
  organizationId: string;
  incidentRootCauseId?: string;
};

const mapStateToProps = (state: RootState) => ({ ...state.clientIncidentRootCauses, ...state.options });

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>, { organizationId }: OwnProps) => ({
  getOptionsAsync: () => dispatch(getOptionsAsync()),
  fetchClientIncidentRootCausesIfNeeded: () => dispatch(fetchClientIncidentRootCausesIfNeeded(organizationId)),
  fetchClientIncidentRootCauses: (showInactive: boolean) =>
    dispatch(fetchClientIncidentRootCauses(organizationId, showInactive)),
  handleShowInactiveChange: (showInactive: boolean) => dispatch(setOption('showInactiveRootCauses', showInactive)),
  destroy: () => dispatch(destroy('clientRootCauseForm'))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps & ConnectChildren;

class ClientRootCauses extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.fetchClientIncidentRootCauses();
  }

  async fetchClientIncidentRootCauses() {
    await this.props.getOptionsAsync();
    this.props.fetchClientIncidentRootCausesIfNeeded();
  }

  componentDidUpdate({ showInactiveRootCauses: prevShowInactiveRootCauses }: Props) {
    const { showInactiveRootCauses } = this.props;

    if (prevShowInactiveRootCauses !== showInactiveRootCauses) {
      this.props.fetchClientIncidentRootCauses(showInactiveRootCauses);
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.props.handleShowInactiveChange(event.target.checked);

  handleAddClick = () => {
    const { history, organizationId } = this.props;

    history.push(`/${organizationId}/reporting/incidents/rootCauses`);
    this.props.destroy();
  };

  render() {
    const {
      incidentRootCauses,
      isFetching,
      error,
      organizationId,
      incidentRootCauseId,
      showInactiveRootCauses,
      children
    } = this.props;

    return (
      <ClientRootCausesComponent
        isFetching={isFetching}
        error={error}
        showInactive={showInactiveRootCauses}
        clientId={organizationId}
        incidentRootCauseId={incidentRootCauseId}
        incidentRootCauses={incidentRootCauses}
        handleChange={this.handleChange}
        handleAddClick={this.handleAddClick}
      >
        {children}
      </ClientRootCausesComponent>
    );
  }
}

export const ClientRootCausesContainer = connect(mapStateToProps, mapDispatchToProps)(ClientRootCauses);
