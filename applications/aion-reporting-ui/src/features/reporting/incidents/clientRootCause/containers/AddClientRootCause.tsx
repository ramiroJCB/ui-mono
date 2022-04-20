import * as React from 'react';
import { addClientIncidentRootCause } from '../actions/addClientIncidentRootCause';
import { ClientRootCauseForm } from './ClientRootCauseForm';
import { ClientRootCausesContainer } from '../../clientRootCauses/containers/ClientRootCauses';
import { connect } from 'react-redux';
import { IIncidentRootCause } from 'interfaces/incidentRootCause';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => state.options;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  addClientIncidentRootCause: (form: IIncidentRootCause, showInactiveRootCauses: boolean) =>
    dispatch(addClientIncidentRootCause(form, organizationId, showInactiveRootCauses))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class AddClientRootCause extends React.Component<Props> {
  onSubmit = (form: IIncidentRootCause) =>
    this.props.addClientIncidentRootCause(form, this.props.showInactiveRootCauses);
  render() {
    const {
      history,
      match: {
        params: { organizationId }
      }
    } = this.props;

    return (
      <ClientRootCausesContainer history={history} organizationId={organizationId}>
        <ClientRootCauseForm onSubmit={this.onSubmit} />
      </ClientRootCausesContainer>
    );
  }
}

export const AddClientRootCauseContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddClientRootCause);
