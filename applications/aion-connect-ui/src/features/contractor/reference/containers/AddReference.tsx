import * as React from 'react';
import { addReference } from '../actions/addReference';
import { AddReferenceForm } from '../components/AddReferenceForm';
import { connect } from 'react-redux';
import { IReferenceForm } from 'interfaces/referenceForm';
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
  addReference: (values: IReferenceForm) => dispatch(addReference(organizationId, values))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams>;

class AddReference extends React.Component<Props> {
  onSubmit = async (values: IReferenceForm) => await this.props.addReference(values);

  render() {
    const initialValues: IReferenceForm = {
      name: '',
      phoneNumber: '',
      emailAddress: null,
      notes: ''
    };

    return <AddReferenceForm initialValues={initialValues} onSubmit={this.onSubmit} />;
  }
}

export const AddReferenceContainer = withRouter(connect(null, mapDispatchToProps)(AddReference));
