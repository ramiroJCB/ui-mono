import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { BackTitleHeader } from '@pec/aion-ui-components/components/BackTitleHeader';
import { ConfirmDeleteButton } from 'components/ConfirmDeleteButton';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'ts-essentials';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAttachment } from '@pec/aion-ui-core/interfaces/attachment';
import { ITaskGroup, TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { TaskGroupDetails } from './TaskGroupDetails';
import { TaskStatusCard } from 'components/TaskStatusCard';
import { usePermission } from 'hooks/usePermission';

const { AwaitingAction, Complete, Incomplete } = TaskStatus;

const styles = (theme: Theme) =>
  createStyles({
    cardsContainer: {
      marginBottom: theme.spacing(0.5)
    }
  });

type OwnProps = {
  taskGroup: DeepReadonly<ITaskGroup>;
  downloadAttachment: (attachment: IAttachment) => void;
  deleteTaskGroup: () => Promise<void>;
  isDeleting: boolean;
  organizationId: string;
  taskGroupId: string;
};

type Props = OwnProps & WithStyles<typeof styles> & RouteComponentProps;

const TaskGroup: React.FC<Props> = ({
  classes,
  deleteTaskGroup,
  downloadAttachment,
  isDeleting,
  organizationId,
  taskGroupId,
  taskGroup,
  location: { state }
}) => {
  const { hasTaskGroupsWritePermission, hasTaskGroupsManagePermission, hasTaskGroupsAuditPermission } = usePermission();

  return (
    <>
      <GridContainer justify="space-between">
        <Grid item>
          <BackTitleHeader
            to={`/${organizationId}/alerts/taskGroups/all${state?.search}`}
            linkTitle="Back to Task Groups"
          >
            {taskGroup.subject}
          </BackTitleHeader>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            disabled={
              isDeleting ||
              (!hasTaskGroupsWritePermission && !hasTaskGroupsManagePermission && !hasTaskGroupsAuditPermission)
            }
            component={Link}
            to={`/${organizationId}/alerts/taskGroups/${taskGroupId}/edit`}
          >
            Edit Group Task
          </Button>
        </Grid>
      </GridContainer>
      <GridContainer justify="center" className={classes.cardsContainer}>
        <Grid item xs={12} md={4} lg={3} xl={2}>
          <TaskStatusCard
            status={Incomplete}
            statusCount={taskGroup.meta ? taskGroup.meta.incompleteCount : 0}
            to={`/${organizationId}/alerts/taskGroups/${taskGroupId}/contractors?status=${Incomplete}`}
            disabled={isDeleting}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={3} xl={2}>
          <TaskStatusCard
            status={AwaitingAction}
            statusCount={taskGroup.meta ? taskGroup.meta.awaitingActionCount : 0}
            to={`/${organizationId}/alerts/taskGroups/${taskGroupId}/contractors?status=${AwaitingAction}`}
            disabled={isDeleting}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={3} xl={2}>
          <TaskStatusCard
            status={Complete}
            statusCount={taskGroup.meta ? taskGroup.meta.completeCount : 0}
            to={`/${organizationId}/alerts/taskGroups/${taskGroupId}/contractors?status=${Complete}`}
            disabled={isDeleting}
          />
        </Grid>
      </GridContainer>
      <Paper>
        <GridContainer justify="flex-end">
          <Grid item>
            <ConfirmDeleteButton
              disabled={
                !hasTaskGroupsWritePermission && !hasTaskGroupsManagePermission && !hasTaskGroupsAuditPermission
              }
              message="Are you sure you want to delete this task?"
              title="Delete Task"
              handleDelete={deleteTaskGroup}
            />
          </Grid>
        </GridContainer>
        <TaskGroupDetails isAssignee={false} downloadAttachment={downloadAttachment} taskGroup={taskGroup} />
      </Paper>
    </>
  );
};

export const TaskGroupComponent = withRouter(withStyles(styles)(TaskGroup));
