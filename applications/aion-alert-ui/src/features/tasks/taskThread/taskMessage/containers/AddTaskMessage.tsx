import * as React from 'react';
import { addMessage } from '../actions/addMessage';
import { AddTaskMessage as AddTaskMessageComponent } from '../components/AddTaskMessage';
import { addThreadWithMessage } from '../actions/addThreadWithMessage';
import { connect } from 'react-redux';
import { DeepReadonly } from 'ts-essentials';
import { fetchTasksCount } from '@pec/aion-ui-core/actions/fetchTasksCount';
import { FormApi } from 'final-form';
import { IAssigneeDetails } from 'interfaces/assigneeDetails';
import { IMessage } from 'interfaces/message';
import { ITaskGroup, OwnerType, TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { IThread } from 'interfaces/thread';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RecipientType, SenderType } from 'interfaces/message';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

const { Organization } = OwnerType;
const { AssigneeReplied, OwnerReplied } = TaskStatus;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { location: { search }, organizationId, taskId }: RouteComponentProps & OwnProps
) => ({
  addMessage: (message: IMessage, status: TaskStatus) => dispatch(addMessage(taskId, message, status, parse(search))),
  addThreadWithMessage: (thread: IThread, status: TaskStatus) =>
    dispatch(addThreadWithMessage(taskId, thread, status, parse(search))),
  fetchTasksCount: (isAssignee: boolean) => dispatch(fetchTasksCount(organizationId, isAssignee))
});

type OwnProps = {
  assignee: IAssigneeDetails;
  taskGroup: DeepReadonly<ITaskGroup>;
  isAssignee: boolean;
  organizationId: string;
  status: TaskStatus;
  taskId: string;
  threadId?: string;
  onFormChange: (form: FormApi<IMessage>) => void;
};

type Props = OwnProps & ReturnType<typeof mapDispatchToProps> & RouteComponentProps;

class AddTaskMessage extends React.Component<Props> {
  onSubmit = async ({ threadId, ...message }: IMessage, form: FormApi<IMessage>) => {
    const { assignee, taskGroup, isAssignee } = this.props;

    const status = isAssignee ? AssigneeReplied : OwnerReplied;

    if (threadId) {
      await this.props.addMessage({ threadId, ...message }, status);
    } else {
      const thread: IThread = {
        ownerType: Organization,
        ownerId: taskGroup.ownerId,
        subject: 'Create Thread',
        canOnlyMessageOwner: true,
        participants: [
          {
            type: Organization,
            typeId: assignee.typeId
          }
        ],
        messages: [message]
      };

      await this.props.addThreadWithMessage(thread, status);
    }
    this.props.fetchTasksCount(isAssignee);
    form.reset();
  };

  render() {
    const {
      assignee,
      taskGroup: { canAssigneeComplete, ownerId },
      isAssignee,
      organizationId,
      status,
      threadId,
      onFormChange
    } = this.props;

    return (
      <AddTaskMessageComponent
        canAssigneeComplete={canAssigneeComplete}
        status={status}
        isAssignee={isAssignee}
        onSubmit={this.onSubmit}
        initialValues={{
          content: '',
          threadId,
          senderType: SenderType.Organization,
          senderId: organizationId,
          recipients: [
            {
              type: RecipientType.Organization,
              typeId: organizationId === ownerId ? assignee.typeId : ownerId
            }
          ],
          attachments: []
        }}
        onFormChange={onFormChange}
      />
    );
  }
}

export const AddTaskMessageContainer = withRouter(connect(null, mapDispatchToProps)(AddTaskMessage));
