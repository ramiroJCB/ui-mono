import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { required } from '@pec/aion-ui-core/validators';
import { Field, Form } from 'react-final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { DateField } from '@pec/aion-ui-form/components/DateField';
import { FieldState } from 'final-form';
import { IProgramKpiForm } from 'interfaces/programKpiForm';
import { ExportProgramKpiReportContainer } from './ExportReport';
import moment, { Moment } from 'moment';

type Props = {
  initialValues: IProgramKpiForm;
};

export const ProgramKpiReportFormFilters: React.FC<Props> = ({ initialValues }) => {
  const onSubmit = async (values: IProgramKpiForm) => {
    await Promise.resolve(values);
  };

  const composeValidators = (...validators: any[]) => (value: any, allValues: IProgramKpiForm, meta: FieldState<any>) =>
    validators.reduce((error, validator) => error || validator(value, allValues, meta), undefined);

  const validateStartDate = (
    _value: string,
    { beginDateUtc, endDateUtc }: IProgramKpiForm,
    { pristine }: FieldState<IProgramKpiForm>
  ) => {
    const isValid = endDateUtc && moment(beginDateUtc).isSameOrBefore(endDateUtc);
    if (pristine) {
      return undefined;
    } else {
      return isValid ? undefined : 'must be on or before End Date';
    }
  };

  const validateEndDate = (
    _value: string,
    { beginDateUtc, endDateUtc }: IProgramKpiForm,
    { pristine }: FieldState<IProgramKpiForm>
  ) => {
    const isValid = endDateUtc && moment(endDateUtc).isSameOrAfter(moment(beginDateUtc));
    if (!beginDateUtc || pristine) {
      return undefined;
    } else {
      return isValid ? undefined : 'must be on or after Start Date';
    }
  };

  return (
    <Form<IProgramKpiForm> initialValues={initialValues} onSubmit={onSubmit}>
      {({ form, handleSubmit }) => (
        <form onSubmit={handleSubmit} noValidate>
          <GridContainer>
            <Grid item xs={12} sm={3}>
              <Field<string>
                name="beginDateUtc"
                label="Start Date"
                component={DateField}
                validate={composeValidators(validateStartDate, required)}
                customOnChange={(value: Moment | null) => {
                  form.change('beginDateUtc', value);
                  form.blur('beginDateUtc');
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Field<string>
                name="endDateUtc"
                label="End Date"
                component={DateField}
                customOnChange={(value: Moment | null) => {
                  form.change('endDateUtc', value);
                  form.blur('endDateUtc');
                }}
                validate={composeValidators(validateEndDate, required)}
              />
            </Grid>
            <Grid item xs={12} style={{ padding: 0 }}>
              <GridContainer>
                <Grid item xs={12}>
                  <ExportProgramKpiReportContainer onSubmit={onSubmit} form={form} />
                </Grid>
              </GridContainer>
            </Grid>
          </GridContainer>
        </form>
      )}
    </Form>
  );
};
