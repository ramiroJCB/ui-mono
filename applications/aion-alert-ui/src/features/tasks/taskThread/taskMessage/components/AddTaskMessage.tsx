import * as React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Grid from '@material-ui/core/Grid';
import { AddTaskMessageFormContainer } from '../containers/AddTaskMessageForm';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { Form, FormSpy } from 'react-final-form';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IMessage } from 'interfaces/message';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';

const styles = () =>
  createStyles({
    panel: {
      marginBottom: 0
    }
  });

type OwnProps = {
  canAssigneeComplete: boolean;
  initialValues: IMessage;
  isAssignee: boolean;
  onSubmit: (values: IMessage, form: FormApi<IMessage>) => void;
  status: TaskStatus;
  onFormChange: (form: FormApi<IMessage>) => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

export const AddTaskMessageComponent: React.FC<Props> = ({
  classes,
  canAssigneeComplete,
  initialValues,
  isAssignee,
  onSubmit,
  status,
  onFormChange
}) => (
  <Form initialValues={initialValues} onSubmit={onSubmit} subscription={{ submitting: true }}>
    {({ form, handleSubmit, submitting }) => (
      <form onSubmit={handleSubmit} autoComplete="off" noValidate>
        <GridContainer>
          <Grid item xs={12}>
            <Accordion defaultExpanded className={classes.panel}>
              <AccordionDetails>
                <GridContainer>
                  <AddTaskMessageFormContainer
                    canAssigneeComplete={canAssigneeComplete}
                    isAssignee={isAssignee}
                    status={status}
                    submitting={submitting}
                    form={form}
                  />
                </GridContainer>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </GridContainer>
        <FormSpy<IMessage> onChange={() => onFormChange(form)} />
      </form>
    )}
  </Form>
);

export const AddTaskMessage = withStyles(styles)(AddTaskMessageComponent);
