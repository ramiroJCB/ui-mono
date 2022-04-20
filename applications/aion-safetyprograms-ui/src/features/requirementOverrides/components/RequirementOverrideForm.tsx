import * as React from 'react';
import { DeepReadonly } from 'utility-types';
import { Form, Field } from 'react-final-form';
import { Grid, CircularProgress, Typography } from '@material-ui/core';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IContractorRequirement } from 'interfaces/requirement';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { Prompt } from 'react-router-dom';
import { TextField } from '@pec/aion-ui-form/components/TextField';
import { ClientOverrideStatus, IClientRequirementOverride } from 'interfaces/requirementOverride';
import { addRequirementClientOverride } from 'features/requirementClientOverride/actions/addRequirementClientOverride';
import { updateClientRequirementOverride } from 'features/requirementClientOverride/actions/updateClientRequirementOverride';
import { useDispatch } from 'react-redux';
import { IRequirementOverrideForm } from './RequirementOverrides';
import { usePermission } from 'hooks/usePermission';
import { useTranslation } from 'react-i18next';

type Props = {
  clientRequirementOverride: IClientRequirementOverride | null;
  requirement: DeepReadonly<IContractorRequirement>;
  cancelTo: string;
};

export const RequirementOverrideForm: React.FC<Props> = ({ clientRequirementOverride, requirement }) => {
  const { clientScoreOverrides } = requirement;
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { disabled } = usePermission();

  const onSubmitOverrideUpdate = async (values: IRequirementOverrideForm) => {
    clientRequirementOverride &&
      (await Promise.resolve(
        dispatch(updateClientRequirementOverride(clientRequirementOverride.id, values.status, values.comment))
      ));
  };

  const onSubmitOverrideGrant = async (values: IRequirementOverrideForm) => {
    await Promise.resolve(dispatch(addRequirementClientOverride(values)));
  };

  return (
    <Form
      onSubmit={clientRequirementOverride ? onSubmitOverrideUpdate : onSubmitOverrideGrant}
      initialValues={{
        comment: '',
        status: clientRequirementOverride ? clientRequirementOverride.status : ClientOverrideStatus.None,
        safetyProgramRequirementClientId: clientScoreOverrides[0].id
      }}
    >
      {({ form, handleSubmit, submitting, invalid, pristine }) => {
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
              <Field<string>
                name="comment"
                label={t('safetyPrograms.common.comment', 'Comment')}
                component={TextField}
                fullWidth
                variant="filled"
                multiline
              />
              <Typography variant="caption" color="textSecondary">
                {t(
                  'safetyPrograms.requirementOverrides.commentsAreVisible',
                  'Optional. Comments are visible to all SPE users.'
                )}
              </Typography>
            </GridContainer>
            {clientRequirementOverride && clientRequirementOverride.status === 'Requested' ? (
              <GridContainer>
                <Grid item>
                  <LoadingButton
                    onClick={async () => {
                      await Promise.resolve(form.change('status', ClientOverrideStatus.Approved));
                      handleSubmit();
                    }}
                    type="submit"
                    variant="contained"
                    color="primary"
                    isSubmitting={submitting}
                    isDisabled={invalid || submitting || disabled}
                  >
                    {submitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      t('safetyPrograms.requirementOverrides.approve', 'Approve')
                    )}
                  </LoadingButton>
                </Grid>
                <Grid item>
                  <LoadingButton
                    onClick={async () => {
                      await Promise.resolve(form.change('status', ClientOverrideStatus.Denied));
                      handleSubmit();
                    }}
                    type="submit"
                    variant="contained"
                    color="primary"
                    isSubmitting={submitting}
                    isDisabled={invalid || submitting || disabled}
                  >
                    {submitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      t('safetyPrograms.requirementOverrides.deny', 'Deny')
                    )}
                  </LoadingButton>
                </Grid>
              </GridContainer>
            ) : (
              <GridContainer>
                <Grid item>
                  {!clientRequirementOverride ||
                  clientRequirementOverride.status === ClientOverrideStatus.Removed ||
                  clientRequirementOverride.status === ClientOverrideStatus.Denied ? (
                    <LoadingButton
                      onClick={async () => {
                        await Promise.resolve(form.change('status', ClientOverrideStatus.Granted));
                        handleSubmit();
                      }}
                      type="submit"
                      variant="contained"
                      color="primary"
                      isSubmitting={submitting}
                      isDisabled={invalid || submitting || disabled}
                    >
                      {submitting ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        t('safetyPrograms.requirementOverrides.grant', 'Grant')
                      )}
                    </LoadingButton>
                  ) : (
                    <LoadingButton
                      onClick={async () => {
                        await Promise.resolve(form.change('status', ClientOverrideStatus.Removed));
                        handleSubmit();
                      }}
                      type="submit"
                      variant="contained"
                      color="primary"
                      isSubmitting={submitting}
                      isDisabled={invalid || submitting || disabled}
                    >
                      {submitting ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        t('safetyPrograms.requirementOverrides.remove', 'Remove')
                      )}
                    </LoadingButton>
                  )}
                </Grid>
              </GridContainer>
            )}
          </form>
        );
      }}
    </Form>
  );
};
