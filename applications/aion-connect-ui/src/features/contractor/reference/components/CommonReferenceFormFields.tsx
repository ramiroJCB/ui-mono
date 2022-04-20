import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Field } from 'react-final-form';
import { FieldState } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IReference } from 'interfaces/reference';
import { IReferenceForm } from 'interfaces/referenceForm';
import { maxLength, required, isEmail } from '@pec/aion-ui-core/validators';
import { TextField } from '@pec/aion-ui-form/components/TextField';

type Props = {
  values: IReferenceForm | IReference;
};

export const CommonReferenceFormFields: React.FC<Props> = ({ values: { notes } }) => {
  const composeValidators = (...validators: any[]) => (value: any, allValues: IReferenceForm, meta: FieldState<any>) =>
    validators.reduce((error, validator) => error || validator(value, allValues, meta), undefined);

  return (
    <GridContainer justify="center">
      <Grid item xs={12}>
        <GridContainer>
          <Grid item xs={12}>
            <Field<string>
              name="name"
              label="Name"
              component={TextField}
              fullWidth
              variant="filled"
              required
              validate={composeValidators(maxLength(50), required)}
            />
          </Grid>
          <Grid item xs={12}>
            <Field<string>
              name="phoneNumber"
              label="Phone Number"
              component={TextField}
              fullWidth
              variant="filled"
              required
              validate={composeValidators(maxLength(50), required)}
            />
          </Grid>
          <Grid item xs={12}>
            <Field<string>
              name="emailAddress"
              label="Email Address"
              component={TextField}
              fullWidth
              variant="filled"
              validate={isEmail}
            />
          </Grid>
          <Grid item xs={12}>
            <Field<string>
              name="notes"
              label="Notes"
              component={TextField}
              multiline
              fullWidth
              rows="4"
              variant="filled"
              required
              validate={composeValidators(maxLength(200), required)}
              helperText={notes ? `${notes.length}/200` : '0/200'}
            />
          </Grid>
        </GridContainer>
      </Grid>
    </GridContainer>
  );
};
