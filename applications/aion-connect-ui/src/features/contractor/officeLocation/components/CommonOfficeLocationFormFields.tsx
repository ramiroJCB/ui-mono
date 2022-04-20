import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Field } from 'react-final-form';
import { FieldState } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IOfficeLocationForm } from 'interfaces/officeLocationForm';
import { maxLength, required } from '@pec/aion-ui-core/validators';
import { SelectState } from 'components/SelectState';
import { TextField } from '@pec/aion-ui-form/components/TextField';

export const CommonOfficeLocationFormFields: React.FC = () => {
  const composeValidators = (...validators: any[]) => (
    value: any,
    allValues: IOfficeLocationForm,
    meta: FieldState<any>
  ) => validators.reduce((error, validator) => error || validator(value, allValues, meta), undefined);

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
              name="streetAddress"
              label="Street Address"
              component={TextField}
              fullWidth
              variant="filled"
              required
              validate={composeValidators(maxLength(150), required)}
            />
          </Grid>
          <Grid item xs={12}>
            <Field<string>
              name="city"
              label="City"
              component={TextField}
              fullWidth
              variant="filled"
              required
              validate={composeValidators(maxLength(50), required)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Field name="state" validate={required} variant="filled">
              {props => <SelectState {...props} />}
            </Field>
          </Grid>
          <Grid item xs={12} md={6}>
            <Field<string>
              type="number"
              name="postalCode"
              label="Postal Code"
              component={TextField}
              fullWidth
              variant="filled"
              required
              validate={composeValidators(maxLength(5), required)}
            />
          </Grid>
        </GridContainer>
      </Grid>
    </GridContainer>
  );
};
