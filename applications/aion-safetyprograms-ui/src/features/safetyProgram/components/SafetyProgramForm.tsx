import * as React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Dialog, TriggerButtonProps } from '@pec/aion-ui-components/components/Dialog';
import { ErrorButton } from 'components/ErrorButton';
import { Field, Form } from 'react-final-form';
import { FormApi } from 'final-form';
import { GracePeriodFields } from 'features/gracePeriodFields/GracePeriodFields';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Link } from 'react-router-dom';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { Prompt } from '@pec/aion-ui-components/components/Prompt';
import { required } from '@pec/aion-ui-core/validators';
import { TextField } from '@pec/aion-ui-form/components/TextField';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

type OwnProps<T, R> = {
  cancelTo: string;
  onConfirmDelete?: () => Promise<void>;
  onSubmit: (values: T, form: FormApi<T>) => Promise<R>;
  initialValues?: T;
  title: string;
  submitButtonText: string;
};

type Props<T, R> = OwnProps<T, R> & I18nextProps;

const renderTriggerButton = (props: TriggerButtonProps, t: TFunction) => (
  <ErrorButton {...props}>{t('safetyPrograms.safetyProgram.deleteProgram', 'Delete Program')}</ErrorButton>
);

class Component<T, R> extends React.Component<Props<T, R>> {
  render() {
    const { cancelTo, onConfirmDelete, onSubmit, initialValues, title, submitButtonText, t } = this.props;

    return (
      <Form onSubmit={onSubmit} initialValues={initialValues}>
        {({ handleSubmit, submitting, invalid, pristine }) => {
          return (
            <form onSubmit={handleSubmit} noValidate>
              <Prompt
                when={!submitting && !pristine}
                message={t(
                  'safetyPrograms.common.leaveConfirmation',
                  'Are you sure you want to leave? Unsaved changes will be lost.'
                )}
              />
              <GridContainer>
                <Grid item xs={12}>
                  <Typography variant="h6">{title}</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Field<string>
                    name="title"
                    label={t('safetyPrograms.safetyProgram.safetyProgramTitle', 'Program Title')}
                    component={TextField}
                    fullWidth
                    variant="filled"
                    required
                    validate={required}
                  />
                </Grid>
                <GracePeriodFields
                  checkboxLabel={t('safetyPrograms.safetyProgram.programGracePeriod', 'Program Grace Period')}
                />
                <Grid item xs={8} style={{ padding: 0 }}>
                  <GridContainer>
                    <Grid item>
                      <Button color="primary" component={Link} to={cancelTo}>
                        {t('safetyPrograms.common.cancel', 'Cancel')}
                      </Button>
                    </Grid>
                    <Grid item>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        color="secondary"
                        isSubmitting={submitting}
                        disabled={pristine || invalid || submitting}
                      >
                        {submitting ? <CircularProgress size={24} color="inherit" /> : submitButtonText}
                      </LoadingButton>
                    </Grid>
                    {onConfirmDelete && (
                      <Grid item style={{ flex: 1, textAlign: 'right' }}>
                        <Dialog
                          renderTriggerButton={props => renderTriggerButton(props, t)}
                          onConfirm={onConfirmDelete}
                        >
                          {({ handleClose, handleConfirm }) => (
                            <React.Fragment>
                              <DialogContent>
                                <DialogContentText>
                                  {t(
                                    'safetyPrograms.safetyProgram.deleteProgramConfirmation',
                                    'Are you sure you want to delete this program?'
                                  )}
                                </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                <Button color="primary" onClick={handleClose}>
                                  {t('safetyPrograms.common.cancel', 'Cancel')}
                                </Button>
                                <Button color="secondary" variant="contained" onClick={handleConfirm}>
                                  {t('safetyPrograms.common.yesDeleteIt', 'Yes, delete it')}
                                </Button>
                              </DialogActions>
                            </React.Fragment>
                          )}
                        </Dialog>
                      </Grid>
                    )}
                  </GridContainer>
                </Grid>
              </GridContainer>
            </form>
          );
        }}
      </Form>
    );
  }
}

export const SafetyProgramForm = withTranslation()(Component);
