import * as React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import moment from 'moment/moment';
import { CheckboxField } from '@pec/aion-ui-form/components/CheckboxField';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { DateField } from '@pec/aion-ui-form/components/DateField';
import { dateIsOnOrAfter, required } from '@pec/aion-ui-core/validators';
import { DeepReadonly } from 'ts-essentials';
import { EditorField } from '@pec/aion-ui-text-editor/components/EditorField';
import { Field } from 'react-final-form';
import { FileUpload } from 'components/FileUpload';
import { FileWithPath } from 'react-dropzone';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAttachmentWithStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';
import { InvalidFileUpload } from 'interfaces/invalidFileUpload';
import { TaskGroupAttachments } from '../containers/TaskGroupAttachments';
import { TextField } from '@pec/aion-ui-form/components/TextField';

const styles = (theme: Theme) =>
  createStyles({
    checkboxContainer: {
      padding: `${theme.spacing(0.5)}px ${theme.spacing(1.5)}px`
    }
  });

type OwnProps = {
  isEdit?: boolean;
  uploadedAttachments: DeepReadonly<IAttachmentWithStatus[]>;
  addAttachments: (acceptedFiles: FileWithPath[], rejectedFiles: InvalidFileUpload[]) => void;
  deleteAttachment: (id: string) => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

export const CommonTaskGroupFormFieldsComponent: React.FC<Props> = ({
  addAttachments,
  classes,
  deleteAttachment,
  isEdit,
  uploadedAttachments
}: Props) => {
  const tomorrow = moment()
    .add(1, 'days')
    .utc()
    .format('YYYY-MM-DD');

  const composeValidators = (...validators: any[]) => (value: any) =>
    validators.reduce((error, validator) => error || validator(value), undefined);

  return (
    <React.Fragment>
      <Grid item xs={12} md={6}>
        <Field<string> name="subject" label="Task Title" component={TextField} fullWidth required validate={required} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Field<string>
          name="dueDateUtc"
          label="Due Date"
          component={DateField}
          fullWidth
          required
          validate={composeValidators(dateIsOnOrAfter(tomorrow), required)}
          minDate={tomorrow}
        />
      </Grid>
      <Grid item xs={12}>
        <Field<string> name="content" label="Task Message" component={EditorField} required validate={required} />
      </Grid>
      <GridContainer spacing={1} className={classes.checkboxContainer}>
        <Grid item xs={12}>
          <FormControlLabel
            label="Contractors must attach document to submit or complete this task"
            control={
              <Field<boolean> type="checkbox" name="isAttachmentRequiredForCompletion" component={CheckboxField} />
            }
          />
        </Grid>
        {!isEdit && (
          <Grid item xs={12}>
            <FormControlLabel
              label="Allow contractor to complete task"
              control={<Field<boolean> type="checkbox" name="canAssigneeComplete" component={CheckboxField} />}
            />
          </Grid>
        )}
      </GridContainer>
      <Grid item xs={12}>
        <FileUpload onFilesSelected={addAttachments} />
      </Grid>
      <Grid item xs={12}>
        {uploadedAttachments.length > 0 && (
          <TaskGroupAttachments attachments={uploadedAttachments} deleteAttachment={deleteAttachment} />
        )}
      </Grid>
    </React.Fragment>
  );
};

export const CommonTaskGroupFormFields = withStyles(styles)(CommonTaskGroupFormFieldsComponent);
