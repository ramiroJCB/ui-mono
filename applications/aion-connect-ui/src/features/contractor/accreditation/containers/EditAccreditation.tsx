import * as React from 'react';
import { connect } from 'react-redux';
import { editAccreditation } from '../actions/editAccreditation';
import { EditAccreditationForm } from '../components/EditAccreditationForm';
import { IAccreditation } from 'interfaces/accreditation';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  initialValues: IAccreditation;
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  editAccreditation: (values: IAccreditation) => dispatch(editAccreditation(organizationId, values))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams> & OwnProps;

class EditAccreditation extends React.Component<Props> {
  onSubmit = async (values: IAccreditation) => await this.props.editAccreditation(values);

  render() {
    const { initialValues } = this.props;
    return <EditAccreditationForm initialValues={initialValues} onSubmit={this.onSubmit} />;
  }
}

export const EditAccreditationContainer = withRouter(connect(null, mapDispatchToProps)(EditAccreditation));
