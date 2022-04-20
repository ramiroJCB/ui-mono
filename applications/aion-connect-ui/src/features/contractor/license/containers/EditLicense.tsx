import * as React from 'react';
import { connect } from 'react-redux';
import { editLicense } from '../actions/editLicense';
import { EditLicenseForm } from '../components/EditLicenseForm';
import { ILicense } from 'interfaces/license';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  initialValues: ILicense;
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  editLicense: (values: ILicense) => dispatch(editLicense(organizationId, values))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams> & OwnProps;

class EditLicense extends React.Component<Props> {
  onSubmit = async (values: ILicense) => this.props.editLicense(values);

  render() {
    const { initialValues } = this.props;
    return <EditLicenseForm initialValues={initialValues} onSubmit={this.onSubmit} />;
  }
}

export const EditLicenseContainer = withRouter(connect(null, mapDispatchToProps)(EditLicense));
