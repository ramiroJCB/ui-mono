import * as React from 'react';
import { addProject } from '../actions/addProject';
import { AddProjectForm } from '../components/AddProjectForm';
import { connect } from 'react-redux';
import { IProjectForm } from 'interfaces/projectForm';
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
  addProject: (values: IProjectForm) => dispatch(addProject(organizationId, values))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams>;

class AddProject extends React.Component<Props> {
  onSubmit = async (values: IProjectForm) => await this.props.addProject(values);

  render() {
    const initialValues: IProjectForm = {
      name: '',
      startDateUtc: '',
      endDateUtc: '',
      isActive: false,
      description: ''
    };

    return <AddProjectForm initialValues={initialValues} onSubmit={this.onSubmit} />;
  }
}

export const AddProjectContainer = withRouter(connect(null, mapDispatchToProps)(AddProject));
