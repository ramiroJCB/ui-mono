import * as React from 'react';
import { ClientWorkGroupForm } from './ClientWorkGroupForm';
import { ClientWorkGroupsContainer } from '../../clientWorkGroups/containers/ClientWorkGroups';
import { connect } from 'react-redux';
import { fetchClientIncidentWorkGroupIfNeeded } from '../actions/fetchClientIncidentWorkGroup';
import { IIncidentWorkGroup } from 'interfaces/incidentWorkGroup';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';
import { updateClientIncidentWorkGroup } from '../actions/updateClientIncidentWorkGroup';

type RouteParams = {
  organizationId: string;
  incidentWorkGroupId: string;
};

const mapStateToProps = (state: RootState) => ({ ...state.clientIncidentWorkGroup, ...state.options });

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, incidentWorkGroupId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchClientIncidentWorkGroupIfNeeded: () => dispatch(fetchClientIncidentWorkGroupIfNeeded(incidentWorkGroupId)),
  updateClientIncidentWorkGroup: (form: IIncidentWorkGroup, showInactiveWorkGroups: boolean) =>
    dispatch(updateClientIncidentWorkGroup(form, organizationId, showInactiveWorkGroups))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class EditClientWorkGroup extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClientIncidentWorkGroupIfNeeded();
  }

  componentDidUpdate({
    match: {
      params: { incidentWorkGroupId: prevIncidentWorkGroupId }
    }
  }: Props) {
    const {
      match: {
        params: { incidentWorkGroupId }
      }
    } = this.props;

    if (incidentWorkGroupId && prevIncidentWorkGroupId !== incidentWorkGroupId) {
      this.props.fetchClientIncidentWorkGroupIfNeeded();
    }
  }

  onSubmit = (form: IIncidentWorkGroup) =>
    this.props.updateClientIncidentWorkGroup(form, this.props.showInactiveWorkGroups);

  render() {
    const {
      history,
      incidentWorkGroup,
      isFetching,
      error,
      match: {
        params: { organizationId, incidentWorkGroupId }
      }
    } = this.props;

    return (
      <ClientWorkGroupsContainer
        history={history}
        organizationId={organizationId}
        incidentWorkGroupId={incidentWorkGroupId}
      >
        {incidentWorkGroup && (
          <ClientWorkGroupForm
            isFetching={isFetching}
            errorResponse={error}
            onSubmit={this.onSubmit}
            initialValues={incidentWorkGroup}
          />
        )}
      </ClientWorkGroupsContainer>
    );
  }
}

export const EditClientWorkGroupContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditClientWorkGroup);
