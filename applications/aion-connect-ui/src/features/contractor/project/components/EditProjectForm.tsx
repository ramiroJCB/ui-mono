import * as React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import { CommonProjectFormFields } from './CommonProjectFormFields';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';
import { FormDialog } from '@pec/aion-ui-components/components/FormDialog';
import { IProject } from 'interfaces/project';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
  icon: {
    padding: theme.spacing(2)
  }
});

type OwnProps = {
  initialValues: IProject;
  onSubmit: (values: IProject, form: FormApi<IProject>) => Promise<IProject>;
};

type Props = OwnProps & WithStyles<typeof styles>;

class EditProjectFormComponent extends React.PureComponent<Props> {
  renderTriggerButton = (handleToggle: () => void) => (
    <IconButton onClick={handleToggle} className={this.props.classes.icon}>
      <EditIcon />
    </IconButton>
  );

  render() {
    const { initialValues, onSubmit } = this.props;

    return (
      <FormDialog
        renderTriggerButton={this.renderTriggerButton}
        handleSubmit={onSubmit}
        title="Projects"
        fullWidth
        maxWidth="md"
      >
        {(handleToggle, handleSubmit) => (
          <Form initialValues={initialValues} onSubmit={handleSubmit}>
            {({ handleSubmit, submitting, values, form, invalid, pristine }) => (
              <form onSubmit={handleSubmit} noValidate>
                <DialogContent>
                  <CommonProjectFormFields form={form} values={values} />
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

export const EditProjectForm = withStyles(styles)(EditProjectFormComponent);
