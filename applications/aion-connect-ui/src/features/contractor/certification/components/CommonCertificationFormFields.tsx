import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { DateField } from '@pec/aion-ui-form/components/DateField';
import { dateIsOnOrBefore, maxLength, required } from '@pec/aion-ui-core/validators';
import { Field } from 'react-final-form';
import { FieldState } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { ICertificationForm } from 'interfaces/certificationForm';
import { TextField } from '@pec/aion-ui-form/components/TextField';

export const CommonCertificationFormFields: React.FC = () => {
  const composeValidators = (...validators: any[]) => (
    value: any,
    allValues: ICertificationForm,
    meta: FieldState<any>
  ) => validators.reduce((error, validator) => error || validator(value, allValues, meta), undefined);

  const today = moment()
    .utc()
    .format();

  return (
    <GridContainer justify="center">
      <Grid item xs={12}>
        <GridContainer>
          <Grid item xs={12}>
            <Field<string>
              name="name"
              label="Certification Name"
              component={TextField}
              fullWidth
              variant="filled"
              required
              validate={composeValidators(maxLength(50), required)}
            />
          </Grid>
          <Grid item xs={12}>
            <Field<string>
              name="issueDateUtc"
              label="Issue Date"
              inputVariant="filled"
              component={DateField}
              fullWidth
              required
              validate={composeValidators(dateIsOnOrBefore(today), required)}
              maxDate={today}
            />
          </Grid>
          <Grid item xs={12}>
            <Field<string>
              name="certificationId"
              label="ID"
              component={TextField}
              fullWidth
              variant="filled"
              required
              validate={composeValidators(maxLength(50), required)}
            />
          </Grid>
        </GridContainer>
      </Grid>
    </GridContainer>
  );
};
