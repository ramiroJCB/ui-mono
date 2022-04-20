import * as React from 'react';
import { addTaskGroupAttachment } from '../actions/addTaskGroupAttachment';
import { AttachmentStatus, IAttachmentWithStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';
import { connect } from 'react-redux';
import { deleteTaskGroupAttachment } from '../actions/deleteTaskGroupAttachment';
import { editTaskGroup } from '../actions/editTaskGroup';
import { EditTaskGroupForm } from '../components/EditTaskGroupForm';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchTaskGroupIfNeeded } from '../actions/fetchTaskGroup';
import { FileWithPath } from 'react-dropzone';
import { InvalidFileUpload } from 'interfaces/invalidFileUpload';
import { ITaskGroupForm } from 'interfaces/taskGroupForm';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

const { Uploaded } = AttachmentStatus;

type RouteParams = {
  organizationId: string;
  taskGroupId: string;
};

const mapStateToProps = (state: RootState) => state.taskGroup;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { taskGroupId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchTaskGroupIfNeeded: () => dispatch(fetchTaskGroupIfNeeded(taskGroupId)),
  editTaskGroup: (taskGroupForm: ITaskGroupForm, pendingAttachments: ReadonlyArray<IAttachmentWithStatus>) =>
    dispatch(editTaskGroup(taskGroupForm, pendingAttachments, taskGroupId)),
  addAttachments: (acceptedFiles: FileWithPath[], rejectedFiles: InvalidFileUpload[]) =>
    dispatch(addTaskGroupAttachment(acceptedFiles, rejectedFiles)),
  deleteAttachment: (id: string) => dispatch(deleteTaskGroupAttachment(id))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class EditTaskGroup extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchTaskGroupIfNeeded();
  }

  onSubmit = async (taskGroupForm: ITaskGroupForm) => {
    const {
      history,
      location: { search },
      match: {
        params: { organizationId, taskGroupId }
      },
      pendingAttachments,
      editTaskGroup
    } = this.props;

    await editTaskGroup(taskGroupForm, pendingAttachments);

    const referredFromTasks = parse(search)?.taskId;
    const taskId = parse(search).taskId;

    referredFromTasks
      ? history.push(`/${organizationId}/alerts/tasks/${taskId}`)
      : history.push(`/${organizationId}/alerts/taskGroups/${taskGroupId}`);
  };

  render() {
    const {
      taskGroup,
      error,
      match: {
        params: { organizationId, taskGroupId }
      },
      pendingAttachments
    } = this.props;

    const existingAttachments = taskGroup
      ? taskGroup.attachments.map(attachment => ({ ...attachment, status: Uploaded }))
      : [];

    return taskGroup ? (
      <EditTaskGroupForm
        addAttachments={this.props.addAttachments}
        organizationId={organizationId}
        taskGroupId={taskGroupId}
        onSubmit={this.onSubmit}
        initialValues={{
          subject: taskGroup.subject,
          content: taskGroup.content,
          attachments: taskGroup.attachments,
          dueDateUtc: taskGroup.dueDateUtc,
          isAttachmentRequiredForCompletion: taskGroup.isAttachmentRequiredForCompletion
        }}
        deleteAttachment={this.props.deleteAttachment}
        uploadedAttachments={[...existingAttachments, ...pendingAttachments]}
      />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const EditTaskGroupContainer = connect(mapStateToProps, mapDispatchToProps)(EditTaskGroup);
