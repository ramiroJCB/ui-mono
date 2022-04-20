import * as React from 'react';
import { addThreadAndCompleteTask } from '../actions/addThreadAndCompleteTask';
import { completeTask } from '../actions/completeTask';
import { connect } from 'react-redux';
import { DeepReadonly } from 'ts-essentials';
import { downloadThreadTaskGroupAttachment } from '../actions/downloadThreadTaskGroupAttachment';
import { enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { fetchAssigneeAttachmentsCount } from '../../taskMessages/actions/fetchAssigneeAttachmentsCount';
import { fetchTasksCount } from '@pec/aion-ui-core/actions/fetchTasksCount';
import { FormApi } from 'final-form';
import { IAssigneeDetails } from 'interfaces/assigneeDetails';
import { IAttachment } from '@pec/aion-ui-core/interfaces/attachment';
import { IMessage, RecipientType, SenderType } from 'interfaces/message';
import { ITaskGroup, OwnerType, TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { IThread } from 'interfaces/thread';
import { LocationState } from 'history';
import { NotistackSnackbar } from '@pec/aion-ui-core/interfaces/notistackSnackbar';
import { RootActions } from '@pec/aion-ui-core/combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { TaskAssigneeDetailsComponent } from '../components/TaskAssigneeDetails';
import { ThunkDispatch } from 'redux-thunk';

const { Organization } = OwnerType;
const { Complete, Submitted } = TaskStatus;

const mapStateToProps = (state: RootState) => {
  const { userInfo } = state.userInfo;
  const { isFetching: isFetchingTaskMessage } = state.taskMessage;
  const { taskMessages, totalAssigneeAttachmentsCount } = state.taskMessages;
  const { isCompleting } = state.taskAssigneeDetails;

  return {
    userInfo,
    taskMessages,
    totalAssigneeAttachmentsCount,
    isCompleting,
    isFetchingTaskMessage
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { organizationId, taskId }: OwnProps
) => ({
  completeTask: (threadId: string, message: IMessage, status: TaskStatus) =>
    dispatch(completeTask(taskId, threadId, message, status)),
  addThreadAndCompleteTask: (thread: IThread, status: TaskStatus) =>
    dispatch(addThreadAndCompleteTask(taskId, thread, status)),
  downloadAttachment: (attachment: IAttachment) => dispatch(downloadThreadTaskGroupAttachment(attachment)),
  enqueueSnackbar: (snackbar: NotistackSnackbar) => dispatch(enqueueSnackbar(snackbar)),
  fetchTasksCount: (isAssignee: boolean) => dispatch(fetchTasksCount(organizationId, isAssignee)),
  fetchAssigneeAttachmentsCount: (threadId: string, senderId: string) =>
    dispatch(fetchAssigneeAttachmentsCount(taskId, threadId, senderId))
});

type OwnProps = {
  taskGroup: DeepReadonly<ITaskGroup>;
  assignee: IAssigneeDetails;
  organizationId: string;
  state: LocationState;
  status: TaskStatus;
  isAssignee: boolean;
  taskId: string;
  taskNumber: number;
  threadId?: string;
  addTaskMessageForm: FormApi<IMessage> | null;
  unsentMessage?: IMessage;
};

type RouteParams = {
  contractorId: string;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class TaskAssigneeDetails extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    if (
      props.threadId &&
      props.organizationId &&
      props.taskGroup.isAttachmentRequiredForCompletion &&
      props.isAssignee
    ) {
      props.fetchAssigneeAttachmentsCount(props.threadId, props.organizationId);
    }
  }

  createThread = (unsentMessage?: IMessage) => {
    const {
      assignee: { typeId },
      taskGroup: { ownerId }
    } = this.props;

    const generatedMessage = this.generateMessage();
    const message = unsentMessage ? { ...unsentMessage, threadId: undefined } : generatedMessage;

    const thread: IThread = {
      ownerType: Organization,
      ownerId: ownerId,
      subject: 'Create Thread',
      canOnlyMessageOwner: true,
      participants: [
        {
          type: Organization,
          typeId: typeId
        }
      ],
      messages: [message]
    };
    return thread;
  };

  generateMessage = () => {
    const {
      assignee: { typeId },
      isAssignee,
      organizationId,
      taskGroup: { canAssigneeComplete, ownerId },
      userInfo
    } = this.props;

    const status = isAssignee && !canAssigneeComplete ? Submitted : Complete;
    const messageText = `This task was ${status === Complete ? 'completed' : 'submitted'} by ${
      userInfo ? userInfo.userName : 'Unknown'
    }`;

    const generatedMessage: IMessage = {
      senderType: SenderType.Organization,
      senderId: organizationId,
      content: messageText,
      recipients: [
        {
          type: RecipientType.Organization,
          typeId: organizationId === typeId ? ownerId : typeId
        }
      ],
      attachments: []
    };

    return generatedMessage;
  };

  addUnsentMessage = async () => {
    const { addTaskMessageForm } = this.props;

    if (addTaskMessageForm) {
      await addTaskMessageForm.submit();
    }
    this.onCompleteTask();
  };

  onCompleteTask = () => {
    const {
      isAssignee,
      taskGroup: { canAssigneeComplete, isAttachmentRequiredForCompletion },
      threadId,
      totalAssigneeAttachmentsCount
    } = this.props;

    const status = isAssignee && !canAssigneeComplete ? Submitted : Complete;
    const attachmentUploaded = threadId && totalAssigneeAttachmentsCount > 0;

    if (isAssignee && isAttachmentRequiredForCompletion && !attachmentUploaded) {
      this.props.enqueueSnackbar({
        message:
          status === Complete
            ? 'This task requires at least one message with an attachment before completing this task'
            : 'This task requires at least one message with an attachment before submitting this task',
        options: {
          variant: 'error'
        }
      });
    } else {
      this.handleSubmission();
    }
  };

  handleSubmission = async () => {
    const {
      isAssignee,
      taskGroup: { canAssigneeComplete },
      threadId
    } = this.props;

    const generatedMessage = this.generateMessage();
    const status = isAssignee && !canAssigneeComplete ? Submitted : Complete;

    if (threadId) {
      await this.props.completeTask(threadId, generatedMessage, status);
    } else {
      const thread = this.createThread();
      await this.props.addThreadAndCompleteTask(thread, status);
    }
    this.props.fetchTasksCount(isAssignee);
  };

  render() {
    const {
      unsentMessage,
      assignee,
      taskGroup,
      taskNumber,
      downloadAttachment,
      organizationId,
      state,
      isCompleting,
      isFetchingTaskMessage,
      isAssignee,
      status,
      match: {
        params: { contractorId }
      }
    } = this.props;

    return (
      <TaskAssigneeDetailsComponent
        taskGroup={taskGroup}
        taskNumber={taskNumber}
        assignee={assignee}
        organizationId={organizationId}
        state={state}
        status={status}
        isAssignee={isAssignee}
        addUnsentMessage={this.addUnsentMessage}
        completeTask={this.onCompleteTask}
        completingTask={isCompleting}
        downloadAttachment={downloadAttachment}
        userReferredByTaskGroupContractorsList={Boolean(contractorId)}
        unsentMessage={unsentMessage}
        isFetchingTaskMessage={isFetchingTaskMessage}
      />
    );
  }
}

export const TaskAssigneeDetailsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TaskAssigneeDetails)
);
