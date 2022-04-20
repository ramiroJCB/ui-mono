import * as React from 'react';
import { addMandate } from '../actions/addMandate';
import { AddMandateComponent } from '../components/AddMandate';
import { connect } from 'react-redux';
import { fetchAssignableSafetyPrograms } from 'features/safetyPrograms/actions/fetchSafetyPrograms';
import { fetchClient } from 'features/client/actions/fetchClient';
import { IMandateForm } from 'interfaces/mandate';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  clientId: string;
};

const mapStateToProps = ({
  safetyProgramClient: { client, isFetching: isFetchingClient, error: clientError },
  safetyPrograms: {
    safetyPrograms: assignableSafetyPrograms,
    isFetching: isFetchingSafetyPrograms,
    error: safetyProgramsError
  }
}: RootState) => ({
  client,
  assignableSafetyPrograms,
  isFetching: isFetchingClient || isFetchingSafetyPrograms,
  error: clientError || safetyProgramsError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { clientId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  addMandate: (values: IMandateForm) => dispatch(addMandate(values)),
  fetchAssignableSafetyPrograms: () => dispatch(fetchAssignableSafetyPrograms(clientId)),
  fetchClient: () => dispatch(fetchClient(clientId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchAssignableSafetyPrograms();
    props.fetchClient();
  }

  onSubmit = async (values: IMandateForm) => {
    const {
      addMandate,
      history,
      match: {
        params: { clientId }
      }
    } = this.props;

    await addMandate(values);
    history.push(`/safety-programs/clients/${clientId}`);
  };

  render() {
    const {
      client,
      assignableSafetyPrograms,
      isFetching,
      error,
      match: {
        params: { clientId }
      }
    } = this.props;

    return (
      <AddMandateComponent
        clientId={clientId}
        onSubmit={this.onSubmit}
        client={client}
        assignableSafetyPrograms={assignableSafetyPrograms}
        isFetching={isFetching}
        error={error}
      />
    );
  }
}

export const AddMandateContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Component));
