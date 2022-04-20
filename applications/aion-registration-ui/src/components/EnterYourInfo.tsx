import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Field, GenericField, InjectedFormProps, reduxForm } from 'redux-form';
import { Form } from 'redux-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { is4Digits, required, validateDate, isValidPhoneNumberWithMaxLength } from '@pec/aion-ui-core/validators';
import { ITrainee } from '../interfaces/trainee';
import { Page } from './Page';
import { StandardTextFieldProps } from '@material-ui/core/TextField';
import { TextField } from '@pec/aion-ui-deprecated/components/TextField';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const FieldCustom = Field as new () => GenericField<StandardTextFieldProps>;

const styles = (theme: Theme) => ({
  form: { margin: `0 ${theme.spacing(2)}px` },
  input: { marginTop: theme.spacing(1.5) },
  button: { marginTop: theme.spacing(3) }
});

type Props = InjectedFormProps<ITrainee> & WithStyles<typeof styles>;

const EnterYourInfo: React.FC<Props> = ({ submitting, handleSubmit, invalid, classes }) => {
  const { t } = useTranslation();
  return (
    <Page title={t('registration.enterYourInfoForm.FinishRegistration', 'Finish Registration')}>
      <Typography variant="h6" align="center">
        {t('registration.enterYourInfoForm.enterInfo', 'Enter Your Information Below')}
      </Typography>
      <GridContainer>
        <Grid item xs={12} className={classes.form}>
          <Form onSubmit={handleSubmit}>
            <FieldCustom
              required
              name="firstName"
              component={TextField}
              label={t('registration.enterYourInfoForm.firstName', 'First Name')}
              placeholder={t('registration.enterYourInfoForm.firstName', 'First Name')}
              disabled={submitting}
              validate={required}
              fullWidth
              className={classes.input}
            />
            <FieldCustom
              required
              name="lastName"
              component={TextField}
              label={t('registration.enterYourInfoForm.lastName', 'Last Name')}
              placeholder={t('registration.enterYourInfoForm.lastName', 'Last Name')}
              disabled={submitting}
              validate={required}
              fullWidth
              className={classes.input}
            />
            <FieldCustom
              required
              name="phoneNumber"
              component={TextField}
              label={t('registration.enterYourInfoForm.phoneNumber', 'Phone Number')}
              placeholder={t('registration.enterYourInfoForm.phoneNumber', 'Phone Number')}
              disabled={submitting}
              validate={[required, isValidPhoneNumberWithMaxLength(25)]}
              fullWidth
              className={classes.input}
            />
            <FieldCustom
              required
              component={TextField}
              type="date"
              name="birthDate"
              label={t('registration.enterYourInfoForm.dateOfBirth', 'Date of Birth')}
              validate={[required, validateDate]}
              fullWidth
              className={classes.input}
              InputLabelProps={{ shrink: true }}
            />
            <FieldCustom
              required
              component={TextField}
              name="ssnLastFour"
              label={t('registration.enterYourInfoForm.last4OfSSN', 'Last 4 of SSN')}
              validate={[required, is4Digits]}
              fullWidth
              className={classes.input}
            />
            <Button
              type="submit"
              disabled={submitting || invalid}
              variant="contained"
              color="secondary"
              fullWidth
              className={classes.button}
            >
              {t('registration.enterYourInfoForm.completeRegistration', 'Complete Registration')}
            </Button>
          </Form>
        </Grid>
      </GridContainer>
    </Page>
  );
};

export default reduxForm<ITrainee>({ form: 'enterYourInfoForm' })(withStyles(styles)(EnterYourInfo));
