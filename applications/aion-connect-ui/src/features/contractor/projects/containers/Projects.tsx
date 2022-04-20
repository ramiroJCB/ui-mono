import * as React from 'react';
import { connect } from 'react-redux';
import { deleteProject, deleteProjectSuccess } from 'features/contractor/project/actions/deleteProject';
import { ProjectsComponent } from '../components/Projects';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  contractorId?: string;
};

const mapStateToProps = (state: RootState) => ({
  ...state.projects,
  ...state.profile
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  deleteProject: (projectId: string) => () => dispatch(deleteProject(organizationId, projectId)),
  deleteSuccess: (projectId: string) => () => dispatch(deleteProjectSuccess(projectId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Projects extends React.Component<Props> {
  render() {
    const { error, projects, deleteProject, deleteSuccess, viewAsClient } = this.props;

    return (
      <ProjectsComponent
        error={error}
        projects={projects}
        deleteProject={deleteProject}
        deleteSuccess={deleteSuccess}
        viewAsClient={viewAsClient}
      />
    );
  }
}

export const ProjectsContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Projects));
