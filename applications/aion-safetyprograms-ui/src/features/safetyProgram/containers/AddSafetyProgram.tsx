import * as React from 'react';
import { addSafetyProgram } from '../actions/addSafetyProgram';
import { AddSafetyProgramComponent } from '../components/AddSafetyProgram';
import { connect } from 'react-redux';
import { IAddSafetyProgram } from 'interfaces/safetyProgram';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  addSafetyProgram: (values: IAddSafetyProgram) => dispatch(addSafetyProgram(values))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps;

class Component extends React.Component<Props> {
  onSubmit = async (values: IAddSafetyProgram) => {
    const { addSafetyProgram, history } = this.props;
    const { id } = await addSafetyProgram(values);

    history.push(`/safety-programs/${id}/questions/add`);
  };

  render() {
    return <AddSafetyProgramComponent onSubmit={this.onSubmit} />;
  }
}

export const AddSafetyProgramContainer = withRouter(connect(null, mapDispatchToProps)(Component));
