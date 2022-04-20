import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Field } from 'react-final-form';
import { FieldState } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { ITradeName } from 'interfaces/tradeName';
import { ITradeNameForm } from 'interfaces/tradeNameForm';
import { maxLength, required } from '@pec/aion-ui-core/validators';
import { TextField } from '@pec/aion-ui-form/components/TextField';

type Props = {
  values: ITradeNameForm | ITradeName;
};

export const CommonTradeNameFormFields: React.FC<Props> = ({ values: { description } }) => {
  const composeValidators = (...validators: any[]) => (value: any, allValues: ITradeNameForm, meta: FieldState<any>) =>
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
              name="description"
              label="Description"
              component={TextField}
              multiline
              fullWidth
              rows="4"
              variant="filled"
              required
              validate={composeValidators(maxLength(250), required)}
              helperText={description ? `${description.length}/250` : '0/250'}
            />
          </Grid>
        </GridContainer>
      </Grid>
    </GridContainer>
  );
};
