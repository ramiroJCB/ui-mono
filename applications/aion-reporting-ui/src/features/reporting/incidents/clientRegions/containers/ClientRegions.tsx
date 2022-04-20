import * as React from 'react';
import { ClientRegionsComponent } from '../components/ClientRegions';
import { connect } from 'react-redux';
import { ConnectChildren } from '@pec/aion-ui-core/types/connectChildren';
import { destroy } from 'redux-form';
import { fetchClientIncidentRegions, fetchClientIncidentRegionsIfNeeded } from '../actions/fetchClientIncidentRegions';
import { getOptionsAsync, setOption } from '@pec/aion-ui-core/actions/options';
import { History } from 'history';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  history: History;
  organizationId: string;
  incidentRegionId?: string;
};

const mapStateToProps = (state: RootState) => ({ ...state.clientIncidentRegions, ...state.options });

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>, { organizationId }: OwnProps) => ({
  getOptionsAsync: () => dispatch(getOptionsAsync()),
  fetchClientIncidentRegionsIfNeeded: () => dispatch(fetchClientIncidentRegionsIfNeeded(organizationId)),
  fetchClientIncidentRegions: (showInactive: boolean) =>
    dispatch(fetchClientIncidentRegions(organizationId, showInactive)),
  handleShowInactiveChange: (showInactive: boolean) => dispatch(setOption('showInactiveRegions', showInactive)),
  destroy: () => dispatch(destroy('clientRegionForm'))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps & ConnectChildren;

class ClientRegions extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.fetchClientIncidentRegions();
  }

  async fetchClientIncidentRegions() {
    await this.props.getOptionsAsync();
    this.props.fetchClientIncidentRegionsIfNeeded();
  }

  componentDidUpdate({ showInactiveRegions: prevShowInactiveRegions }: Props) {
    const { showInactiveRegions } = this.props;

    if (prevShowInactiveRegions !== showInactiveRegions) {
      this.props.fetchClientIncidentRegions(showInactiveRegions);
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.props.handleShowInactiveChange(event.target.checked);

  handleAddClick = () => {
    const { history, organizationId } = this.props;

    history.push(`/${organizationId}/reporting/incidents/regions`);
    this.props.destroy();
  };

  render() {
    const {
      incidentRegions,
      isFetching,
      error,
      organizationId,
      incidentRegionId,
      showInactiveRegions,
      children
    } = this.props;

    return (
      <ClientRegionsComponent
        isFetching={isFetching}
        error={error}
        showInactive={showInactiveRegions}
        clientId={organizationId}
        incidentRegionId={incidentRegionId}
        incidentRegions={incidentRegions}
        handleChange={this.handleChange}
        handleAddClick={this.handleAddClick}
      >
        {children}
      </ClientRegionsComponent>
    );
  }
}

export const ClientRegionsContainer = connect(mapStateToProps, mapDispatchToProps)(ClientRegions);
