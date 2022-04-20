import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import { Field, Form } from 'react-final-form';
import { FormApi } from 'final-form';
import { FormDialog } from '@pec/aion-ui-components/components/FormDialog';
import { Grid } from '@material-ui/core';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IEditOrganizationDescriptionForm } from 'interfaces/editOrganizationDescription';
import { IOrganization } from '@pec/aion-ui-core/interfaces/organization';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { maxLength } from '@pec/aion-ui-core/validators';
import { TextField } from '@pec/aion-ui-form/components/TextField';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
  button: {
    marginBottom: theme.spacing(2)
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  }
});

type OwnProps = {
  initialValues: IEditOrganizationDescriptionForm;
  onSubmit: (
    values: IEditOrganizationDescriptionForm,
    form: FormApi<IEditOrganizationDescriptionForm>
  ) => Promise<IOrganization>;
};

type Props = OwnProps & WithStyles<typeof styles>;

class EditDescriptionFormComponent extends React.PureComponent<Props> {
  renderTriggerButton = (handleToggle: () => void) =>
    this.props.initialValues && this.props.initialValues.description ? (
      <IconButton onClick={handleToggle}>
        <EditIcon fontSize="small" />
      </IconButton>
    ) : (
      <Button onClick={handleToggle} className={this.props.classes.button}>
        <AddIcon className={this.props.classes.leftIcon} />
        Add Description
      </Button>
    );

  render() {
    const { initialValues, onSubmit } = this.props;

    return (
      <FormDialog
        renderTriggerButton={this.renderTriggerButton}
        handleSubmit={onSubmit}
        title="Description"
        fullWidth
        maxWidth="md"
      >
        {(handleToggle, handleSubmit) => (
          <Form initialValues={initialValues} onSubmit={handleSubmit}>
            {({ handleSubmit, submitting, values, invalid, pristine }) => (
              <form onSubmit={handleSubmit} noValidate>
                <DialogContent>
                  <GridContainer alignContent="center" justify="center">
                    <Grid item xs={12}>
                      <Field<string>
                        name="description"
                        fullWidth
                        multiline
                        label="Company Description"
                        component={TextField}
                        validate={maxLength(500)}
                        rows="5"
                        variant="filled"
                        helperText={values.description ? `${values.description.length}/500` : '0/500'}
                      />
                    </Grid>
                  </GridContainer>
                </DialogContent>
                <DialogActions>
                  <Button color="primary" onClick={handleToggle}>
                    Cancel
                  </Button>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    color={pristine || invalid ? 'primary' : 'secondary'}
                    isSubmitting={submitting}
                    disabled={submitting}
                  >
                    {submitting ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                  </LoadingButton>
                </DialogActions>
              </form>
            )}
          </Form>
        )}
      </FormDialog>
    );
  }
}

export const EditDescriptionForm = withStyles(styles)(EditDescriptionFormComponent);
