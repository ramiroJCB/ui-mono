import * as React from 'react';
import { connect } from 'react-redux';
import { deleteMandate } from '../actions/deleteMandate';
import { EditMandateComponent } from '../components/EditMandate';
import { fetchMandate } from '../actions/fetchMandate';
import { IMandateForm } from 'interfaces/mandate';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { updateMandate } from '../actions/updateMandate';

type RouteParams = {
  clientId: string;
  mandateId: string;
};

const mapStateToProps = (state: RootState) => state.mandate;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { mandateId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  deleteMandate: () => dispatch(deleteMandate(mandateId)),
  fetchMandate: () => dispatch(fetchMandate(mandateId)),
  updateMandate: (values: IMandateForm) => dispatch(updateMandate(values))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchMandate();
  }

  onConfirmDelete = async () => {
    const {
      deleteMandate,
      history,
      match: {
        params: { clientId }
      }
    } = this.props;

    await deleteMandate();
    history.push(`/safety-programs/clients/${clientId}`);
  };

  onSubmit = async (values: IMandateForm) => {
    const {
      updateMandate,
      history,
      match: {
        params: { clientId }
      }
    } = this.props;

    await updateMandate(values);
    history.push(`/safety-programs/clients/${clientId}`);
  };

  render() {
    const {
      mandate,
      isFetching,
      error,
      match: {
        params: { clientId, mandateId }
      }
    } = this.props;

    return (
      <EditMandateComponent
        mandateId={mandateId}
        clientId={clientId}
        onConfirmDelete={this.onConfirmDelete}
        onSubmit={this.onSubmit}
        mandate={mandate}
        isFetching={isFetching}
        error={error}
      />
    );
  }
}

export const EditMandateContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Component));
