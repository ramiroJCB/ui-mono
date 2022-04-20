import * as React from 'react';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { AddProjectContainer } from 'features/contractor/project/containers/AddProject';
import { AxiosError } from 'axios';
import { ConfirmDelete } from 'components/ConfirmDelete';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { deleteProjectSuccess } from 'features/contractor/project/actions/deleteProject';
import { EditProjectContainer } from 'features/contractor/project/containers/EditProject';
import { Error } from '@pec/aion-ui-components/components/Error';
import { HasPermissionContainer } from '@pec/aion-ui-components/containers/HasPermission';
import { IProject } from 'interfaces/project';

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(4)
    },
    leftIcon: {
      marginRight: theme.spacing(1)
    },
    icon: {
      margin: theme.spacing(2)
    },
    gridItem: {
      padding: '40px 0 20px 0'
    },
    gutterBottom: {
      marginBottom: theme.spacing(9)
    },
    iconGroup: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    description: {
      whiteSpace: 'pre-line'
    }
  });

type OwnProps = {
  error: DeepReadonly<AxiosError> | null;
  projects: DeepReadonly<IProject[]>;
  deleteProject: (projectId: string) => () => Promise<void>;
  deleteSuccess: (projectId: string) => () => ReturnType<typeof deleteProjectSuccess>;
  viewAsClient: boolean;
};

type Props = OwnProps & WithStyles<typeof styles>;

const Projects: React.FC<Props> = ({ classes, error, projects, deleteProject, deleteSuccess, viewAsClient }) => (
  <HasPermissionContainer>
    {({ hasOrganizationAssetPermission }) => (
      <Grid item xs={12} id="projects">
        <Paper className={classes.paper}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h5">Projects</Typography>
              {hasOrganizationAssetPermission() && !viewAsClient && (
                <Typography
                  variant="body1"
                  gutterBottom={projects.length === 0}
                  classes={{
                    gutterBottom: classes.gutterBottom
                  }}
                >
                  Add work experiences below. If none are entered, this profile section will not appear publicly.
                </Typography>
              )}
              {projects.length ? (
                projects.map(project => (
                  <Grid container key={project.id}>
                    <Grid item xs={10} className={classes.gridItem}>
                      <Typography variant="h6">{project.name}</Typography>
                      <Typography variant="body1">
                        {moment(project.startDateUtc).format('MM/YYYY')} to{' '}
                        {project.endDateUtc && !project.isActive
                          ? moment(project.endDateUtc).format('MM/YYYY')
                          : 'Present'}
                      </Typography>
                    </Grid>
                    {hasOrganizationAssetPermission() && !viewAsClient && (
                      <Grid item xs={2} className={classNames(classes.gridItem, classes.iconGroup)}>
                        <EditProjectContainer initialValues={{ ...project }} />
                        <ConfirmDelete
                          message={`Are you sure you'd like to remove ${project.name}?`}
                          handleDelete={deleteProject(project.id)}
                          deleteSuccess={deleteSuccess(project.id)}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} style={!viewAsClient ? { paddingBottom: 40 } : {}}>
                      <Typography variant="body1" className={classes.description}>
                        {project.description}
                      </Typography>
                    </Grid>
                  </Grid>
                ))
              ) : error ? (
                <Error message="There was an error processing your request." />
              ) : null}
            </Grid>
            {hasOrganizationAssetPermission() && !viewAsClient && <AddProjectContainer />}
          </Grid>
        </Paper>
      </Grid>
    )}
  </HasPermissionContainer>
);

export const ProjectsComponent = withStyles(styles)(Projects);
