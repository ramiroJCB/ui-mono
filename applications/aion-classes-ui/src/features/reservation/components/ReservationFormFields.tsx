import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Field } from 'react-final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { isEmail, required } from '@pec/aion-ui-core/validators';
import { TextField } from '@pec/aion-ui-form/components/TextField';
import { useTranslation } from 'react-i18next';

const styles = () =>
  createStyles({
    field: {
      '& input': {
        textAlign: 'right'
      }
    }
  });

type OwnProps = {
  maxSeats: number;
};

type Props = WithStyles<typeof styles> & OwnProps;

const Component: React.FC<Props> = ({ classes, maxSeats }) => {
  const { t, i18n } = useTranslation();
  const reservedSeatsCountKey = `reserved-seats-count-${i18n.language}`;
  const maxValue = (max: number) => (value: any) =>
    value && value > max
      ? t('classes.reservation.seatsAvailable', {
          max,
          defaultValue: 'only {{max}} seats available'
        })
      : undefined;

  const composeValidators = (...validators: any[]) => (value: any) =>
    validators.reduce((error, validator) => error || validator(value), undefined);

  return (
    <React.Fragment>
      <Grid item xs={12} sm={3} lg={2}>
        <Field<number>
          InputProps={{ inputProps: { max: maxSeats, type: 'number' } }}
          className={classes.field}
          component={TextField}
          fullWidth
          key={reservedSeatsCountKey}
          label={t('classes.common.seats', 'Seats')}
          name="reservedSeatsCount"
          required
          validateUntouched
          validate={composeValidators(required, maxValue(maxSeats))}
          variant="filled"
        />
      </Grid>
      <Grid item xs={12} sm={9} lg={6}>
        <Field<string>
          name="organizationName"
          label={t('classes.common.organization', 'Organization')}
          component={TextField}
          variant="filled"
          fullWidth
          required
          validate={required}
        />
      </Grid>
      <Grid item xs={12} lg={8}>
        <Field<string>
          name="comment"
          label={t('classes.reservation.commentsForInstructor', 'Comments for Instructor')}
          component={TextField}
          fullWidth
          multiline
          rows="3"
          variant="filled"
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="button">{t('classes.reservation.contactInformation', 'Contact Information')}</Typography>
      </Grid>
      <Grid item xs={12} sm={6} lg={4}>
        <Field<string>
          name="contact.firstName"
          label={t('classes.reservation.firstName', 'First Name')}
          component={TextField}
          variant="filled"
          fullWidth
          required
          validate={required}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={4}>
        <Field<string>
          name="contact.lastName"
          label={t('classes.reservation.lastName', 'Last Name')}
          component={TextField}
          variant="filled"
          fullWidth
          required
          validate={required}
        />
      </Grid>
      <Grid item xs={12}>
        <GridContainer style={{ padding: 0 }}>
          <Grid item xs={12} sm={6} lg={4} style={{ display: 'block' }}>
            <Field<string>
              name="contact.phoneNumber"
              label={t('classes.reservation.phoneNumber', 'Phone Number')}
              component={TextField}
              variant="filled"
              fullWidth
              required
              validate={required}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Field<string>
              name="contact.emailAddress"
              label={t('classes.reservation.email', 'Email')}
              component={TextField}
              variant="filled"
              fullWidth
              required
              validate={composeValidators(required, isEmail)}
            />
          </Grid>
        </GridContainer>
      </Grid>
    </React.Fragment>
  );
};

export const ReservationFormFields = withStyles(styles)(Component);
