import * as React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { Dialog } from '@pec/aion-ui-components/components/Dialog';
import { DialogContentText } from '@material-ui/core';
import { Field, Form, GenericField, InjectedFormProps, reduxForm } from 'redux-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IOrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { IOrganizationFeatureForm } from 'interfaces/organizationFeatureForm';
import { RadioFieldComponent, RadioOwnProps } from './RadioField';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) =>
  createStyles({
    dialogText: {
      fontWeight: theme.typography.fontWeightMedium,
      color: theme.palette.common.black
    },
    assignButton: {
      marginRight: theme.spacing(),
      marginLeft: theme.spacing(),
      background: theme.palette.primary.main,
      color: theme.palette.common.white
    },
    removeButton: {
      marginRight: theme.spacing(),
      marginLeft: theme.spacing(),
      background: theme.palette.error.main,
      color: theme.palette.common.white
    }
  });

type OwnProps = {
  feature: DeepReadonly<IOrganizationFeature>;
  mode: 'assign' | 'remove';
};

type Props = InjectedFormProps<IOrganizationFeatureForm, OwnProps> & OwnProps & WithStyles<typeof styles>;

const AssignRemoveGlobalOrganizationFeatureComponent: React.FC<Props> = ({
  feature,
  mode,
  handleSubmit,
  classes,
  pristine,
  submitting,
  reset
}) => {
  const { t } = useTranslation();

  const RadioFieldCustom = Field as new () => GenericField<RadioOwnProps>;
  const options = [
    { value: 'Contractor', label: t('backoffice.assignRemoveOrganizationFeatures.contractors', 'Contractors') },
    { value: 'Client', label: t('backoffice.assignRemoveOrganizationFeatures.clients', 'Clients') },
    { value: 'All', label: t('backoffice.assignRemoveOrganizationFeatures.allOrganizations', 'All Organizations') }
  ];

  return (
    <Dialog
      onExited={reset}
      renderTriggerButton={props => (
        <Button
          variant="contained"
          className={mode === 'assign' ? classes.assignButton : classes.removeButton}
          {...props}
        >
          {mode === 'assign' ? t('backoffice.common.assign', 'Assign') : t('backoffice.common.remove', 'Remove')}
        </Button>
      )}
    >
      {({ handleClose, handleConfirm }) => (
        <Form onSubmit={handleSubmit}>
          <DialogContent>
            <DialogContentText variant="body1" className={classes.dialogText}>
              {mode === 'assign'
                ? t('backoffice.assignRemoveOrganizationFeatures.whichOrganizations', {
                    defaultValue: 'Which organizations will receive {{friendlyName}}?',
                    friendlyName: feature.friendlyName
                  })
                : t('backoffice.assignRemoveOrganizationFeatures.removeFromOrganization', {
                    defaultValue: 'Remove {{friendlyName}} from which organizations?',
                    friendlyName: feature.friendlyName
                  })}
            </DialogContentText>
            <GridContainer style={{ position: 'relative', minHeight: 160 }}>
              <Grid item xs={12}>
                <RadioFieldCustom component={RadioFieldComponent} options={options} name="organizationType" />
              </Grid>
            </GridContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('backoffice.common.cancel', 'Cancel')}</Button>
            <Button
              type="submit"
              onClick={handleConfirm}
              variant="contained"
              color="secondary"
              disabled={pristine || submitting}
            >
              {mode === 'assign' ? t('backoffice.common.assign', 'Assign') : t('backoffice.common.remove', 'Remove')}
            </Button>
          </DialogActions>
        </Form>
      )}
    </Dialog>
  );
};

export const AssignRemoveGlobalOrganizationFeature = reduxForm<IOrganizationFeatureForm, OwnProps>({
  enableReinitialize: true
})(withStyles(styles)(AssignRemoveGlobalOrganizationFeatureComponent));
