import * as React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { CheckboxField } from '@pec/aion-ui-form/components/CheckboxField';
import { DateField } from '@pec/aion-ui-form/components/DateField';
import { dateIsOnOrBefore, maxLength, required } from '@pec/aion-ui-core/validators';
import { Field } from 'react-final-form';
import { FieldState, FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IProject } from 'interfaces/project';
import { IProjectForm } from 'interfaces/projectForm';
import { TextField } from '@pec/aion-ui-form/components/TextField';

type Props = {
  form: FormApi<IProjectForm | IProject>;
  values: IProjectForm | IProject;
};

export const CommonProjectFormFields: React.FC<Props> = ({ form, values: { description, isActive } }) => {
  const composeValidators = (...validators: any[]) => (value: any, allValues: IProjectForm, meta: FieldState<any>) =>
    validators.reduce((error, validator) => error || validator(value, allValues, meta), undefined);

  const today = moment()
    .utc()
    .format();

  const validateDateRange = (
    _value: string,
    { startDateUtc, endDateUtc }: IProjectForm | IProject,
    { pristine }: FieldState<IProjectForm | IProject>
  ) => {
    const isValid = endDateUtc && moment(startDateUtc).isSameOrBefore(endDateUtc);

    if (!startDateUtc || pristine) {
      return undefined;
    } else {
      return isValid ? undefined : 'must be on or after Start Date';
    }
  };

  const handleChangeActiveProject = (form: FormApi<IProjectForm | IProject>) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    form.resetFieldState('endDateUtc');

    if (event.target.checked) {
      form.change('endDateUtc', null);
    }
  };

  return (
    <GridContainer justify="center">
      <Grid item xs={12}>
        <GridContainer>
          <Grid item xs={6}>
            <Field<string>
              name="name"
              label="Job Name"
              component={TextField}
              fullWidth
              variant="filled"
              required
              validate={composeValidators(maxLength(50), required)}
            />
          </Grid>
          <Grid item md={3}>
            <Field<string>
              name="startDateUtc"
              label="Start Date"
              inputVariant="filled"
              component={DateField}
              fullWidth
              required
              validate={composeValidators(dateIsOnOrBefore(today), required)}
              dateFormat="MM/YYYY"
              views={['year', 'month']}
              maxDate={today}
            />
          </Grid>
          <Grid item md={3}>
            <Field<string>
              name="endDateUtc"
              label="End Date"
              inputVariant="filled"
              component={DateField}
              fullWidth
              required={!isActive}
              validate={!isActive ? composeValidators(validateDateRange, dateIsOnOrBefore(today), required) : undefined}
              disabled={isActive}
              key={isActive ? 1 : 0}
              dateFormat="MM/YYYY"
              views={['year', 'month']}
              maxDate={today}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              label="This project is currently active"
              control={
                <Field<boolean>
                  type="checkbox"
                  name="isActive"
                  component={CheckboxField}
                  customOnChange={handleChangeActiveProject(form)}
                />
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Field<string>
              name="description"
              label="Description"
              component={TextField}
              multiline
              fullWidth
              rows="6"
              variant="filled"
              required
              validate={composeValidators(maxLength(500), required)}
              helperText={description ? `${description.length}/500` : '0/500'}
            />
          </Grid>
        </GridContainer>
      </Grid>
    </GridContainer>
  );
};
