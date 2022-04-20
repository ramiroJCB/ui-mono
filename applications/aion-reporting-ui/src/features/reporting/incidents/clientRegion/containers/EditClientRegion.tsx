import * as React from 'react';
import { ClientRegionForm } from './ClientRegionForm';
import { ClientRegionsContainer } from '../../clientRegions/containers/ClientRegions';
import { connect } from 'react-redux';
import { fetchClientIncidentRegionIfNeeded } from '../actions/fetchClientIncidentRegion';
import { IIncidentRegion } from 'interfaces/incidentRegion';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';
import { updateClientIncidentRegion } from '../actions/updateClientIncidentRegion';

type RouteParams = {
  organizationId: string;
  incidentRegionId: string;
};

const mapStateToProps = (state: RootState) => ({ ...state.clientIncidentRegion, ...state.options });

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, incidentRegionId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchClientIncidentRegionIfNeeded: () => dispatch(fetchClientIncidentRegionIfNeeded(incidentRegionId)),
  updateClientIncidentRegion: (form: IIncidentRegion, showInactiveRegions: boolean) =>
    dispatch(updateClientIncidentRegion(form, organizationId, showInactiveRegions))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class EditClientRegion extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClientIncidentRegionIfNeeded();
  }

  componentDidUpdate({
    match: {
      params: { incidentRegionId: prevIncidentRegionId }
    }
  }: Props) {
    const {
      match: {
        params: { incidentRegionId }
      }
    } = this.props;

    if (incidentRegionId && prevIncidentRegionId !== incidentRegionId) {
      this.props.fetchClientIncidentRegionIfNeeded();
    }
  }

  onSubmit = (form: IIncidentRegion) => this.props.updateClientIncidentRegion(form, this.props.showInactiveRegions);

  render() {
    const {
      history,
      incidentRegion,
      isFetching,
      error,
      match: {
        params: { organizationId, incidentRegionId }
      }
    } = this.props;

    return (
      <ClientRegionsContainer history={history} organizationId={organizationId} incidentRegionId={incidentRegionId}>
        {incidentRegion && (
          <ClientRegionForm
            isFetching={isFetching}
            errorResponse={error}
            onSubmit={this.onSubmit}
            initialValues={incidentRegion}
          />
        )}
      </ClientRegionsContainer>
    );
  }
}

export const EditClientRegionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditClientRegion);
