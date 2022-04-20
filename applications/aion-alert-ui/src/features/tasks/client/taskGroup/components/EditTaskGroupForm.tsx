import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import { AttachmentStatus, IAttachmentWithStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';
import { BackTitleHeader } from '@pec/aion-ui-components/components/BackTitleHeader';
import { CircularProgress } from '@material-ui/core';
import { CommonTaskGroupFormFields } from './CommonTaskGroupFormFields';
import { FileWithPath } from 'react-dropzone';
import { Form } from 'react-final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { InvalidFileUpload } from 'interfaces/invalidFileUpload';
import { ITaskGroupForm } from 'interfaces/taskGroupForm';
import { Link } from 'react-router-dom';
import { LoadingButton } from 'components/LoadingButton';
import { Paper } from '@pec/aion-ui-components/components/Paper';

const { Uploading } = AttachmentStatus;

type Props = {
  organizationId: string;
  taskGroupId: string;
  initialValues: ITaskGroupForm;
  onSubmit: (values: ITaskGroupForm) => void;
  addAttachments: (acceptedFiles: FileWithPath[], rejectedFiles: InvalidFileUpload[]) => void;
  deleteAttachment: (id: string) => void;
  uploadedAttachments: IAttachmentWithStatus[];
};

export const EditTaskGroupForm: React.FC<Props> = ({
  organizationId,
  taskGroupId,
  initialValues,
  onSubmit,
  addAttachments,
  deleteAttachment,
  uploadedAttachments
}) => {
  const [openDialog, setOpenDialog] = React.useState(false);

  return (
    <React.Fragment>
      <GridContainer>
        <Grid item>
          <BackTitleHeader to={`/${organizationId}/alerts/taskGroups/${taskGroupId}`} linkTitle="Back to Task Group">
            Edit Group Task
          </BackTitleHeader>
        </Grid>
      </GridContainer>
      <Paper>
        <Form initialValues={initialValues} onSubmit={onSubmit} subscription={{ submitting: true, invalid: true }}>
          {({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
              <GridContainer>
                <CommonTaskGroupFormFields
                  addAttachments={addAttachments}
                  deleteAttachment={deleteAttachment}
                  isEdit
                  uploadedAttachments={uploadedAttachments}
                />
                <Grid item xs={12}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item xs={12} md={1}>
                      <Button
                        variant="text"
                        color="primary"
                        component={Link}
                        to={`/${organizationId}/alerts/taskGroups/${taskGroupId}`}
                        fullWidth
                      >
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <Button
                        onClick={() => setOpenDialog(true)}
                        variant="contained"
                        color="secondary"
                        disabled={submitting || uploadedAttachments.some(attachment => attachment.status === Uploading)}
                        fullWidth
                      >
                        Save Changes
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Dialog open={openDialog}>
                    <DialogContent>
                      <DialogContentText>
                        Are you sure you want to change this group task for ALL contractors?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button color="primary" onClick={() => setOpenDialog(false)}>
                        Cancel
                      </Button>
                      <LoadingButton
                        onClick={() => handleSubmit()}
                        variant="contained"
                        color="secondary"
                        isSubmitting={submitting}
                        disabled={submitting || uploadedAttachments.some(attachment => attachment.status === Uploading)}
                      >
                        {submitting ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                      </LoadingButton>
                    </DialogActions>
                  </Dialog>
                </Grid>
              </GridContainer>
            </form>
          )}
        </Form>
      </Paper>
    </React.Fragment>
  );
};
