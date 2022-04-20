import * as React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { arrayMapIsEqual } from 'helpers/form';
import { BusinessUnitsContainer } from 'features/businessUnits/containers/BusinessUnits';
import { ClientServiceRegionsContainer } from 'features/clientServiceRegions/containers/ClientServiceRegions';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'ts-essentials';
import { deselectRegionalServices, selectRegionalServices } from '../mutators';
import { Dialog, TriggerButtonProps } from '@pec/aion-ui-components/components/Dialog';
import { ErrorButton } from 'components/ErrorButton';
import { Field, Form } from 'react-final-form';
import { FormApi, Mutator } from 'final-form';
import { GracePeriodFields } from 'features/gracePeriodFields/GracePeriodFields';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IMandateForm } from 'interfaces/mandate';
import { ISafetyProgram } from 'interfaces/safetyProgram';
import { Link } from 'react-router-dom';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { MenuItem } from '@material-ui/core';
import { Prompt } from '@pec/aion-ui-components/components/Prompt';
import { RadioField } from '@pec/aion-ui-form/components/RadioField';
import { required } from '@pec/aion-ui-core/validators';
import { TextField } from '@pec/aion-ui-form/components/TextField';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { localizeDate, localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';

type OwnProps = {
  clientId: string;
  initialValues: IMandateForm;
  onConfirmDelete?: () => Promise<void>;
  onSubmit: (values: IMandateForm, form: FormApi<IMandateForm>) => Promise<void>;
  assignableSafetyPrograms: DeepReadonly<ISafetyProgram[]>;
  submitButtonText: string;
};

const styles = (theme: Theme) =>
  createStyles({
    footer: {
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
      bottom: 0
    }
  });

type Props = WithStyles<typeof styles> & OwnProps;

const renderTriggerButton = (props: TriggerButtonProps, t: TFunction) => (
  <ErrorButton {...props}>{t('safetyPrograms.mandate.deleteMandate', 'Delete Mandate')}</ErrorButton>
);

const mutators: { [key: string]: Mutator<IMandateForm> } = {
  selectRegionalServices: ([serviceRegionId, ids]: [string, string[]], state, { changeValue }) =>
    changeValue(state, 'regionalServiceIdsByRegion', selectRegionalServices(serviceRegionId, ids)),
  deselectRegionalServices: ([serviceRegionId, ids]: [string, string[]], state, { changeValue }) =>
    changeValue(state, 'regionalServiceIdsByRegion', deselectRegionalServices(serviceRegionId, ids))
};

const validate = ({ assigneesType, businessUnitIds, regionalServiceIdsByRegion }: IMandateForm) => ({
  businessUnitIds: assigneesType === 'businessUnits' && businessUnitIds.length === 0 ? '*' : undefined,
  regionalServiceIds:
    assigneesType === 'services' && Object.values(regionalServiceIdsByRegion).flat().length === 0 ? '*' : undefined
});

const Component: React.FC<Props> = ({
  clientId,
  initialValues,
  onConfirmDelete,
  onSubmit,
  assignableSafetyPrograms,
  submitButtonText,
  classes
}) => {
  const { t } = useTranslation();

  return (
    <Form onSubmit={onSubmit} initialValues={initialValues} mutators={mutators} validate={validate}>
      {({ handleSubmit, submitting, invalid, pristine, form, errors }) => {
        const { assigneesType, regionalServiceIdsByRegion, safetyProgramId } = form.getState().values;
        const totalSelectedRegionalServices = Object.values(regionalServiceIdsByRegion).flat().length;

        const programExpirationDate = assignableSafetyPrograms.find(({ id }) => id === safetyProgramId)
          ?.gracePeriodExpirationDateUtc;

        return (
          <form onSubmit={handleSubmit} noValidate>
            <Prompt
              when={!submitting && !pristine}
              message={t(
                'safetyPrograms.common.leaveConfirmation',
                'Are you sure you want to leave? Unsaved changes will be lost.'
              )}
            />
            {
              // The regionalServiceIdsByRegion Field only exists so that an isEqual function can be attached.
              // The value is managed by mutators.
            }
            <Field name="regionalServiceIdsByRegion" component="input" type="hidden" isEqual={arrayMapIsEqual} />
            <GridContainer justify="space-between" style={{ padding: 0 }}>
              {!initialValues.safetyProgramId && (
                <Grid item xs={8}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t('safetyPrograms.mandate.selectSafetyProgram', 'Select Program')}
                  </Typography>
                  <Field<string>
                    select
                    name="safetyProgramId"
                    validate={required}
                    component={TextField}
                    required
                    label={t('safetyPrograms.common.safetyProgram', 'Program')}
                    fullWidth
                    variant="filled"
                  >
                    {assignableSafetyPrograms.map(({ id, title }) => (
                      <MenuItem key={id} value={id}>
                        {title}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
              )}
              {programExpirationDate && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">
                    {t('safetyPrograms.mandate.programGracePeriodEnd', {
                      date: localizeDate(programExpirationDate, t),
                      defaultValue: 'Program Grace Period End: {{date}}'
                    })}
                  </Typography>
                </Grid>
              )}
              <GracePeriodFields
                checkboxLabel={t('safetyPrograms.mandate.requirementGracePeriod', 'Requirement Grace Period')}
              />
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('safetyPrograms.mandate.selectAssignees', 'Select Assignees')}
                </Typography>
                <div>
                  <FormControlLabel
                    control={
                      <Field<string>
                        type="radio"
                        color="primary"
                        name="assigneesType"
                        component={RadioField}
                        value="allContractors"
                      />
                    }
                    label={t('safetyPrograms.common.allContractors', 'All Contractors')}
                  />
                </div>
                <div>
                  <FormControlLabel
                    control={
                      <Field<string>
                        type="radio"
                        color="primary"
                        name="assigneesType"
                        component={RadioField}
                        value="businessUnits"
                      />
                    }
                    label={
                      <React.Fragment>
                        {t('safetyPrograms.mandate.businessUnits', 'Business Units')}{' '}
                        {errors.businessUnitIds && (
                          <Typography component="span" color="error">
                            {errors.businessUnitIds}
                          </Typography>
                        )}
                      </React.Fragment>
                    }
                  />
                </div>
                {assigneesType === 'businessUnits' && <BusinessUnitsContainer clientId={clientId} />}
                <div>
                  <FormControlLabel
                    control={
                      <Field<string>
                        type="radio"
                        color="primary"
                        name="assigneesType"
                        component={RadioField}
                        value="services"
                      />
                    }
                    label={
                      <React.Fragment>
                        {t('safetyPrograms.mandate.services', 'Services')}{' '}
                        {errors.regionalServiceIds ? (
                          <Typography component="span" color="error">
                            {errors.regionalServiceIds}
                          </Typography>
                        ) : (
                          assigneesType === 'services' &&
                          totalSelectedRegionalServices > 0 && (
                            <Typography component="span" color="secondary" variant="subtitle2">
                              {localizeNumber(totalSelectedRegionalServices, t)}
                            </Typography>
                          )
                        )}
                      </React.Fragment>
                    }
                  />
                </div>
                {assigneesType === 'services' && <ClientServiceRegionsContainer clientId={clientId} />}
              </Grid>
              <Grid item style={{ padding: 0 }} className={classes.footer}>
                <GridContainer>
                  <Grid item>
                    <Button color="primary" component={Link} to={`/safety-programs/clients/${clientId}`}>
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
                </GridContainer>
              </Grid>
              {onConfirmDelete && (
                <Grid item>
                  <Dialog
                    renderTriggerButton={(triggerButtonProps: TriggerButtonProps) =>
                      renderTriggerButton(triggerButtonProps, t)
                    }
                    onConfirm={onConfirmDelete}
                  >
                    {({ handleClose, handleConfirm }) => (
                      <React.Fragment>
                        <DialogContent>
                          <DialogContentText>
                            {t(
                              'safetyPrograms.mandate.deleteMandateConfirmation',
                              'Are you sure you want to delete this mandate?'
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
          </form>
        );
      }}
    </Form>
  );
};

export const MandateForm = withStyles(styles)(Component);
