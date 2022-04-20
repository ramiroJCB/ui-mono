import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { required } from '@pec/aion-ui-core/validators';
import { Field, Form } from 'react-final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { DateField } from '@pec/aion-ui-form/components/DateField';
import { IProgramStatusFormFilters } from 'interfaces/programStatusForm';
import { CheckboxField } from '@pec/aion-ui-form/components/CheckboxField';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import { AutocompleteClientsContainer } from '../containers/AutocompleteClients';
import { FieldState } from 'final-form';
import { useDispatch } from 'react-redux';
import { fetchProgramStatusData } from '../actions/fetchProgramStatusData';
import { FormApi } from 'final-form';
import { useHistory } from 'react-router';
import { stringify } from '@pec/aion-ui-core/helpers/querystring';
import moment, { Moment } from 'moment';
import { ExportReportContainer } from './ExportReport';

type Props = {
  initialValues: IProgramStatusFormFilters;
};

export const ProgramStatusFormFilters: React.FC<Props> = ({ initialValues }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit = async (values: IProgramStatusFormFilters, _form: FormApi<IProgramStatusFormFilters>) => {
    const { endDateUtc, beginDateUtc, isForAllClients, clients } = values;
    const clientIds = clients !== undefined ? clients.map(x => x.id) : [];

    history.push({
      search: stringify({
        startDate: moment(beginDateUtc)
          .utc()
          .format(),
        endDate: moment(endDateUtc)
          .utc()
          .format(),
        clientIds: clientIds,
        allClients: isForAllClients.toString()
      })
    });
    await dispatch(fetchProgramStatusData('0', beginDateUtc, endDateUtc));
  };

  const composeValidators = (...validators: any[]) => (
    value: any,
    allValues: IProgramStatusFormFilters,
    meta: FieldState<any>
  ) => validators.reduce((error, validator) => error || validator(value, allValues, meta), undefined);

  const validateStartDate = (
    _value: string,
    { beginDateUtc, endDateUtc }: IProgramStatusFormFilters,
    { pristine }: FieldState<IProgramStatusFormFilters>
  ) => {
    const isValid = endDateUtc && moment(beginDateUtc).isSameOrBefore(endDateUtc);
    console.log(isValid);
    if (pristine) {
      console.log('huh');
      return undefined;
    } else {
      return isValid ? undefined : 'must be on or before End Date';
    }
  };

  const validateEndDate = (
    _value: string,
    { beginDateUtc, endDateUtc }: IProgramStatusFormFilters,
    { pristine }: FieldState<IProgramStatusFormFilters>
  ) => {
    const isValid = endDateUtc && moment(endDateUtc).isSameOrAfter(moment(beginDateUtc));
    if (!beginDateUtc || pristine) {
      return undefined;
    } else {
      return isValid ? undefined : 'must be on or after Start Date';
    }
  };

  return (
    <Form<IProgramStatusFormFilters> initialValues={initialValues} onSubmit={onSubmit}>
      {({ form, handleSubmit }) => (
        <form onSubmit={handleSubmit} noValidate>
          <GridContainer>
            <Grid item xs={6}>
              <FormControlLabel
                label="All Clients"
                control={<Field<boolean> type="checkbox" name="isForAllClients" component={CheckboxField} />}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Field<string>
                name="beginDateUtc"
                label="Start Date"
                component={DateField}
                required
                validate={composeValidators(validateStartDate, required)}
                customOnChange={(value: Moment | null) => {
                  value &&
                    value
                      .utc()
                      .set({ hour: 23, minute: 59, second: 59 })
                      .toISOString();
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
                required
                validate={composeValidators(validateEndDate, required)}
                customOnChange={(value: Moment | null) => {
                  value &&
                    value
                      .utc()
                      .set({ hour: 23, minute: 59, second: 59 })
                      .toISOString();
                  form.change('endDateUtc', value);
                  form.blur('endDateUtc');
                }}
              />
            </Grid>
            {form.getState().values['isForAllClients'] === false && (
              <Grid item xs={12}>
                <AutocompleteClientsContainer />
              </Grid>
            )}
            <Grid item xs={12} style={{ padding: 0 }}>
              <GridContainer>
                <Grid item xs={12}>
                  <ExportReportContainer onSubmit={onSubmit} form={form} />
                </Grid>
              </GridContainer>
            </Grid>
          </GridContainer>
        </form>
      )}
    </Form>
  );
};
