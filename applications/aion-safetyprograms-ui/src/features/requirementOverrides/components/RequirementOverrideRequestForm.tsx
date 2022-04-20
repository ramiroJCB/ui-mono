import * as React from 'react';
import Box from '@material-ui/core/Box/Box';
import { DeepReadonly } from 'utility-types';
import { Form, Field } from 'react-final-form';
import { Grid, Typography, CircularProgress, Button } from '@material-ui/core';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IContractorRequirement } from 'interfaces/requirement';
import { IRequirementOverrideRequestForm } from './RequirementOverrides';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { Prompt, Link } from 'react-router-dom';
import { TextField } from '@pec/aion-ui-form/components/TextField';
import { required } from '@pec/aion-ui-core/validators';
import { useTranslation } from 'react-i18next';

type Props = {
  requirement: DeepReadonly<IContractorRequirement>;
  cancelTo: string;
  onSubmit: (values: IRequirementOverrideRequestForm) => Promise<void>;
};

export const RequirementOverrideRequestForm: React.FC<Props> = ({ requirement, cancelTo, onSubmit }) => {
  const { safetyProgramTitle, clients, id: safetyProgramRequirementId } = requirement;
  const { t } = useTranslation();

  return (
    <Form onSubmit={onSubmit} initialValues={{ comment: '', safetyProgramRequirementId }}>
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
                <Box mb={4}>
                  <Typography>
                    {t('safetyPrograms.requirementOverrides.submissionWillRequestException', {
                      safetyProgramTitle,
                      defaultValue:
                        'This submission will request an exception from the following clients for {{safetyProgramTitle}} :'
                    })}
                  </Typography>
                </Box>
                <Box ml={2} mb={3}>
                  <Typography>
                    {clients.map(({ name, id }) => (
                      <li key={id}>{name}</li>
                    ))}
                  </Typography>
                </Box>
                <Typography>
                  {t(
                    'safetyPrograms.requirementOverrides.note',
                    'Note: Future clients requiring this program will also receive this exception request until it is canceled.'
                  )}
                </Typography>
              </Grid>
            </GridContainer>
            <GridContainer>
              <Grid item xs={6}>
                <Field<string>
                  required
                  validate={required}
                  name="comment"
                  label={t('safetyPrograms.common.comment', 'Comment')}
                  component={TextField}
                  fullWidth
                  variant="filled"
                  multiline
                  rows={3}
                />
                <Typography variant="caption" color="textSecondary">
                  {t(
                    'safetyPrograms.requirementOverrides.commentsVisibleWarning',
                    'Required. Comments are visible to all SPE users.'
                  )}
                </Typography>
              </Grid>
            </GridContainer>
            <GridContainer>
              {requirement.status === 'RejectedNotApplicable' && (
                <Grid item>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    isSubmitting={submitting}
                    disabled={pristine || invalid || submitting}
                  >
                    {submitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      t('safetyPrograms.requirementOverrides.submit', 'Submit')
                    )}
                  </LoadingButton>
                </Grid>
              )}
              <Grid item>
                <Button color="primary" component={Link} to={cancelTo}>
                  {t('safetyPrograms.common.cancel', 'Cancel')}
                </Button>
              </Grid>
            </GridContainer>
          </form>
        );
      }}
    </Form>
  );
};
