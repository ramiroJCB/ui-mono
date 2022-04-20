import * as React from 'react';
import { ClientWorkGroupsComponent } from '../components/ClientWorkGroups';
import { connect } from 'react-redux';
import { ConnectChildren } from '@pec/aion-ui-core/types/connectChildren';
import { destroy } from 'redux-form';
import {
  fetchClientIncidentWorkGroups,
  fetchClientIncidentWorkGroupsIfNeeded
} from '../actions/fetchClientIncidentWorkGroups';
import { getOptionsAsync, setOption } from '@pec/aion-ui-core/actions/options';
import { History } from 'history';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  history: History;
  organizationId: string;
  incidentWorkGroupId?: string;
};

const mapStateToProps = (state: RootState) => ({ ...state.clientIncidentWorkGroups, ...state.options });

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>, { organizationId }: OwnProps) => ({
  getOptionsAsync: () => dispatch(getOptionsAsync()),
  fetchClientIncidentWorkGroupsIfNeeded: () => dispatch(fetchClientIncidentWorkGroupsIfNeeded(organizationId)),
  fetchClientIncidentWorkGroups: (showInactive: boolean) =>
    dispatch(fetchClientIncidentWorkGroups(organizationId, showInactive)),
  handleShowInactiveChange: (showInactive: boolean) => dispatch(setOption('showInactiveWorkGroups', showInactive)),
  destroy: () => dispatch(destroy('clientWorkGroupForm'))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps & ConnectChildren;

class ClientWorkGroups extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.fetchClientIncidentWorkGroups();
  }

  async fetchClientIncidentWorkGroups() {
    await this.props.getOptionsAsync();
    this.props.fetchClientIncidentWorkGroupsIfNeeded();
  }

  componentDidUpdate({ showInactiveWorkGroups: prevShowInactiveWorkGroups }: Props) {
    const { showInactiveWorkGroups } = this.props;

    if (prevShowInactiveWorkGroups !== showInactiveWorkGroups) {
      this.props.fetchClientIncidentWorkGroups(showInactiveWorkGroups);
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.props.handleShowInactiveChange(event.target.checked);

  handleAddClick = () => {
    const { history, organizationId } = this.props;

    history.push(`/${organizationId}/reporting/incidents/workgroups`);
    this.props.destroy();
  };

  render() {
    const {
      incidentWorkGroups,
      isFetching,
      error,
      organizationId,
      incidentWorkGroupId,
      showInactiveWorkGroups,
      children
    } = this.props;

    return (
      <ClientWorkGroupsComponent
        isFetching={isFetching}
        error={error}
        showInactive={showInactiveWorkGroups}
        clientId={organizationId}
        incidentWorkGroupId={incidentWorkGroupId}
        incidentWorkGroups={incidentWorkGroups}
        handleChange={this.handleChange}
        handleAddClick={this.handleAddClick}
      >
        {children}
      </ClientWorkGroupsComponent>
    );
  }
}

export const ClientWorkGroupsContainer = connect(mapStateToProps, mapDispatchToProps)(ClientWorkGroups);
