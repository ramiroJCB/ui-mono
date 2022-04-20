import * as React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import { Dialog } from '@pec/aion-ui-components/components/Dialog';
import { Field, Form, GenericField, InjectedFormProps, reduxForm } from 'redux-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IContact } from 'interfaces/contact';
import { isEmail, required } from '@pec/aion-ui-core/validators';
import { TextField } from '@pec/aion-ui-deprecated/components/TextField';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { TextFieldProps } from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  onDeleteConfirm?: () => Promise<void>;
};

const styles = (theme: Theme) => ({
  confirmDelete: {
    color: theme.palette.error.main
  }
});

type Props = InjectedFormProps<IContact, OwnProps> & WithStyles<typeof styles> & OwnProps;

const ContactFormComponent: React.FC<Props> = ({
  submitting,
  handleSubmit,
  pristine,
  invalid,
  onDeleteConfirm,
  classes
}) => {
  const FieldCustom = Field as new () => GenericField<TextFieldProps>;
  const { t } = useTranslation();
  return (
    <Form onSubmit={handleSubmit}>
      <GridContainer>
        <Grid item xs={12}>
          <FieldCustom
            variant="filled"
            fullWidth
            name="firstName"
            label={t('smart.common.firstName', 'First Name')}
            required
            component={TextField}
            validate={required}
          />
        </Grid>
        <Grid item xs={12}>
          <FieldCustom
            variant="filled"
            fullWidth
            name="lastName"
            label={t('smart.common.lastName', 'Last Name')}
            required
            component={TextField}
            validate={required}
          />
        </Grid>
        <Grid item xs={12}>
          <FieldCustom
            variant="filled"
            fullWidth
            name="emailAddress"
            label={t('smart.common.emailAddress', 'Email Address')}
            required
            component={TextField}
            validate={isEmail}
          />
        </Grid>
        <Grid item xs={12}>
          <FieldCustom
            variant="filled"
            fullWidth
            name="phoneNumber"
            label={t('smart.common.phoneNumber', 'Phone Number')}
            required
            component={TextField}
            validate={required}
          />
        </Grid>
        <Grid item xs={12}>
          <FieldCustom
            variant="filled"
            fullWidth
            name="jobTitle"
            label={t('smart.contactForm.jobTitle', 'Job Title')}
            component={TextField}
          />
        </Grid>
        <Grid item xs={12}>
          <FieldCustom
            variant="filled"
            fullWidth
            multiline
            rowsMax="4"
            name="description"
            label={t('smart.common.description', 'Description')}
            component={TextField}
          />
        </Grid>
        <Grid item xs={onDeleteConfirm ? 6 : 12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={submitting || invalid || pristine}
          >
            {t('smart.common.save', 'Save')}
          </Button>
        </Grid>
        {onDeleteConfirm && (
          <Grid item xs={6}>
            <Dialog
              renderTriggerButton={props => (
                <Button fullWidth className={classes.confirmDelete} {...props}>
                  {t('smart.common.delete', 'Delete')}
                </Button>
              )}
              onConfirm={onDeleteConfirm}
            >
              {({ handleClose, handleConfirm }) => (
                <React.Fragment>
                  <DialogContent>
                    <DialogContentText>
                      {t('smart.contactForm.confirmDelete', 'Are you sure you want to delete this contact?')}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button color="primary" onClick={handleClose}>
                      {t('smart.common.cancel', 'Cancel')}
                    </Button>
                    <Button onClick={handleConfirm} className={classes.confirmDelete}>
                      {t('smart.common.yesDelete', 'Yes, delete it')}
                    </Button>
                  </DialogActions>
                </React.Fragment>
              )}
            </Dialog>
          </Grid>
        )}
      </GridContainer>
    </Form>
  );
};

export const ContactForm = reduxForm<IContact, OwnProps>({ form: 'contactForm' })(
  withStyles(styles)(ContactFormComponent) as any
);
