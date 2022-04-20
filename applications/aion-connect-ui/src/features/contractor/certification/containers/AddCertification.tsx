import * as React from 'react';
import { addCertification } from '../actions/addCertification';
import { AddCertificationForm } from '../components/AddCertificationForm';
import { connect } from 'react-redux';
import { ICertificationForm } from 'interfaces/certificationForm';
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
  addCertification: (values: ICertificationForm) => dispatch(addCertification(organizationId, values))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams>;

class AddCertification extends React.Component<Props> {
  onSubmit = async (values: ICertificationForm) => await this.props.addCertification(values);

  render() {
    const initialValues: ICertificationForm = {
      name: '',
      issueDateUtc: '',
      certificationId: ''
    };

    return <AddCertificationForm initialValues={initialValues} onSubmit={this.onSubmit} />;
  }
}

export const AddCertificationContainer = withRouter(connect(null, mapDispatchToProps)(AddCertification));
