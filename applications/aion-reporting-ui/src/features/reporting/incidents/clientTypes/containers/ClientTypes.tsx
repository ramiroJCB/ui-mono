import * as React from 'react';
import { ClientTypesComponent } from '../components/ClientTypes';
import { connect } from 'react-redux';
import { ConnectChildren } from '@pec/aion-ui-core/types/connectChildren';
import { destroy } from 'redux-form';
import { fetchClientIncidentTypes, fetchClientIncidentTypesIfNeeded } from '../actions/fetchClientIncidentTypes';
import { getOptionsAsync, setOption } from '@pec/aion-ui-core/actions/options';
import { History } from 'history';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  history: History;
  organizationId: string;
  incidentTypeId?: string;
};

const mapStateToProps = (state: RootState) => ({ ...state.clientIncidentTypes, ...state.options });

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>, { organizationId }: OwnProps) => ({
  getOptionsAsync: () => dispatch(getOptionsAsync()),
  fetchClientIncidentTypesIfNeeded: () => dispatch(fetchClientIncidentTypesIfNeeded(organizationId)),
  fetchClientIncidentTypes: (showInactive: boolean) => dispatch(fetchClientIncidentTypes(organizationId, showInactive)),
  handleShowInactiveChange: (showInactive: boolean) => dispatch(setOption('showInactiveTypes', showInactive)),
  destroy: () => dispatch(destroy('clientTypeForm'))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps & ConnectChildren;

class ClientTypes extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.fetchClientIncidentTypes();
  }

  async fetchClientIncidentTypes() {
    await this.props.getOptionsAsync();
    this.props.fetchClientIncidentTypesIfNeeded();
  }

  componentDidUpdate({ showInactiveTypes: prevShowInactiveTypes }: Props) {
    const { showInactiveTypes } = this.props;

    if (prevShowInactiveTypes !== showInactiveTypes) {
      this.props.fetchClientIncidentTypes(showInactiveTypes);
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.props.handleShowInactiveChange(event.target.checked);

  handleAddClick = () => {
    const { history, organizationId } = this.props;

    history.push(`/${organizationId}/reporting/incidents/types`);
    this.props.destroy();
  };

  render() {
    const {
      incidentTypes,
      isFetching,
      error,
      showInactiveTypes,
      organizationId,
      incidentTypeId,
      children
    } = this.props;

    return (
      <ClientTypesComponent
        isFetching={isFetching}
        error={error}
        showInactive={showInactiveTypes}
        clientId={organizationId}
        incidentTypeId={incidentTypeId}
        incidentTypes={incidentTypes}
        handleChange={this.handleChange}
        handleAddClick={this.handleAddClick}
      >
        {children}
      </ClientTypesComponent>
    );
  }
}

export const ClientTypesContainer = connect(mapStateToProps, mapDispatchToProps)(ClientTypes);
