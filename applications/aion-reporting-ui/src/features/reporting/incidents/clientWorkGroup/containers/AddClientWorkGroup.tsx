import * as React from 'react';
import { addClientIncidentWorkGroup } from '../actions/addClientIncidentWorkGroup';
import { ClientWorkGroupForm } from './ClientWorkGroupForm';
import { ClientWorkGroupsContainer } from '../../clientWorkGroups/containers/ClientWorkGroups';
import { connect } from 'react-redux';
import { IIncidentWorkGroup } from 'interfaces/incidentWorkGroup';
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
  addClientIncidentWorkGroup: (form: IIncidentWorkGroup, showInactiveWorkGroups: boolean) =>
    dispatch(addClientIncidentWorkGroup(form, organizationId, showInactiveWorkGroups))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class AddClientWorkGroup extends React.Component<Props> {
  onSubmit = (form: IIncidentWorkGroup) =>
    this.props.addClientIncidentWorkGroup(form, this.props.showInactiveWorkGroups);

  render() {
    const {
      history,
      match: {
        params: { organizationId }
      }
    } = this.props;

    return (
      <ClientWorkGroupsContainer history={history} organizationId={organizationId}>
        <ClientWorkGroupForm onSubmit={this.onSubmit} />
      </ClientWorkGroupsContainer>
    );
  }
}

export const AddClientWorkGroupContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddClientWorkGroup);
