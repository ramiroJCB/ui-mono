import * as React from 'react';
import { connect } from 'react-redux';
import { editOfficeLocation } from '../actions/editOfficeLocation';
import { EditOfficeLocationForm } from '../components/EditOfficeLocationForm';
import { IEditOfficeLocationForm } from 'interfaces/officeLocationForm';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  initialValues: IEditOfficeLocationForm;
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  editOfficeLocation: (values: IEditOfficeLocationForm) => dispatch(editOfficeLocation(organizationId, values))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams> & OwnProps;

class EditOfficeLocation extends React.Component<Props> {
  onSubmit = async (values: IEditOfficeLocationForm) =>
    new Promise<void>(async (resolve, reject) => {
      if (values.state) {
        try {
          await this.props.editOfficeLocation(values);
          resolve();
        } catch (error) {
          reject(error);
        }
      } else {
        reject();
      }
    });

  render() {
    const { initialValues } = this.props;
    return <EditOfficeLocationForm initialValues={initialValues} onSubmit={this.onSubmit} />;
  }
}

export const EditOfficeLocationContainer = withRouter(connect(null, mapDispatchToProps)(EditOfficeLocation));
