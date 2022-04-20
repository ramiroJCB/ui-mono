import * as React from 'react';
import { ClientTypeForm } from './ClientTypeForm';
import { ClientTypesContainer } from '../../clientTypes/containers/ClientTypes';
import { connect } from 'react-redux';
import { fetchClientIncidentTypeIfNeeded } from '../actions/fetchClientIncidentType';
import { IIncidentType } from 'interfaces/incidentType';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';
import { updateClientIncidentType } from '../actions/updateClientIncidentType';

type RouteParams = {
  organizationId: string;
  incidentTypeId: string;
};

const mapStateToProps = (state: RootState) => ({ ...state.clientIncidentType, ...state.options });

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, incidentTypeId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchClientIncidentTypeIfNeeded: () => dispatch(fetchClientIncidentTypeIfNeeded(incidentTypeId)),
  updateClientIncidentType: (form: IIncidentType, showInactiveTypes: boolean) =>
    dispatch(updateClientIncidentType(form, organizationId, showInactiveTypes))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class EditClientType extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClientIncidentTypeIfNeeded();
  }

  componentDidUpdate({
    match: {
      params: { incidentTypeId: prevIncidentTypeId }
    }
  }: Props) {
    const {
      match: {
        params: { incidentTypeId }
      }
    } = this.props;

    if (incidentTypeId && prevIncidentTypeId !== incidentTypeId) {
      this.props.fetchClientIncidentTypeIfNeeded();
    }
  }

  onSubmit = (form: IIncidentType) => this.props.updateClientIncidentType(form, this.props.showInactiveTypes);

  render() {
    const {
      history,
      incidentType,
      isFetching,
      error,
      match: {
        params: { organizationId, incidentTypeId }
      }
    } = this.props;

    return (
      <ClientTypesContainer history={history} organizationId={organizationId} incidentTypeId={incidentTypeId}>
        {incidentType && (
          <ClientTypeForm
            isFetching={isFetching}
            errorResponse={error}
            onSubmit={this.onSubmit}
            initialValues={incidentType}
          />
        )}
      </ClientTypesContainer>
    );
  }
}

export const EditClientTypeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditClientType);
