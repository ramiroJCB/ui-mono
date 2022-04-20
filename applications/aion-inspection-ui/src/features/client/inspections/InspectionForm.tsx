import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import React from 'react';
import { AutocompleteContractors } from '../contractors/AutocompleteContractors';
import { DateField } from '@pec/aion-ui-form/components/DateField';
import { Field, Form } from 'react-final-form';
import { IInspectionForm } from 'interfaces/inspection';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { required } from '@pec/aion-ui-core/validators';
import { SelectBusinessUnits } from 'features/client/businessUnits/SelectBusinessUnits';
import { SelectForm } from '../forms/SelectForm';

const today = moment().utc();
const useStyles = makeStyles((theme: Theme) => ({
  item: {
    padding: theme.spacing(2, 0)
  }
}));

type Props = {
  initialValues: IInspectionForm;
  onSubmit: (values: IInspectionForm) => void;
};

export const InspectionForm: React.FC<Props> = ({ initialValues, onSubmit }) => {
  const classes = useStyles();

  return (
    <Form<IInspectionForm> onSubmit={onSubmit} initialValues={initialValues}>
      {({ handleSubmit, invalid, submitting, values: { contractorId } }) => (
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AutocompleteContractors />
            </Grid>
            {contractorId && (
              <React.Fragment>
                <Grid item xs={12}>
                  <SelectForm />
                </Grid>
                <Grid item xs={12}>
                  <SelectBusinessUnits contractorId={contractorId} />
                </Grid>
                <Grid item xs={12}>
                  <Field<string>
                    name="dateOfInspectionUtc"
                    label="Review Date"
                    inputVariant="filled"
                    component={DateField}
                    fullWidth
                    required
                    validate={required}
                    maxDate={today}
                  />
                </Grid>
              </React.Fragment>
            )}
          </Grid>
          {contractorId && (
            <Grid container>
              <Grid item xs={12} classes={{ root: classes.item }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  color={invalid ? 'primary' : 'secondary'}
                  isSubmitting={submitting}
                  disabled={submitting}
                  fullWidth
                >
                  {submitting ? <CircularProgress size={24} color="inherit" /> : 'Start'}
                </LoadingButton>
              </Grid>
            </Grid>
          )}
        </form>
      )}
    </Form>
  );
};
