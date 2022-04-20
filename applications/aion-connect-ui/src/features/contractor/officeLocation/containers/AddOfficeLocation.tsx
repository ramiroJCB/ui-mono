import * as React from 'react';
import { addOfficeLocation } from '../actions/addOfficeLocation';
import { AddOfficeLocationForm } from '../components/AddOfficeLocationForm';
import { connect } from 'react-redux';
import { IOfficeLocationForm } from 'interfaces/officeLocationForm';
import { OfficeLocationType } from 'interfaces/officeLocation';
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
  addOfficeLocation: (values: IOfficeLocationForm) => dispatch(addOfficeLocation(organizationId, values))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams>;

class AddOfficeLocation extends React.Component<Props> {
  onSubmit = async (values: IOfficeLocationForm) => await this.props.addOfficeLocation(values);

  render() {
    const initialValues: IOfficeLocationForm = {
      type: OfficeLocationType.AdditionalOffice,
      name: '',
      streetAddress: '',
      city: '',
      postalCode: ''
    };

    return <AddOfficeLocationForm initialValues={initialValues} onSubmit={this.onSubmit} />;
  }
}

export const AddOfficeLocationContainer = withRouter(connect(null, mapDispatchToProps)(AddOfficeLocation));
