import * as React from 'react';
import { addClientIncidentType } from '../actions/addClientIncidentType';
import { ClientTypeForm } from './ClientTypeForm';
import { ClientTypesContainer } from '../../clientTypes/containers/ClientTypes';
import { connect } from 'react-redux';
import { IIncidentType } from 'interfaces/incidentType';
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
  addClientIncidentType: (form: IIncidentType, showInactiveTypes: boolean) =>
    dispatch(addClientIncidentType(form, organizationId, showInactiveTypes))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class AddClientType extends React.Component<Props> {
  onSubmit = (form: IIncidentType) => this.props.addClientIncidentType(form, this.props.showInactiveTypes);

  render() {
    const {
      history,
      match: {
        params: { organizationId }
      }
    } = this.props;

    return (
      <ClientTypesContainer history={history} organizationId={organizationId}>
        <ClientTypeForm onSubmit={this.onSubmit} />
      </ClientTypesContainer>
    );
  }
}

export const AddClientTypeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddClientType);
