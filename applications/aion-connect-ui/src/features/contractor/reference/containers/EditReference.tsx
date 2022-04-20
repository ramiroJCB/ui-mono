import * as React from 'react';
import { connect } from 'react-redux';
import { editReference } from '../actions/editReference';
import { EditReferenceForm } from '../components/EditReferenceForm';
import { IReference } from 'interfaces/reference';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  initialValues: IReference;
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  editReference: (values: IReference) => dispatch(editReference(organizationId, values))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams> & OwnProps;

class EditReference extends React.Component<Props> {
  onSubmit = async (values: IReference) => await this.props.editReference(values);

  render() {
    const { initialValues } = this.props;
    return <EditReferenceForm initialValues={initialValues} onSubmit={this.onSubmit} />;
  }
}

export const EditReferenceContainer = withRouter(connect(null, mapDispatchToProps)(EditReference));
