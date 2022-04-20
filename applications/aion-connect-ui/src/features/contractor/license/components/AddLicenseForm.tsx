import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import withWidth, { isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { CommonLicenseFormFields } from './CommonLicenseFormFields';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';
import { FormDialog } from '@pec/aion-ui-components/components/FormDialog';
import { ILicense } from 'interfaces/license';
import { ILicenseForm } from 'interfaces/licenseForm';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1)
  }
});

type OwnProps = {
  initialValues: ILicenseForm;
  onSubmit: (values: ILicenseForm, form: FormApi<ILicenseForm>) => Promise<ILicense>;
};

type Props = OwnProps & WithStyles<typeof styles> & WithWidth;

class AddLicenseFormComponent extends React.PureComponent<Props> {
  renderTriggerButton = (handleToggle: () => void) => (
    <Button
      variant="contained"
      color="primary"
      size="medium"
      fullWidth={!isWidthUp('md', this.props.width)}
      onClick={handleToggle}
    >
      <AddIcon className={this.props.classes.leftIcon} />
      Add
    </Button>
  );

  render() {
    const { initialValues, onSubmit } = this.props;

    return (
      <FormDialog
        renderTriggerButton={this.renderTriggerButton}
        handleSubmit={onSubmit}
        title="Licenses"
        fullWidth
        maxWidth="sm"
      >
        {(handleToggle, handleSubmit) => (
          <Form initialValues={initialValues} onSubmit={handleSubmit}>
            {({ handleSubmit, submitting, invalid, pristine }) => (
              <form onSubmit={handleSubmit} noValidate>
                <DialogContent>
                  <CommonLicenseFormFields />
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

export const AddLicenseForm = withWidth()(withStyles(styles)(AddLicenseFormComponent));
