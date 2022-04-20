import * as React from 'react';
import { ClientRootCauseForm } from './ClientRootCauseForm';
import { ClientRootCausesContainer } from '../../clientRootCauses/containers/ClientRootCauses';
import { connect } from 'react-redux';
import { fetchClientIncidentRootCauseIfNeeded } from '../actions/fetchClientIncidentRootCause';
import { IIncidentRootCause } from 'interfaces/incidentRootCause';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';
import { updateClientIncidentRootCause } from '../actions/updateClientIncidentRootCause';

type RouteParams = {
  organizationId: string;
  incidentRootCauseId: string;
};

const mapStateToProps = (state: RootState) => ({ ...state.clientIncidentRootCause, ...state.options });

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, incidentRootCauseId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchClientIncidentRootCauseIfNeeded: () => dispatch(fetchClientIncidentRootCauseIfNeeded(incidentRootCauseId)),
  updateClientIncidentRootCause: (form: IIncidentRootCause, showInactiveRootCauses: boolean) =>
    dispatch(updateClientIncidentRootCause(form, organizationId, showInactiveRootCauses))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class EditClientRootCause extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClientIncidentRootCauseIfNeeded();
  }

  componentDidUpdate({
    match: {
      params: { incidentRootCauseId: prevIncidentRootCauseId }
    }
  }: Props) {
    const {
      match: {
        params: { incidentRootCauseId }
      }
    } = this.props;

    if (incidentRootCauseId && prevIncidentRootCauseId !== incidentRootCauseId) {
      this.props.fetchClientIncidentRootCauseIfNeeded();
    }
  }

  onSubmit = (form: IIncidentRootCause) =>
    this.props.updateClientIncidentRootCause(form, this.props.showInactiveRootCauses);

  render() {
    const {
      history,
      incidentRootCause,
      isFetching,
      error,
      match: {
        params: { organizationId, incidentRootCauseId }
      }
    } = this.props;

    return (
      <ClientRootCausesContainer
        history={history}
        organizationId={organizationId}
        incidentRootCauseId={incidentRootCauseId}
      >
        {incidentRootCause && (
          <ClientRootCauseForm
            isFetching={isFetching}
            errorResponse={error}
            onSubmit={this.onSubmit}
            initialValues={incidentRootCause}
          />
        )}
      </ClientRootCausesContainer>
    );
  }
}

export const EditClientRootCauseContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditClientRootCause);
