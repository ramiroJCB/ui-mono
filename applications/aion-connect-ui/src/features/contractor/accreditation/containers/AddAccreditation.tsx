import * as React from 'react';
import { addAccreditation } from '../actions/addAccreditation';
import { AddAccreditationForm } from '../components/AddAccreditationForm';
import { connect } from 'react-redux';
import { IAccreditationForm } from 'interfaces/accreditationForm';
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
  addAccreditation: (values: IAccreditationForm) => dispatch(addAccreditation(organizationId, values))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams>;

class AddAccreditation extends React.Component<Props> {
  onSubmit = async (values: IAccreditationForm) => await this.props.addAccreditation(values);

  render() {
    const initialValues: IAccreditationForm = {
      name: '',
      issueDateUtc: '',
      accreditationId: ''
    };

    return <AddAccreditationForm initialValues={initialValues} onSubmit={this.onSubmit} />;
  }
}

export const AddAccreditationContainer = withRouter(connect(null, mapDispatchToProps)(AddAccreditation));
