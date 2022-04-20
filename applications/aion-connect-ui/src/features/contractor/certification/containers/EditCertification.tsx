import * as React from 'react';
import { connect } from 'react-redux';
import { editCertification } from '../actions/editCertification';
import { EditCertificationForm } from '../components/EditCertificationForm';
import { ICertification } from 'interfaces/certification';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  initialValues: ICertification;
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  editCertification: (values: ICertification) => dispatch(editCertification(organizationId, values))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams> & OwnProps;

class EditCertification extends React.Component<Props> {
  onSubmit = async (values: ICertification) => await this.props.editCertification(values);

  render() {
    const { initialValues } = this.props;
    return <EditCertificationForm initialValues={initialValues} onSubmit={this.onSubmit} />;
  }
}

export const EditCertificationContainer = withRouter(connect(null, mapDispatchToProps)(EditCertification));
