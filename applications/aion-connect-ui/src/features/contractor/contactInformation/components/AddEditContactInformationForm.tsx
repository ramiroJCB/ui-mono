import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import { Field, Form } from 'react-final-form';
import { FieldState } from 'final-form';
import { FormApi } from 'final-form';
import { FormDialog } from '@pec/aion-ui-components/components/FormDialog';
import { Grid } from '@material-ui/core';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IContactInformation } from 'interfaces/contactInformation';
import { IContactInformationForm } from 'interfaces/contactInformationForm';
import { isEmail, isHttp, maxLength } from '@pec/aion-ui-core/validators';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { TextField } from '@pec/aion-ui-form/components/TextField';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1)
  }
});

type OwnProps = {
  initialValues: IContactInformation | IContactInformationForm;
  onSubmit: (
    values: IContactInformation | IContactInformationForm,
    form: FormApi<IContactInformation | IContactInformationForm>
  ) => Promise<void>;
};

type Props = OwnProps & WithStyles<typeof styles>;

class AddEditContactInformationFormComponent extends React.PureComponent<Props> {
  renderTriggerButton = (handleToggle: () => void) => {
    const {
      initialValues: { emailAddress, phoneNumber, websiteUrl }
    } = this.props;

    return emailAddress || phoneNumber || websiteUrl ? (
      <IconButton onClick={handleToggle}>
        <EditIcon fontSize="small" />
      </IconButton>
    ) : (
      <Button onClick={handleToggle}>
        <AddIcon className={this.props.classes.leftIcon} />
        Add Contact Information
      </Button>
    );
  };

  render() {
    const { initialValues, onSubmit } = this.props;

    const composeValidators = (...validators: any[]) => (
      value: any,
      allValues: IContactInformation,
      meta: FieldState<any>
    ) => validators.reduce((error, validator) => error || validator(value, allValues, meta), undefined);

    return (
      <FormDialog
        renderTriggerButton={this.renderTriggerButton}
        handleSubmit={onSubmit}
        title="Contact Information"
        fullWidth
        maxWidth="sm"
      >
        {(handleToggle, handleSubmit) => (
          <Form initialValues={initialValues} onSubmit={handleSubmit}>
            {({ handleSubmit, submitting, invalid, pristine }) => (
              <form onSubmit={handleSubmit}>
                <DialogContent>
                  <GridContainer alignContent="center" justify="center">
                    <Grid item xs={12}>
                      <Field<string>
                        name="phoneNumber"
                        fullWidth
                        label="Phone Number"
                        component={TextField}
                        validate={maxLength(20)}
                        variant="filled"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field<string>
                        name="emailAddress"
                        fullWidth
                        label="Email Address"
                        component={TextField}
                        validate={isEmail}
                        variant="filled"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field<string>
                        name="websiteUrl"
                        fullWidth
                        label="Website"
                        component={TextField}
                        validate={composeValidators(isHttp, maxLength(50))}
                        variant="filled"
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

export const AddEditContactInformationForm = withStyles(styles)(AddEditContactInformationFormComponent);
