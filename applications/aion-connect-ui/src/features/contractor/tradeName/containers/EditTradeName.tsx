import * as React from 'react';
import { connect } from 'react-redux';
import { editTradeName } from '../actions/editTradeName';
import { EditTradeNameForm } from '../components/EditTradeNameForm';
import { ITradeName } from 'interfaces/tradeName';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  initialValues: ITradeName;
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  editTradeName: (values: ITradeName) => dispatch(editTradeName(organizationId, values))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams> & OwnProps;

class EditTradeName extends React.Component<Props> {
  onSubmit = async (values: ITradeName) => await this.props.editTradeName(values);

  render() {
    const { initialValues } = this.props;
    return <EditTradeNameForm initialValues={initialValues} onSubmit={this.onSubmit} />;
  }
}

export const EditTradeNameContainer = withRouter(connect(null, mapDispatchToProps)(EditTradeName));
