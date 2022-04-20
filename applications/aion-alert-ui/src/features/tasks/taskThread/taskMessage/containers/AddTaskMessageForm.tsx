import * as React from 'react';
import { addMessageFormAttachment } from '../actions/addMessageFormAttachment';
import { AddTaskMessageFormComponent } from '../components/AddTaskMessageForm';
import { connect } from 'react-redux';
import { deleteMessageFormAttachment } from '../actions/deleteMessageFormAttachment';
import { downloadMessageFormAttachment } from '../actions/downloadMessageFormAttachment';
import { FileWithPath } from 'react-dropzone';
import { FormApi } from 'final-form';
import { IAttachment } from '@pec/aion-ui-core/interfaces/attachment';
import { IMessage } from 'interfaces/message';
import { InvalidFileUpload } from 'interfaces/invalidFileUpload';
import { removePendingMessageFormAttachments } from '../actions/removePendingMessageFormAttachments';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { ThunkDispatch } from 'redux-thunk';
import { enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { NotistackSnackbar } from '@pec/aion-ui-core/interfaces/notistackSnackbar';

const mapStateToProps = (state: RootState) => state.taskMessage;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>, { form }: OwnProps) => ({
  addAttachment: (acceptedFiles: FileWithPath[], rejectedFiles: InvalidFileUpload[]) =>
    dispatch(addMessageFormAttachment(acceptedFiles, rejectedFiles)),
  deleteAttachment: (id: string) => dispatch(deleteMessageFormAttachment(id, form)),
  downloadAttachment: (attachment: IAttachment) => dispatch(downloadMessageFormAttachment(attachment)),
  removePendingAttachments: () => dispatch(removePendingMessageFormAttachments()),
  enqueueSnackbar: (snackbar: NotistackSnackbar) => dispatch(enqueueSnackbar(snackbar))
});

type OwnProps = {
  canAssigneeComplete: boolean;
  isAssignee: boolean;
  form: FormApi<IMessage>;
  status: TaskStatus;
  submitting: boolean;
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class AddTaskMessageForm extends React.Component<Props> {
  componentWillUnmount() {
    this.props.removePendingAttachments();
  }

  handleAddAttachments = async (
    form: FormApi<IMessage>,
    acceptedFiles: FileWithPath[],
    rejectedFiles: InvalidFileUpload[]
  ) => {
    if (rejectedFiles.length > 0) {
      this.props.enqueueSnackbar({
        message: 'File type or size is not supported',
        options: {
          variant: 'error'
        }
      });
    } else {
      const { attachments } = form.getState().values;

      const attachmentIds = await this.props.addAttachment(acceptedFiles, rejectedFiles);

      form.change('attachments', [...attachments, ...attachmentIds]);
    }
  };

  render() {
    const { canAssigneeComplete, isAssignee, form, status, submitting, uploadedAttachments } = this.props;

    return (
      <AddTaskMessageFormComponent
        addAttachments={this.handleAddAttachments}
        canAssigneeComplete={canAssigneeComplete}
        deleteAttachment={this.props.deleteAttachment}
        downloadAttachment={this.props.downloadAttachment}
        form={form}
        isAssignee={isAssignee}
        status={status}
        submitting={submitting}
        uploadedAttachments={uploadedAttachments}
      />
    );
  }
}

export const AddTaskMessageFormContainer = connect(mapStateToProps, mapDispatchToProps)(AddTaskMessageForm);
