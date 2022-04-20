import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import SendIcon from '@material-ui/icons/Send';
import withWidth, { isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { AttachmentStatus, IAttachmentWithStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'ts-essentials';
import { EditorField } from '@pec/aion-ui-text-editor/components/EditorField';
import { Field } from 'react-final-form';
import { FileUpload } from 'components/FileUpload';
import { FileWithPath } from 'react-dropzone';
import { FormApi } from 'final-form';
import { IAttachment } from '@pec/aion-ui-core/interfaces/attachment';
import { IMessage } from 'interfaces/message';
import { InvalidFileUpload } from 'interfaces/invalidFileUpload';
import { LoadingButton } from 'components/LoadingButton';
import { MessageAttachments } from 'components/MessageAttachments';
import { required } from '@pec/aion-ui-core/validators';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';

const { Uploading } = AttachmentStatus;
const { Complete, Submitted } = TaskStatus;

const styles = (theme: Theme) =>
  createStyles({
    attachmentContainer: {
      marginTop: theme.spacing(2)
    },
    rightIcon: {
      marginLeft: theme.spacing(1)
    }
  });

type OwnProps = {
  addAttachments: (form: FormApi<IMessage>, acceptedFiles: FileWithPath[], rejectedFiles: InvalidFileUpload[]) => void;
  canAssigneeComplete: boolean;
  deleteAttachment: (id: string) => void;
  downloadAttachment: (attachment: IAttachment) => void;
  form: FormApi<IMessage>;
  isAssignee: boolean;
  status: TaskStatus;
  submitting: boolean;
  uploadedAttachments: DeepReadonly<IAttachmentWithStatus[]>;
};

type Props = OwnProps & WithStyles<typeof styles> & WithWidth;

const AddTaskMessageForm: React.FC<Props> = ({
  addAttachments,
  canAssigneeComplete,
  classes,
  deleteAttachment,
  downloadAttachment,
  form,
  isAssignee,
  status,
  submitting,
  uploadedAttachments,
  width
}) => {
  const handleAddAttachments = () => (acceptedFiles: FileWithPath[], rejectedFiles: InvalidFileUpload[]) => {
    addAttachments(form, acceptedFiles, rejectedFiles);
  };

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Field name="content" label="Message" component={EditorField} required validate={required} />
      </Grid>
      <Grid item xs={12}>
        <FileUpload onFilesSelected={handleAddAttachments()} />
        {uploadedAttachments.length > 0 && (
          <Grid item xs={12} className={classes.attachmentContainer}>
            <MessageAttachments
              deleteAttachment={deleteAttachment}
              downloadAttachment={downloadAttachment}
              attachments={uploadedAttachments}
            />
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <Grid container justify="flex-end" alignItems="center">
          <Grid item xs={isWidthUp('sm', width) ? undefined : 12}>
            <LoadingButton
              type="submit"
              variant="contained"
              size="small"
              color="secondary"
              fullWidth={!isWidthUp('sm', width)}
              isSubmitting={submitting}
              disabled={
                submitting ||
                uploadedAttachments.some(attachment => attachment.status === Uploading) ||
                (isAssignee && (status === Complete || (!canAssigneeComplete && status === Submitted)))
              }
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Send'}
              {!submitting ? <SendIcon className={classes.rightIcon} /> : null}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export const AddTaskMessageFormComponent = withStyles(styles)(withWidth()(AddTaskMessageForm));
