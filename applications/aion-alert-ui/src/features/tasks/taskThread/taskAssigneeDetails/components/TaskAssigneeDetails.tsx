import * as React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { BackTitleHeader } from '@pec/aion-ui-components/components/BackTitleHeader';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'ts-essentials';
import { Dialog, TriggerButtonProps } from '@pec/aion-ui-components/components/Dialog';
import { getImpliedIconStatus } from 'helpers/status';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAssigneeDetails } from 'interfaces/assigneeDetails';
import { IAttachment } from '@pec/aion-ui-core/interfaces/attachment';
import { IMessage } from 'interfaces/message';
import { ITaskGroup, TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { LoadingButton } from 'components/LoadingButton';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { TaskGroupDetails } from 'features/tasks/client/taskGroup/components/TaskGroupDetails';
import { TaskStatusIcon } from 'components/TaskStatusIcon';
import { HasPermissionContainer } from '@pec/aion-ui-components/containers/HasPermission';

const { Complete, Submitted } = TaskStatus;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginBottom: 16
    },
    secondaryHeading: {
      flexBasis: '90%',
      alignItems: 'center',
      padding: '0 10px',
      fontSize: theme.typography.pxToRem(15)
    },
    panelDetails: {
      padding: `0 ${theme.spacing(3)}px ${theme.spacing(3)}px`,
      flexDirection: 'column'
    },
    completeButtonContainer: {
      alignSelf: 'center'
    }
  });

type RouteParams = {
  taskId: string;
};

type OwnProps = {
  taskGroup: DeepReadonly<ITaskGroup>;
  taskNumber: number;
  unsentMessage: IMessage | undefined;
  assignee: IAssigneeDetails;
  downloadAttachment: (attachment: IAttachment) => void;
  organizationId: string;
  state?: { filter?: string };
  status: TaskStatus;
  isAssignee: boolean;
  completeTask: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  addUnsentMessage: () => void;
  completingTask: boolean;
  userReferredByTaskGroupContractorsList: boolean;
  isFetchingTaskMessage: boolean;
};

type Props = WithStyles<typeof styles> & OwnProps & RouteComponentProps<RouteParams>;

class Component extends React.Component<Props> {
  renderTriggerButton = (hasReadPermission: boolean) => (props: TriggerButtonProps) => {
    const {
      completingTask,
      isAssignee,
      status,
      taskGroup: { canAssigneeComplete }
    } = this.props;

    return (
      <Button
        fullWidth
        color="secondary"
        variant="contained"
        disabled={
          status === Complete ||
          (isAssignee && !canAssigneeComplete && status === Submitted) ||
          completingTask ||
          hasReadPermission
        }
        {...props}
      >
        {isAssignee && !canAssigneeComplete ? 'Submit' : 'Complete'}
      </Button>
    );
  };

