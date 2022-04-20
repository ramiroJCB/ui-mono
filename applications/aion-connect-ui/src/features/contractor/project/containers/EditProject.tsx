import * as React from 'react';
import { connect } from 'react-redux';
import { editProject } from '../actions/editProject';
import { EditProjectForm } from '../components/EditProjectForm';
import { IProject } from 'interfaces/project';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  initialValues: IProject;
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  editProject: (values: IProject) => dispatch(editProject(organizationId, values))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams> & OwnProps;

class EditProject extends React.Component<Props> {
  onSubmit = async (values: IProject) => await this.props.editProject(values);

  render() {
    const { initialValues } = this.props;
    return <EditProjectForm initialValues={initialValues} onSubmit={this.onSubmit} />;
  }
}

export const EditProjectContainer = withRouter(connect(null, mapDispatchToProps)(EditProject));
