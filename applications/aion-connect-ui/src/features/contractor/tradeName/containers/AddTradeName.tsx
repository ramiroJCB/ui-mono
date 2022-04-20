import * as React from 'react';
import { addTradeName } from '../actions/addTradeName';
import { AddTradeNameForm } from '../components/AddTradeNameForm';
import { connect } from 'react-redux';
import { ITradeNameForm } from 'interfaces/tradeNameForm';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  addTradeName: (values: ITradeNameForm) => dispatch(addTradeName(organizationId, values))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams>;

class AddTradeName extends React.Component<Props> {
  onSubmit = async (values: ITradeNameForm) => await this.props.addTradeName(values);

  render() {
    const initialValues: ITradeNameForm = {
      name: '',
      description: ''
    };

    return <AddTradeNameForm initialValues={initialValues} onSubmit={this.onSubmit} />;
  }
}

export const AddTradeNameContainer = withRouter(connect(null, mapDispatchToProps)(AddTradeName));