  render() {
    const {
      unsentMessage,
      addUnsentMessage,
      assignee: { name },
      classes,
      taskGroup,
      taskNumber,
      completeTask,
      completingTask,
      downloadAttachment,
      isAssignee,
      isFetchingTaskMessage,
      organizationId,
      userReferredByTaskGroupContractorsList,
      state,
      status,
      location: { state: locationState },
      match: {
        params: { taskId }
      }
    } = this.props;

    const { id: taskGroupId, ownerName, subject, canAssigneeComplete } = taskGroup;

    const backLinkPath = userReferredByTaskGroupContractorsList
      ? `/${organizationId}/alerts/taskGroups/${taskGroupId}/contractors`
      : `/${organizationId}/alerts/tasks/all${locationState?.search}`;

    const actionText = isAssignee && !canAssigneeComplete ? 'Submit' : 'Complete';

    return (
      <HasPermissionContainer>
        {({ hasTaskGroupsWritePermission, hasTaskGroupsAuditPermission, hasTaskGroupsManagePermission }) => (
          <GridContainer>
            <GridContainer justify="space-between">
              <Grid item>
                <BackTitleHeader
                  to={state && state.filter ? `${backLinkPath}${state.filter}` : `${backLinkPath}`}
                  linkTitle={userReferredByTaskGroupContractorsList ? 'Back to Contractors' : 'Back to Tasks'}
                  subTitle={isAssignee ? ownerName : name}
                >
                  {subject}
                </BackTitleHeader>
              </Grid>
              <Grid
                item
                className={classes.completeButtonContainer}
                xs={12}
                md={isAssignee ? 3 : 8}
                lg={isAssignee ? 2 : 5}
                xl={isAssignee ? undefined : 3}
              >
                <Grid container justify={isAssignee ? 'flex-end' : 'space-between'} spacing={2}>
                  {!isAssignee && (
                    <Grid item xs={12} sm={6}>
                      <Button
                        disabled={
                          !hasTaskGroupsWritePermission() &&
                          !hasTaskGroupsManagePermission() &&
                          !hasTaskGroupsAuditPermission()
                        }
                        fullWidth
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={`/${organizationId}/alerts/taskGroups/${taskGroupId}/edit?taskId=${taskId}`}
                      >
                        Edit Group Task
                      </Button>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={isAssignee ? 12 : 6}>
                    {unsentMessage && !completingTask ? (
                      <Dialog
                        renderTriggerButton={this.renderTriggerButton(
                          !hasTaskGroupsWritePermission() &&
                            !hasTaskGroupsAuditPermission() &&
                            !hasTaskGroupsManagePermission()
                        )}
                        onConfirm={addUnsentMessage}
                      >
                        {({ handleClose, handleConfirm }) => (
                          <>
                            <DialogTitle>
                              {actionText === 'Complete'
                                ? 'Send Message and Complete Task'
                                : 'Send Message and Submit Task'}
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText>
                                You have an unsent message that will be sent. Would you like to continue?
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button color="primary" onClick={handleClose}>
                                Cancel
                              </Button>
                              <Button variant="contained" color="secondary" type="submit" onClick={handleConfirm}>
                                Continue
                              </Button>
                            </DialogActions>
                          </>
                        )}
                      </Dialog>
                    ) : (
                      <LoadingButton
                        fullWidth
                        isSubmitting={completingTask}
                        variant="contained"
                        disabled={
                          status === Complete ||
                          (isAssignee && !canAssigneeComplete && status === Submitted) ||
                          completingTask ||
                          (!hasTaskGroupsWritePermission() &&
                            !hasTaskGroupsAuditPermission() &&
                            !hasTaskGroupsManagePermission())
                        }
                        color="secondary"
                        onClick={completeTask}
                      >
                        {completingTask || isFetchingTaskMessage ? (
                          <CircularProgress size={18} color="inherit" />
                        ) : (
                          actionText
                        )}
                      </LoadingButton>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </GridContainer>
            <Grid item xs={12}>
              <div className={classes.root}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <GridContainer alignItems="center" spacing={0}>
                      <Grid item>
                        <TaskStatusIcon status={getImpliedIconStatus(isAssignee, status)} tooltipPlacement="top" />
                      </Grid>
                      <Grid item xs={9} sm={4} md={4} lg={5}>
                        <Typography variant="body2" className={classes.secondaryHeading}>
                          {taskGroup.subject}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={7} lg={6}>
                        {isAssignee && taskGroup.isAttachmentRequiredForCompletion && (
                          <Typography
                            align="right"
                            color="textSecondary"
                            variant="subtitle2"
                            className={classes.secondaryHeading}
                          >
                            {canAssigneeComplete
                              ? 'This task requires at least one message with an attachment before completing this task'
                              : 'This task requires at least one message with an attachment before submitting this task'}
                          </Typography>
                        )}
                      </Grid>
                    </GridContainer>
                  </AccordionSummary>
                  <AccordionDetails className={classes.panelDetails}>
                    <TaskGroupDetails
                      taskGroup={taskGroup}
                      taskNumber={taskNumber}
                      downloadAttachment={downloadAttachment}
                      isAssignee={isAssignee}
                    />
                  </AccordionDetails>
                </Accordion>
              </div>
            </Grid>
          </GridContainer>
        )}
      </HasPermissionContainer>
    );
  }
}

export const TaskAssigneeDetailsComponent = withRouter(withStyles(styles)(Component));
