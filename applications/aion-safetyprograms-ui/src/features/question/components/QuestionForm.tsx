import * as React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Dialog, TriggerButtonProps } from '@pec/aion-ui-components/components/Dialog';
import { ErrorButton } from 'components/ErrorButton';
import { Field, Form } from 'react-final-form';
import { GracePeriodFields, GRACE_PERIOD_NEEDED } from 'features/gracePeriodFields/GracePeriodFields';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Link } from 'react-router-dom';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { Prompt } from '@pec/aion-ui-components/components/Prompt';
import { required } from '@pec/aion-ui-core/validators';
import { TextField } from '@pec/aion-ui-form/components/TextField';
import { FormApi } from 'final-form';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';
import i18next from 'i18next';

type OwnProps<T, R> = {
  onConfirmDelete?: () => Promise<void>;
  onSubmit: (values: T) => Promise<R>;
  initialValues: T;
  title: string;
  submitButtonText: string;
  safetyProgramId: string;
  gracePeriodExists?: boolean;
  gracePeriodPrompt?: boolean;
  setGracePeriodPrompt?: React.Dispatch<React.SetStateAction<boolean>>;
};

type Props<T, R> = OwnProps<T, R> & I18nextProps;

const renderTriggerButton = (props: TriggerButtonProps) => (
  <ErrorButton {...props}>{i18next.t('safetyPrograms.question.deleteQuestion', 'Delete Question')}</ErrorButton>
);

class Component<T, R> extends React.Component<Props<T, R>> {
  render() {
    const {
      onConfirmDelete,
      initialValues,
      title,
      submitButtonText,
      safetyProgramId,
      gracePeriodExists,
      gracePeriodPrompt,
      setGracePeriodPrompt,
      onSubmit,
      t
    } = this.props;

    const handleGracePromptNeeded = async (values: T, form: FormApi<T>) => {
      if (gracePeriodExists || !setGracePeriodPrompt || gracePeriodPrompt) {
        await onSubmit(values);
      } else {
        setGracePeriodPrompt && setGracePeriodPrompt(true);
        form.change(GRACE_PERIOD_NEEDED, true);
      }
    };

    return (
      <Form onSubmit={handleGracePromptNeeded} initialValues={initialValues}>
        {({ handleSubmit, submitting, invalid, pristine, form }) => (
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
                  label={t('safetyPrograms.question.questionText', 'Question Text')}
                  component={TextField}
                  fullWidth
                  variant="filled"
                  required
                  validate={required}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={8}>
                <Field<string>
                  name="body"
                  label={t('safetyPrograms.question.citationText', 'Citation Text')}
                  component={TextField}
                  fullWidth
                  variant="filled"
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={8} style={{ padding: 0 }}>
                <GridContainer>
                  <Grid item>
                    <Button color="primary" component={Link} to={`/safety-programs/${safetyProgramId}`}>
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
                      <Dialog renderTriggerButton={renderTriggerButton} onConfirm={onConfirmDelete}>
                        {({ handleClose, handleConfirm }) => (
                          <React.Fragment>
                            <DialogContent>
                              <DialogContentText>
                                {t(
                                  'safetyPrograms.question.deleteConfirmation',
                                  'Are you sure you want to delete this question?'
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
                  {setGracePeriodPrompt && (
                    <Dialog open={gracePeriodPrompt}>
                      {() => (
                        <React.Fragment>
                          <DialogTitle>
                            {t('safetyPrograms.question.applyGracePeriod', 'Apply Grace Period')}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              {t(
                                'safetyPrograms.question.questionWithoutGracePeriod',
                                'Adding a new question without applying a grace period will cause all requirements for this program to be incomplete.'
                              )}
                            </DialogContentText>
                            <Box ml={-4} mt={4} mb={4}>
                              <GracePeriodFields hideCheckbox />
                            </Box>
                          </DialogContent>
                          <DialogActions>
                            <GridContainer spacing={2} direction="column" justify="flex-end" alignItems="flex-end">
                              <Grid item>
                                <LoadingButton
                                  onClick={() => {
                                    setGracePeriodPrompt(false);
                                    handleSubmit();
                                  }}
                                  variant="contained"
                                  color="primary"
                                  isSubmitting={submitting}
                                  disabled={pristine || invalid || submitting}
                                >
                                  {submitting ? (
                                    <CircularProgress size={24} color="inherit" />
                                  ) : (
                                    t('safetyPrograms.question.saveAndAddGracePeriod', 'Save & Add Grace Period')
                                  )}
                                </LoadingButton>
                              </Grid>
                              <Grid item>
                                <LoadingButton
                                  onClick={async () => {
                                    await Promise.resolve(form.change(GRACE_PERIOD_NEEDED, false));
                                    handleSubmit();
                                    setGracePeriodPrompt(false);
                                  }}
                                  color="primary"
                                  isSubmitting={submitting}
                                >
                                  {submitting ? (
                                    <CircularProgress size={24} color="inherit" />
                                  ) : (
                                    t('safetyPrograms.question.saveWithoutGracePeriod', 'Save without Grace Period')
                                  )}
                                </LoadingButton>
                              </Grid>
                              <Grid item>
                                <Button color="primary" onClick={() => setGracePeriodPrompt(false)}>
                                  {t('safetyPrograms.question.cancelAddingQuestion', 'Cancel Adding Question')}
                                </Button>
                              </Grid>
                            </GridContainer>
                          </DialogActions>
                        </React.Fragment>
                      )}
                    </Dialog>
                  )}
                </GridContainer>
              </Grid>
            </GridContainer>
          </form>
        )}
      </Form>
    );
  }
}

export const QuestionForm = withTranslation()(Component);
