import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { AddTaskMessageContainer } from '../taskMessage/containers/AddTaskMessage';
import { DeepReadonly } from 'ts-essentials';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAssigneeDetails } from 'interfaces/assigneeDetails';
import { IMessage } from 'interfaces/message';
import { ITaskGroup, TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { LocationState } from 'history';
import { TaskAssigneeDetailsContainer } from '../taskAssigneeDetails/containers/TaskAssigneeDetails';
import { TaskMessagesContainer } from '../taskMessages/containers/TaskMessages';

type Props = {
  taskGroup: DeepReadonly<ITaskGroup>;
  assignee: IAssigneeDetails;
  organizationId: string;
  status: TaskStatus;
  state: LocationState;
  threadId?: string;
  taskId: string;
  taskNumber: number;
};

type State = {
  addTaskMessageForm: FormApi<IMessage> | null;
};

export class TaskThreadComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { addTaskMessageForm: null };
  }

  updateAddTaskMessageForm = (addTaskMessageForm: FormApi<IMessage>) => {
    this.setState({ addTaskMessageForm });
  };

  render() {
    const { taskGroup, assignee, organizationId, state, status, taskId, taskNumber, threadId } = this.props;
    const { addTaskMessageForm } = this.state;

    const isAssignee = taskGroup.ownerId !== organizationId;

    const hasUnsentMessage = addTaskMessageForm
      ? addTaskMessageForm.getState().values.attachments.length > 0 ||
        (addTaskMessageForm.getState().values.content ? addTaskMessageForm.getState().values.content.length > 0 : false)
      : false;

    const unsentMessage = addTaskMessageForm && hasUnsentMessage ? addTaskMessageForm.getState().values : undefined;

    return (
      <GridContainer spacing={0}>
        <Grid item xs={12}>
          <TaskAssigneeDetailsContainer
            taskGroup={taskGroup}
            assignee={assignee}
            organizationId={organizationId}
            state={state}
            status={status}
            isAssignee={isAssignee}
            taskId={taskId}
            taskNumber={taskNumber}
            threadId={threadId}
            addTaskMessageForm={this.state.addTaskMessageForm}
            unsentMessage={unsentMessage}
          />
        </Grid>
        <Grid item xs={12}>
          <AddTaskMessageContainer
            assignee={assignee}
            taskGroup={taskGroup}
            organizationId={organizationId}
            taskId={taskId}
            threadId={threadId}
            isAssignee={isAssignee}
            status={status}
            onFormChange={this.updateAddTaskMessageForm}
          />
        </Grid>
        <Grid item xs={12}>
          <TaskMessagesContainer isAssignee={isAssignee} organizationId={organizationId} taskId={taskId} />
        </Grid>
      </GridContainer>
    );
  }
}
