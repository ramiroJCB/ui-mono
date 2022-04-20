import * as React from 'react';
import { addLicense } from '../actions/addLicense';
import { AddLicenseForm } from '../components/AddLicenseForm';
import { connect } from 'react-redux';
import { ILicenseForm } from 'interfaces/licenseForm';
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
  addLicense: (values: ILicenseForm) => dispatch(addLicense(organizationId, values))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams>;

class AddLicense extends React.Component<Props> {
  onSubmit = async (values: ILicenseForm) => await this.props.addLicense(values);

  render() {
    const initialValues: ILicenseForm = {
      name: '',
      issueDateUtc: '',
      licenseId: ''
    };

    return <AddLicenseForm initialValues={initialValues} onSubmit={this.onSubmit} />;
  }
}

export const AddLicenseContainer = withRouter(connect(null, mapDispatchToProps)(AddLicense));
